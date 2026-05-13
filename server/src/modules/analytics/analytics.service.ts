import mongoose from "mongoose";
import Poll from "../../models/Poll";
import User from "../../models/User"
import Response from "../../models/Response";
export class AnalyticsService {
  async getKPIData(userId?: string) {
    const filter = userId ? { createdBy: new mongoose.Types.ObjectId(userId) } : {};
    const polls = await Poll.find(filter);
    const pollIds = polls.map(p => p._id);

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const totalResponses = await Response.countDocuments({ pollId: { $in: pollIds } });
    const activePolls = polls.filter(p => p.status === "active").length;

    // Calculate growth
    const currentPeriodResponses = await Response.countDocuments({
      pollId: { $in: pollIds },
      createdAt: { $gte: thirtyDaysAgo }
    });
    const previousPeriodResponses = await Response.countDocuments({
      pollId: { $in: pollIds },
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
    });

    let growth = 0;
    if (previousPeriodResponses > 0) {
      growth = ((currentPeriodResponses - previousPeriodResponses) / previousPeriodResponses) * 100;
    } else if (currentPeriodResponses > 0) {
      growth = 100;
    }

    // Calculate average response time
    const avgResponseTimeData = await Response.aggregate([
      { $match: { pollId: { $in: pollIds } } },
      { $group: { _id: null, avgTime: { $avg: "$timeTaken" } } }
    ]);

    const avgTimeSeconds = avgResponseTimeData.length > 0 ? Math.round(avgResponseTimeData[0].avgTime) : 0;
    const formattedAvgTime = avgTimeSeconds > 60 
      ? `${Math.floor(avgTimeSeconds / 60)}m ${avgTimeSeconds % 60}s` 
      : `${avgTimeSeconds}s`;

    return {
      totalResponses,
      activePolls,
      totalResponsesGrowth: growth.toFixed(1),
      completionRate: totalResponses > 0 ? "100%" : "0%", // Simplified for now
      avgResponseTime: avgTimeSeconds > 0 ? formattedAvgTime : "N/A"
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
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
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
    return pollStats.sort((a, b) => b.responseCount - a.responseCount)[0];
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
