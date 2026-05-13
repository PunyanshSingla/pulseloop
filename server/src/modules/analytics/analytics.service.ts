import Poll from "../../models/Poll";
import Response from "../../models/Response";
import mongoose from "mongoose";

export class AnalyticsService {
  async getKPIData(userId: string) {
    const polls = await Poll.find({ createdBy: userId });
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

    return {
      totalResponses,
      activePolls,
      totalResponsesGrowth: growth.toFixed(1),
      completionRate: totalResponses > 0 ? "100%" : "0%", // Simplified for now
      avgResponseTime: "N/A"
    };
  }

  async getResponsesOverTime(userId: string, days: number = 30) {
    const polls = await Poll.find({ createdBy: userId });
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

  async getTopPerformingPoll(userId: string) {
    const polls = await Poll.find({ createdBy: userId }).lean();
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

  async getLatestActivity(userId: string, limit: number = 5) {
    const polls = await Poll.find({ createdBy: userId });
    const pollIds = polls.map(p => p._id);

    const responses = await Response.find({ pollId: { $in: pollIds } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("pollId", "title")
      .populate("respondentId", "name")
      .lean();

    return responses.map((r: any) => ({
      who: r.respondentId?.name || "Anonymous",
      what: "voted on",
      poll: r.pollId?.title || "Unknown Poll",
      when: r.createdAt
    }));
  }
}

export const analyticsService = new AnalyticsService();
