import { Router } from "express";
import { pollsController } from "./polls.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Public routes
router.get("/", pollsController.getAll);
router.get("/:id", pollsController.getById);

// Protected routes
router.post("/", authMiddleware, pollsController.create);
router.post("/:id/vote", authMiddleware, pollsController.vote);
router.patch("/:id", authMiddleware, pollsController.update);
router.delete("/:id", authMiddleware, pollsController.delete);
router.get("/:id/responses", authMiddleware, pollsController.getResponses);

export default router;
