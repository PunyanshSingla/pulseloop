import { Request, Response, NextFunction } from "express";
import { analyticsService } from "./analytics.service";

export class AnalyticsController {
  async getDashboardData(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      
      const [kpis, chartData, topPoll, activity] = await Promise.all([
        analyticsService.getKPIData(userId),
        analyticsService.getResponsesOverTime(userId),
        analyticsService.getTopPerformingPoll(userId),
        analyticsService.getLatestActivity(userId)
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
