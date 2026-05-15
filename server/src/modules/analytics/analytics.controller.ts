import { Request, Response, NextFunction } from "express";
import { analyticsService } from "./analytics.service.js";

export class AnalyticsController {
  async getDashboardData(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      
      // Always filter by userId to ensure users only see their own data
      const queryId = user.id;
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
