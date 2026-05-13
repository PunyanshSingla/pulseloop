import { Request, Response, NextFunction } from "express";
import { analyticsService } from "./analytics.service";

export class AnalyticsController {
  async getDashboardData(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      console.log("user", user) 
      const isAdmin = user.role === "admin";
      console.log("isAdmin", isAdmin)
      // If admin, we don't pass userId to get global stats
      const queryId = isAdmin ? undefined : user.id;
      const days = parseInt(req.query.days as string) || 30;
      
      const [kpis, chartData, topPoll, activity] = await Promise.all([
        analyticsService.getKPIData(queryId),
        analyticsService.getResponsesOverTime(queryId, days),
        analyticsService.getTopPerformingPoll(queryId),
        analyticsService.getLatestActivity(queryId)
      ]);

      res.status(200).json({
        success: true,
        data: {
          kpis,
          chartData,
          topPoll,
          activity
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

export const analyticsController = new AnalyticsController();
