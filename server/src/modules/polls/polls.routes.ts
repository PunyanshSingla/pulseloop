import { Router } from "express";
import { pollsController } from "./polls.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { optionalAuthMiddleware } from "../../middlewares/optional-auth.middleware";
import { voteRateLimit, createPollRateLimit } from "../../middlewares/rate-limit.middleware";

const router = Router();

// Static routes (must be before parameterized routes)
router.get("/voted", authMiddleware, pollsController.getVoted);

// Public routes
router.get("/", optionalAuthMiddleware, pollsController.getAll);
router.post("/", authMiddleware, createPollRateLimit, pollsController.create);

// Parameterized routes
router.get("/:id", optionalAuthMiddleware, pollsController.getById);
router.post("/:id/view", optionalAuthMiddleware, pollsController.trackView);
router.post("/:id/vote", optionalAuthMiddleware, voteRateLimit, pollsController.vote);
router.patch("/:id", authMiddleware, pollsController.update);
router.delete("/:id", authMiddleware, pollsController.delete);
router.get("/:id/responses", authMiddleware, pollsController.getResponses);
router.get("/:id/analytics", optionalAuthMiddleware, pollsController.getAnalytics);
router.post("/:id/publish", authMiddleware, pollsController.publishResults);

export default router;
