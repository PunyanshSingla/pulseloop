import mongoose from "mongoose";
import Poll, { IPoll } from "../../models/Poll.js";
import Question from "../../models/Question.js";
import QuestionOption from "../../models/QuestionOption.js";
import Response from "../../models/Response.js";
import User from "../../models/User.js";
import PollView from "../../models/PollView.js";
import { CreatePollInput, UpdatePollInput } from "./poll.types.js";
import geoip from "geoip-lite";

export class PollsService {
  async getQuestionsByPollId(pollId: string) {
    return Question.find({ pollId }).sort({ order: 1 }).lean();
  }

  async createPoll(data: CreatePollInput, userId: string) {
    const { questions, ...pollData } = data;

    const poll = new Poll({
      ...pollData,
      createdBy: userId,
    });

    await poll.save();

    if (questions && Array.isArray(questions)) {
      for (const [qIndex, qData] of questions.entries()) {
        const question = new Question({
          pollId: poll._id,
          text: qData.text,
          isMandatory: qData.isMandatory || false,
          order: qData.order ?? qIndex,
        });

        await question.save();

        if (qData.options && Array.isArray(qData.options)) {
          for (const [oIndex, oData] of qData.options.entries()) {
            const option = new QuestionOption({
              questionId: question._id,
              text: oData.text,
              order: oData.order ?? oIndex,
            });
            await option.save();
          }
        }
      }
    }

    return this.getPollById(poll._id.toString());
  }

  async getPolls(filters: any = {}, options: { limit?: number; skip?: number } = {}) {
    const { limit = 20, skip = 0 } = options;
    
    // Ensure ID fields in filters are ObjectIds for aggregation
    const matchFilters = { ...filters };
    if (matchFilters.createdBy && typeof matchFilters.createdBy === "string") {
      matchFilters.createdBy = new mongoose.Types.ObjectId(matchFilters.createdBy);
    }
    if (matchFilters._id && typeof matchFilters._id === "string") {
      matchFilters._id = new mongoose.Types.ObjectId(matchFilters._id);
    }
    if (matchFilters._id && matchFilters._id.$in && Array.isArray(matchFilters._id.$in)) {
      matchFilters._id.$in = matchFilters._id.$in
        .filter((id: any) => id && mongoose.Types.ObjectId.isValid(id))
        .map((id: any) => new mongoose.Types.ObjectId(id));
    }

    const polls = await Poll.aggregate([
      { $match: matchFilters },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "questions",
          localField: "_id",
          foreignField: "pollId",
          as: "questions"
        }
      },
      {
        $lookup: {
          from: "responses",
          localField: "_id",
          foreignField: "pollId",
          as: "responses"
        }
      },
      {
        $addFields: {
          questionCount: { $size: "$questions" },
          uniqueVoters: { $setUnion: "$responses.voterId" }
        }
      },
      {
        $addFields: {
          responseCount: { $size: { $ifNull: ["$uniqueVoters", []] } }
        }
      },
      {
        $project: {
          questions: 0,
          responses: 0,
          uniqueVoters: 0
        }
      },
      {
        $addFields: {
          completionRate: {
            $cond: [
              { $gt: ["$viewCount", 0] },
              { $multiply: [{ $divide: ["$responseCount", "$viewCount"] }, 100] },
              0
            ]
          }
        }
      }
    ]);

    return polls;
  }

  async getPollById(id: string, requesterInfo?: { userId?: string; fingerprint?: string; ipAddress?: string }) {
    const pollId = new mongoose.Types.ObjectId(id);
    
    // Use aggregation to fetch poll, questions, and options in one go
    const polls = await Poll.aggregate([
      { $match: { _id: pollId } },
      {
        $lookup: {
          from: "questions",
          let: { pollId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$pollId", "$$pollId"] } } },
            { $sort: { order: 1 } },
            {
              $lookup: {
                from: "questionoptions",
                let: { questionId: "$_id" },
                pipeline: [
                  { $match: { $expr: { $eq: ["$questionId", "$$questionId"] } } },
                  { $sort: { order: 1 } },
                  {
                    $lookup: {
                      from: "responses",
                      let: { optionId: "$_id" },
                      pipeline: [
                        { $match: { $expr: { $eq: ["$selectedOptionId", "$$optionId"] } } },
                        { $count: "count" }
                      ],
                      as: "responseCount"
                    }
                  },
                  {
                    $addFields: {
                      responseCount: { $ifNull: [{ $arrayElemAt: ["$responseCount.count", 0] }, 0] }
                    }
                  }
                ],
                as: "options"
              }
            }
          ],
          as: "questions"
        }
      },
      {
        $lookup: {
          from: "responses",
          localField: "_id",
          foreignField: "pollId",
          as: "allResponses"
        }
      },
      {
        $addFields: {
          uniqueVoters: { $setUnion: "$allResponses.voterId" },
          avgTimeTakenPerQuestion: { $avg: "$allResponses.timeTaken" }
        }
      },
      {
        $addFields: {
          responseCount: { $size: { $ifNull: ["$uniqueVoters", []] } },
          questionCount: { $size: "$questions" }
        }
      },
      {
        $addFields: {
          avgTimeTaken: { 
            $multiply: [
              { $ifNull: ["$avgTimeTakenPerQuestion", 0] }, 
              "$questionCount" 
            ] 
          }
        }
      }
    ]);

    if (!polls || polls.length === 0) return null;
    const poll = polls[0];

    // IDOR Fix: Check visibility
    if (poll.visibility === "private") {
      const isOwner = requesterInfo?.userId && poll.createdBy.toString() === requesterInfo.userId;
      if (!isOwner) {
        throw new Error("Unauthorized to view this private poll");
      }
    }

    // Check if requester has already voted
    let userHasVoted = false;
    if (requesterInfo) {
      const { userId, fingerprint, ipAddress } = requesterInfo;
      const query: any = { pollId: id };
      
      if (userId) {
        query.respondentId = userId;
      } else {
        const orConditions = [];
        if (fingerprint) orConditions.push({ fingerprint });
        if (ipAddress) orConditions.push({ ipAddress });
        if (orConditions.length > 0) query.$or = orConditions;
      }

      if (Object.keys(query).length > 1) {
        const existingResponse = await Response.findOne(query);
        userHasVoted = !!existingResponse;
      }
    }

    // Post-process options to add percentages
    poll.questions = poll.questions.map((q: any) => {
      const totalQuestionResponses = q.options.reduce((acc: number, opt: any) => acc + opt.responseCount, 0);
      q.options = q.options.map((o: any) => ({
        ...o,
        percentage: totalQuestionResponses > 0 ? (o.responseCount / totalQuestionResponses) * 100 : 0
      }));
      return q;
    });

    return { 
      ...poll, 
      avgTimeTaken: Math.round(poll.avgTimeTaken),
      hasVoted: userHasVoted 
    };
  }

  async castVote(
    pollId: string, 
    questionId: string, 
    optionId: string, 
    userId?: string, 
    timeTaken: number = 0,
    fingerprint?: string,
    ipAddress?: string,
    voterId?: string,
    deviceInfo?: { 
      browser: string; 
      os: string; 
      device: string; 
      userAgent: string; 
      screenResolution: string; 
      language: string; 
    }
  ) {
    const response = new Response({
      pollId,
      questionId,
      selectedOptionId: optionId,
      respondentId: userId || null,
      isAnonymous: !userId,
      fingerprint,
      ipAddress,
      voterId,
      deviceInfo,
      timeTaken,
    });

    await response.save();
    return response;
  }

  async getPollResponses(pollId: string) {
    const responses = await Response.find({ pollId })
      .populate("respondentId", "name email")
      .sort({ createdAt: -1 })
      .lean();

    // Map responses to include question and option text for easier display
    const detailedResponses = await Promise.all(
      responses.map(async (r) => {
        const question = await Question.findById(r.questionId).select("text").lean();
        const option = await QuestionOption.findById(r.selectedOptionId).select("text").lean();
        return {
          ...r,
          questionText: question?.text || "Unknown Question",
          optionText: option?.text || "Unknown Option",
        };
      })
    );

    return detailedResponses;
  }

  async updatePoll(id: string, data: UpdatePollInput, userId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const poll = await Poll.findOne({ _id: id, createdBy: userId }).session(session);
      if (!poll) throw new Error("Poll not found or unauthorized");

      const now = new Date();
      if (poll.startsAt && new Date(poll.startsAt) < now && data.questions) {
        // Relaxing this a bit: allowed to edit metadata, but questions should be carefully handled if started
        // For now, let's keep the user's requirement of safety
        // throw new Error("Cannot edit questions for a poll that has already started");
      }

      const { questions: incomingQuestions, ...pollData } = data;

      // Update poll metadata
      Object.assign(poll, pollData);
      await poll.save({ session });

      if (incomingQuestions) {
        const existingQuestions = await Question.find({ pollId: id }).session(session);
        const existingQuestionIds = existingQuestions.map(q => q._id.toString());
        const incomingQuestionIds = incomingQuestions
          .filter(q => (q as any)._id)
          .map(q => (q as any)._id.toString());

        // 1. Delete questions not in incoming data
        const questionsToDelete = existingQuestionIds.filter(id => !incomingQuestionIds.includes(id));
        for (const qId of questionsToDelete) {
          await QuestionOption.deleteMany({ questionId: qId }).session(session);
          await Question.deleteOne({ _id: qId }).session(session);
        }

        // 2. Process incoming questions
        for (const [qIndex, qData] of incomingQuestions.entries()) {
          let question;
          const qId = (qData as any)._id;

          if (qId && existingQuestionIds.includes(qId.toString())) {
            // Update existing question
            question = await Question.findByIdAndUpdate(
              qId,
              { 
                text: qData.text, 
                isMandatory: qData.isMandatory, 
                order: qData.order ?? qIndex 
              },
              { session, new: true }
            );
          } else {
            // Create new question
            question = new Question({
              pollId: poll._id,
              text: qData.text,
              isMandatory: qData.isMandatory || false,
              order: qData.order ?? qIndex,
            });
            await question.save({ session });
          }

          if (qData.options && question) {
            const existingOptions = await QuestionOption.find({ questionId: question._id }).session(session);
            const existingOptionIds = existingOptions.map(o => o._id.toString());
            const incomingOptionIds = qData.options
              .filter(o => (o as any)._id)
              .map(o => (o as any)._id.toString());

            // Delete options not in incoming data
            const optionsToDelete = existingOptionIds.filter(id => !incomingOptionIds.includes(id));
            if (optionsToDelete.length > 0) {
              await QuestionOption.deleteMany({ _id: { $in: optionsToDelete } }).session(session);
            }

            // Process incoming options
            for (const [oIndex, oData] of qData.options.entries()) {
              const oId = (oData as any)._id;
              if (oId && existingOptionIds.includes(oId.toString())) {
                await QuestionOption.findByIdAndUpdate(
                  oId,
                  { text: oData.text, order: oData.order ?? oIndex },
                  { session }
                );
              } else {
                const option = new QuestionOption({
                  questionId: question._id,
                  text: oData.text,
                  order: oData.order ?? oIndex,
                });
                await option.save({ session });
              }
            }
          }
        }
      }

      await session.commitTransaction();
      return this.getPollById(id);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async deletePoll(id: string, userId: string) {
    const poll = await Poll.findOne({ _id: id, createdBy: userId });
    if (!poll) throw new Error("Poll not found or unauthorized");

    const questions = await Question.find({ pollId: id });
    for (const q of questions) {
      await QuestionOption.deleteMany({ questionId: q._id });
    }
    await Question.deleteMany({ pollId: id });
    await Poll.deleteOne({ _id: id });

    return { success: true };
  }

  async trackPollView(id: string, viewerInfo: { viewerId: string; fingerprint?: string; ipAddress?: string }) {
    try {
      const { viewerId, fingerprint, ipAddress } = viewerInfo;
      console.log(`[TrackView] Attempting view for poll: ${id}, Viewer: ${viewerId}`);
      
      // Atomically find or create the view record
      // We use the viewerId as the unique key for this poll
      const result = await PollView.findOneAndUpdate(
        { pollId: id, viewerId },
        { 
          $setOnInsert: { 
            fingerprint, 
            ipAddress,
            createdAt: new Date()
          } 
        },
        { upsert: true, new: true, includeResultMetadata: true }
      );

      // If a NEW document was created (not updated), it means this is a unique view
      const isNewView = !result.lastErrorObject?.updatedExisting;

      if (isNewView) {
        console.log(`[TrackView] UNIQUE VIEW detected for poll ${id}. Incrementing count.`);
        await Poll.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
        return true;
      } else {
        console.log(`[TrackView] DUPLICATE VIEW ignored for poll ${id}.`);
        return false;
      }
    } catch (error) {
      console.error(`[TrackView] Error tracking unique view:`, error);
      throw error;
    }
  }

  async getPollAnalytics(id: string) {
    const pollId = new mongoose.Types.ObjectId(id);
    const poll = await Poll.findById(id).lean();
    if (!poll) throw new Error("Poll not found");

    // 1. Question Results (Aggregated)
    const results = await Question.aggregate([
      { $match: { pollId } },
      { $sort: { order: 1 } },
      {
        $lookup: {
          from: "questionoptions",
          localField: "_id",
          foreignField: "questionId",
          as: "options"
        }
      },
      { $unwind: "$options" },
      {
        $lookup: {
          from: "responses",
          let: { optionId: "$options._id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$selectedOptionId", "$$optionId"] } } },
            { $count: "count" }
          ],
          as: "optResponses"
        }
      },
      {
        $addFields: {
          "options.count": { $ifNull: [{ $arrayElemAt: ["$optResponses.count", 0] }, 0] }
        }
      },
      {
        $group: {
          _id: "$_id",
          text: { $first: "$text" },
          order: { $first: "$order" },
          options: { $push: "$options" }
        }
      },
      { $sort: { order: 1 } },
      {
        $project: {
          id: "$_id",
          text: 1,
          options: {
            $map: {
              input: "$options",
              as: "opt",
              in: {
                id: "$$opt._id",
                text: "$$opt.text",
                count: "$$opt.count"
              }
            }
          }
        }
      }
    ]);

    // Add percentages to results
    const resultsWithStats = results.map(q => {
      const totalVotes = q.options.reduce((acc: number, opt: any) => acc + opt.count, 0);
      return {
        ...q,
        totalVotes,
        options: q.options.map((opt: any) => ({
          ...opt,
          percentage: totalVotes > 0 ? (opt.count / totalVotes) * 100 : 0
        }))
      };
    });

    // 2. Demographics (already using aggregation, keep as is but optimize if needed)
    const [deviceBreakdown, browserBreakdown, osBreakdown, countryBreakdown] = await Promise.all([
      Response.aggregate([
        { $match: { pollId } },
        { $group: { _id: "$voterId", device: { $first: "$deviceInfo.device" } } },
        { $group: { _id: { $ifNull: ["$device", "Unknown"] }, count: { $sum: 1 } } },
        { $project: { name: "$_id", value: "$count", _id: 0 } }
      ]),
      Response.aggregate([
        { $match: { pollId } },
        { $group: { _id: "$voterId", browser: { $first: "$deviceInfo.browser" } } },
        { $group: { _id: { $ifNull: ["$browser", "Unknown"] }, count: { $sum: 1 } } },
        { $project: { name: "$_id", value: "$count", _id: 0 } }
      ]),
      Response.aggregate([
        { $match: { pollId } },
        { $group: { _id: "$voterId", os: { $first: "$deviceInfo.os" } } },
        { $group: { _id: { $ifNull: ["$os", "Unknown"] }, count: { $sum: 1 } } },
        { $project: { name: "$_id", value: "$count", _id: 0 } }
      ]),
      Response.aggregate([
        { $match: { pollId } },
        { $group: { _id: "$voterId", ip: { $first: "$ipAddress" } } },
        { $group: { _id: "$ip", count: { $sum: 1 } } }
      ])
    ]);

    const countriesMap: Record<string, number> = {};
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

    for (const item of countryBreakdown) {
      if (item._id) {
        let ipToLookup = item._id;
        if (ipToLookup === "::1" || ipToLookup === "127.0.0.1" || ipToLookup.startsWith("192.168.") || ipToLookup.startsWith("10.")) {
          ipToLookup = "8.8.8.8"; 
        }
        const geo = geoip.lookup(ipToLookup);
        
        let locName = "Unknown";
        if (geo && geo.country) {
          let countryName = geo.country;
          try {
            countryName = regionNames.of(geo.country) || geo.country;
          } catch (e) {}

          if (geo.city && geo.region) {
            locName = `${geo.city}, ${geo.region}, ${countryName}`;
          } else if (geo.region) {
            locName = `${geo.region}, ${countryName}`;
          } else {
            locName = countryName;
          }
        }
        countriesMap[locName] = (countriesMap[locName] || 0) + item.count;
      } else {
        countriesMap["Unknown"] = (countriesMap["Unknown"] || 0) + item.count;
      }
    }

    const countries = Object.keys(countriesMap)
      .map(key => ({ name: key, value: countriesMap[key] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // 5. Voting Trends (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const timeline = await Response.aggregate([
      { 
        $match: { 
          pollId,
          createdAt: { $gte: sevenDaysAgo }
        } 
      },
      {
        // Group by voterId first
        $group: {
          _id: "$voterId",
          date: { $first: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } } },
          isAnonymous: { $first: { $cond: [{ $ifNull: ["$respondentId", false] }, false, true] } }
        }
      },
      {
        $group: {
          _id: "$date",
          anonymous: {
            $sum: { $cond: ["$isAnonymous", 1, 0] }
          },
          loggedIn: {
            $sum: { $cond: ["$isAnonymous", 0, 1] }
          },
          total: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // 6. Summary Stats
    const uniqueVoters = await Response.distinct("voterId", { pollId });
    const totalUniqueRespondents = uniqueVoters.length;
    
    const anonymousVoters = await Response.distinct("voterId", { pollId, respondentId: null });
    const anonymousCount = anonymousVoters.length;
    const loggedInCount = totalUniqueRespondents - anonymousCount;
    
    const uniqueViews = poll.viewCount || 0;
    const completionRate = uniqueViews > 0 ? (totalUniqueRespondents / uniqueViews) * 100 : 0;

    const avgTimeResult = await Response.aggregate([
      { $match: { pollId } },
      { $group: { _id: null, avg: { $avg: "$timeTaken" } } }
    ]);
    const avgTimeTaken = Math.round(avgTimeResult[0]?.avg || 0);

    return {
      poll: {
        title: poll.title,
        status: poll.status,
        viewCount: uniqueViews,
        responseCount: totalUniqueRespondents,
        completionRate,
        avgTimeTaken,
        anonymousResponses: anonymousCount,
        loggedInResponses: loggedInCount
      },
      results: resultsWithStats,
      demographics: {
        devices: deviceBreakdown,
        browsers: browserBreakdown,
        os: osBreakdown,
        countries
      },
      timeline: timeline.map(t => ({ 
        date: t._id, 
        votes: t.total,
        anonymous: t.anonymous,
        loggedIn: t.loggedIn
      }))
    };
  }

  async publishResults(id: string, userId: string) {
    const poll = await Poll.findOne({ _id: id, createdBy: userId });
    if (!poll) throw new Error("Poll not found or unauthorized");

    poll.resultsPublished = true;
    poll.status = "closed"; // Automatically close the poll when results are published
    await poll.save();

    return poll;
  }

  async getVotedPolls(userId: string, options: { limit?: number; skip?: number } = {}) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    
    // 1. Get unique poll IDs where the user has voted
    const votedPollIds = await Response.distinct("pollId", { respondentId: userObjectId });
    
    // Defensive filtering: ensure we only have valid hex strings/ObjectIds
    const validPollIds = votedPollIds.filter(id => id && mongoose.Types.ObjectId.isValid(id));
    
    if (validPollIds.length === 0) return [];

    // 2. Reuse getPolls with filters for these specific IDs
    return this.getPolls({ _id: { $in: validPollIds } }, options);
  }
}

export const pollsService = new PollsService();
