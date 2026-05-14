import mongoose from "mongoose";
import Poll from "../../models/Poll";
import User from "../../models/User"
import Response from "../../models/Response";
import PollView from "../../models/PollView";
import Question from "../../models/Question";
import QuestionOption from "../../models/QuestionOption";

export class AnalyticsService {
  async getKPIData(userId?: string) {
    const filter = userId ? { createdBy: new mongoose.Types.ObjectId(userId) } : {};
    const polls = await Poll.find(filter);
    const pollIds = polls.map(p => p._id);

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const totalResponses = await Response.countDocuments({ pollId: { $in: pollIds } });
    
    // Calculate response growth
    const currentPeriodResponses = await Response.countDocuments({
      pollId: { $in: pollIds },
      createdAt: { $gte: thirtyDaysAgo }
    });
    const previousPeriodResponses = await Response.countDocuments({
      pollId: { $in: pollIds },
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
    });

    let responsesGrowth = 0;
    if (previousPeriodResponses > 0) {
      responsesGrowth = ((currentPeriodResponses - previousPeriodResponses) / previousPeriodResponses) * 100;
    }

    // Calculate average response time and growth
    const currentAvgResponseTimeData = await Response.aggregate([
      { $match: { pollId: { $in: pollIds }, createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: null, avgTime: { $avg: "$timeTaken" } } }
    ]);
    const previousAvgResponseTimeData = await Response.aggregate([
      { $match: { pollId: { $in: pollIds }, createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } } },
      { $group: { _id: null, avgTime: { $avg: "$timeTaken" } } }
    ]);

    const currentAvgTime = currentAvgResponseTimeData.length > 0 ? currentAvgResponseTimeData[0].avgTime : 0;
    const previousAvgTime = previousAvgResponseTimeData.length > 0 ? previousAvgResponseTimeData[0].avgTime : 0;
    
    let avgResponseTimeGrowth = 0;
    if (previousAvgTime > 0) {
      avgResponseTimeGrowth = ((currentAvgTime - previousAvgTime) / previousAvgTime) * 100;
    }

    const overallAvgResponseTimeData = await Response.aggregate([
      { $match: { pollId: { $in: pollIds } } },
      { $group: { _id: null, avgTime: { $avg: "$timeTaken" } } }
    ]);
    const avgTimeSeconds = overallAvgResponseTimeData.length > 0 ? Math.round(overallAvgResponseTimeData[0].avgTime) : 0;
    const formattedAvgTime = avgTimeSeconds > 60 
      ? `${Math.floor(avgTimeSeconds / 60)}m ${avgTimeSeconds % 60}s` 
      : `${avgTimeSeconds}s`;

    // Completion rate and growth
    const currentViews = await PollView.countDocuments({
      pollId: { $in: pollIds },
      createdAt: { $gte: thirtyDaysAgo }
    });
    const previousViews = await PollView.countDocuments({
      pollId: { $in: pollIds },
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
    });

    const currentCompletionRate = currentViews > 0 ? (currentPeriodResponses / currentViews) * 100 : 0;
    const previousCompletionRate = previousViews > 0 ? (previousPeriodResponses / previousViews) * 100 : 0;

    let completionRateGrowth = 0;
    if (previousCompletionRate > 0) {
      completionRateGrowth = ((currentCompletionRate - previousCompletionRate) / previousCompletionRate) * 100;
    }

    const totalViews = await PollView.countDocuments({ pollId: { $in: pollIds } });
    const completionRateVal = totalViews > 0 ? (totalResponses / totalViews) * 100 : 0;
    const formattedCompletionRate = completionRateVal > 100 ? "100%" : completionRateVal.toFixed(1) + "%";

    // Active polls growth
    const currentActivePolls = polls.filter(p => p.status === "active").length;
    const previousActivePolls = polls.filter(p => 
      p.status === "active" && 
      new Date(p.createdAt) < thirtyDaysAgo
    ).length;

    let activePollsGrowth = 0;
    if (previousActivePolls > 0) {
      activePollsGrowth = ((currentActivePolls - previousActivePolls) / previousActivePolls) * 100;
    }

    // Anonymous vs Logged-in breakdown
    const anonymousResponses = await Response.countDocuments({
      pollId: { $in: pollIds },
      respondentId: null
    });
    const loggedInResponses = totalResponses - anonymousResponses;

    return {
      totalResponses,
      activePolls: currentActivePolls,
      totalResponsesGrowth: responsesGrowth.toFixed(1),
      activePollsGrowth: activePollsGrowth.toFixed(1),
      completionRate: totalViews > 0 ? formattedCompletionRate : "0%",
      completionRateGrowth: completionRateGrowth.toFixed(1),
      avgResponseTime: avgTimeSeconds > 0 ? formattedAvgTime : "N/A",
      avgResponseTimeGrowth: avgResponseTimeGrowth.toFixed(1),
      anonymousResponses,
      loggedInResponses
    };
  }

  async getResponsesOverTime(userId?: string, days: number = 30) {
    const filter = userId ? { createdBy: new mongoose.Types.ObjectId(userId) } : {};
    const polls = await Poll.find(filter);
    const pollIds = polls.map(p => p._id);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const responses = await Response.aggregate([
      {
        $match: {
          pollId: { $in: pollIds },
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            isAnonymous: { $cond: [{ $ifNull: ["$respondentId", false] }, false, true] }
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.date",
          anonymous: {
            $sum: { $cond: ["$_id.isAnonymous", "$count", 0] }
          },
          loggedIn: {
            $sum: { $cond: ["$_id.isAnonymous", 0, "$count"] }
          },
          total: { $sum: "$count" }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: "$_id",
          anonymous: 1,
          loggedIn: 1,
          total: 1
        }
      }
    ]);
    return responses;
  }

  async getTopPerformingPoll(userId?: string) {
    const filter = userId ? { createdBy: new mongoose.Types.ObjectId(userId) } : {};
    const polls = await Poll.find(filter).lean();
    if (polls.length === 0) return null;

    const pollStats = await Promise.all(
      polls.map(async (poll) => {
        const responseCount = await Response.countDocuments({ pollId: poll._id });
        return { ...poll, responseCount };
      })
    );

    // Sort by response count descending
    const topPoll = pollStats.sort((a, b) => b.responseCount - a.responseCount)[0];
    
    // Fetch first question and options for the top poll
    const firstQuestion = await Question.findOne({ pollId: topPoll._id }).sort({ order: 1 }).lean();
    
    if (firstQuestion) {
      const options = await QuestionOption.find({ questionId: firstQuestion._id }).sort({ order: 1 }).lean();
      const optionsWithStats = await Promise.all(
        options.map(async (o) => {
          const count = await Response.countDocuments({ selectedOptionId: o._id });
          const totalQuestionResponses = await Response.countDocuments({ questionId: firstQuestion._id });
          const percentage = totalQuestionResponses > 0 ? (count / totalQuestionResponses) * 100 : 0;
          return { ...o, responseCount: count, percentage };
        })
      );
      
      (topPoll as any).questions = [{ ...firstQuestion, options: optionsWithStats }];
    }

    return topPoll;
  }

  async getLatestActivity(userId?: string, limit: number = 5) {
    try {
      const filter = userId ? { createdBy: new mongoose.Types.ObjectId(userId) } : {};
      const polls = await Poll.find(filter).select("_id");
      const pollIds = polls.map((p) => p._id);

      if (pollIds.length === 0) {
        return [];
      }

      const responses = await Response.find({
        pollId: { $in: pollIds },
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate({ path: "respondentId", model: User, select: "name" })
        .populate({ path: "pollId", model: Poll, select: "title" })
        .lean();
      console.info("responses", responses)
      return responses.map((r: any) => ({
        who: r.respondentId?.name || "Anonymous",
        what: "voted on",
        poll: r.pollId?.title || "Unknown Poll",
        when: r.createdAt,
      }));
    } catch (error) {
      console.error("Error in getLatestActivity:", error);
      return [];
    }
  }
}

export const analyticsService = new AnalyticsService();
