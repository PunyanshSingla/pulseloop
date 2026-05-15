import { Router } from "express";
import { aiController } from "./ai.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/generate", authMiddleware, aiController.generatePoll);

export default router;
