import { Router } from "express";
import { analyticsController } from "./analytics.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/dashboard", authMiddleware, analyticsController.getDashboardData);

export default router;
