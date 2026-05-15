import { Router } from "express";
import { analyticsController } from "./analytics.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/dashboard", authMiddleware, analyticsController.getDashboardData);

export default router;
