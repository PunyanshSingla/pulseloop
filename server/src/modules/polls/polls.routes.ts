import { Router } from "express";
import { pollsController } from "./polls.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { optionalAuthMiddleware } from "../../middlewares/optional-auth.middleware";

const router = Router();

// Public routes
router.get("/", pollsController.getAll);
router.get("/:id", optionalAuthMiddleware, pollsController.getById);
router.post("/:id/view", optionalAuthMiddleware, pollsController.trackView);

// Protected routes
router.post("/", authMiddleware, pollsController.create);
router.post("/:id/vote", optionalAuthMiddleware, pollsController.vote);
router.patch("/:id", authMiddleware, pollsController.update);
router.delete("/:id", authMiddleware, pollsController.delete);
router.get("/:id/responses", authMiddleware, pollsController.getResponses);
router.get("/:id/analytics", authMiddleware, pollsController.getAnalytics);

export default router;
