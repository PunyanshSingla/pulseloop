import mongoose from "mongoose";
import Poll, { IPoll } from "../../models/Poll";
import Question from "../../models/Question";
import QuestionOption from "../../models/QuestionOption";
import Response from "../../models/Response";
import User from "../../models/User";
import PollView from "../../models/PollView";
import { CreatePollInput, UpdatePollInput } from "./poll.types";

export class PollsService {
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

  async getPolls(filters: any = {}) {
    const polls = await Poll.find(filters).sort({ createdAt: -1 }).lean();
    
    // Add analytics for each poll
    const pollsWithCounts = await Promise.all(
      polls.map(async (poll) => {
        const questionCount = await Question.countDocuments({ pollId: poll._id });
        const responses = await Response.find({ pollId: poll._id }).distinct("respondentId");
        
        // For anonymous responses, we might need a different way to count unique participants
        // but for now, let's use the raw count divided by questions as a proxy if respondentId is missing
        const totalResponses = await Response.countDocuments({ pollId: poll._id });
        const responseCount = questionCount > 0 ? Math.ceil(totalResponses / questionCount) : totalResponses;
        
        return { ...poll, responseCount, questionCount };
      })
    );

    return pollsWithCounts;
  }

  async getPollById(id: string, requesterInfo?: { userId?: string; fingerprint?: string; ipAddress?: string }) {
    const poll = await Poll.findById(id).lean();
    if (!poll) return null;

    const questions = await Question.find({ pollId: id }).sort({ order: 1 }).lean();
    const questionCount = questions.length;
    
    // Check if requester has already voted
    let userHasVoted = false;
    if (requesterInfo) {
      const { userId, fingerprint, ipAddress } = requesterInfo;
      const query: any = { pollId: id };
      
      if (userId) {
        query.respondentId = userId;
      } else if (fingerprint || ipAddress) {
        query.$or = [];
        if (fingerprint) query.$or.push({ fingerprint });
        if (ipAddress) query.$or.push({ ipAddress });
      }

      if (Object.keys(query).length > 1) {
        const existingResponse = await Response.findOne(query);
        userHasVoted = !!existingResponse;
      }
    }
    const totalRawResponses = await Response.countDocuments({ pollId: id });
    const totalPollResponses = questionCount > 0 ? Math.ceil(totalRawResponses / questionCount) : totalRawResponses;
    const avgTimeResult = await Response.aggregate([
      { $match: { pollId: new mongoose.Types.ObjectId(id) } },
      { $group: { _id: null, avgTime: { $avg: "$timeTaken" } } }
    ]);
    
    // Total avg time for the whole poll is the average time per question multiplied by number of questions
    const avgTimeTaken = avgTimeResult.length > 0 
      ? Math.round(avgTimeResult[0].avgTime * questionCount) 
      : 0;
    
    const questionsWithOptions = await Promise.all(
      questions.map(async (q) => {
        const options = await QuestionOption.find({ questionId: q._id })
          .sort({ order: 1 })
          .lean();

        const optionsWithStats = await Promise.all(
          options.map(async (o) => {
            const count = await Response.countDocuments({ selectedOptionId: o._id });
            const totalQuestionResponses = await Response.countDocuments({ questionId: q._id });
            const percentage = totalQuestionResponses > 0 ? (count / totalQuestionResponses) * 100 : 0;
            return { ...o, responseCount: count, percentage };
          })
        );

        return { ...q, options: optionsWithStats };
      })
    );

    return { 
      ...poll, 
      questions: questionsWithOptions, 
      responseCount: totalPollResponses,
      avgTimeTaken,
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
    const poll = await Poll.findOne({ _id: id, createdBy: userId });
    if (!poll) throw new Error("Poll not found or unauthorized");

    const { questions, ...pollData } = data;

    // Update poll metadata
    Object.assign(poll, pollData);
    await poll.save();

    // If questions are provided, we replace them (simplest implementation for now)
    // A more complex implementation would diff and update/delete/add
    if (questions) {
      // Delete old questions and options
      const oldQuestions = await Question.find({ pollId: id });
      for (const q of oldQuestions) {
        await QuestionOption.deleteMany({ questionId: q._id });
      }
      await Question.deleteMany({ pollId: id });

      // Re-create new questions and options
      for (const [qIndex, qData] of questions.entries()) {
        const question = new Question({
          pollId: poll._id,
          text: qData.text,
          isMandatory: qData.isMandatory || false,
          order: qData.order ?? qIndex,
        });
        await question.save();

        if (qData.options) {
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

    return this.getPollById(id);
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
    console.log("request coming at poll analytics", id)
    const pollId = new mongoose.Types.ObjectId(id);
    const poll = await Poll.findById(id).lean();
    console.log("poll from analytics", poll)
    if (!poll) throw new Error("Poll not found");

    // 1. Question Results
    const questions = await Question.find({ pollId: id }).lean();
    const responses = await Response.find({ pollId: id }).lean();
    console.log("question and responses lenght", questions.length, responses.length)
    const results = await Promise.all(questions.map(async (q) => {
      const options = await QuestionOption.find({ questionId: q._id }).lean();
      console.log("options", options.length)
      const questionResponses = responses.filter(r => r.questionId?.toString() === q._id.toString());
      console.log("question responses", questionResponses.length)
      const optionStats = options.map(o => {
        const count = questionResponses.filter(r => r.selectedOptionId?.toString() === o._id.toString()).length;
        return {
          id: o._id,
          text: o.text,
          count,
          percentage: questionResponses.length > 0 ? (count / questionResponses.length) * 100 : 0
        };
      });

      return {
        id: q._id,
        text: q.text,
        totalVotes: questionResponses.length,
        options: optionStats
      };
    }));
    console.log("results", results)
    // 2. Device Breakdown
    const deviceBreakdown = await Response.aggregate([
      { $match: { pollId } },
      { $group: { _id: "$deviceInfo.device", count: { $sum: 1 } } }
    ]);
    console.log("device breakdown", deviceBreakdown)

    // 3. Browser Breakdown
    const browserBreakdown = await Response.aggregate([
      { $match: { pollId } },
      { $group: { _id: "$deviceInfo.browser", count: { $sum: 1 } } }
    ]);

    // 4. OS Breakdown
    const osBreakdown = await Response.aggregate([
      { $match: { pollId } },
      { $group: { _id: "$deviceInfo.os", count: { $sum: 1 } } }
    ]);

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
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          votes: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // 6. Summary Stats
    const totalResponses = await Response.countDocuments({ pollId: pollId });
    const uniqueViews = poll.viewCount || 0;
    const completionRate = uniqueViews > 0 ? (totalResponses / uniqueViews) * 100 : 0;

    const avgTimeResult = await Response.aggregate([
      { $match: { pollId } },
      { $group: { _id: null, avg: { $avg: "$timeTaken" } } }
    ]);
    const avgTimeTaken = Math.round(avgTimeResult[0]?.avg || 0);
    console.log("poll view count " , uniqueViews)
    return {
      poll: {
        title: poll.title,
        status: poll.status,
        viewCount: uniqueViews,
        responseCount: totalResponses,
        completionRate,
        avgTimeTaken
      },
      results,
      demographics: {
        devices: deviceBreakdown.map(d => ({ name: d._id || "Desktop", value: d.count })),
        browsers: browserBreakdown.map(b => ({ name: b._id || "Unknown", value: b.count })),
        os: osBreakdown.map(o => ({ name: o._id || "Unknown", value: o.count }))
      },
      timeline: timeline.map(t => ({ date: t._id, votes: t.votes }))
    };
  }
}

export const pollsService = new PollsService();
