import { Router } from "express";
import { pollsController } from "./polls.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Public routes
router.get("/", pollsController.getAll);
router.get("/:id", pollsController.getById);

// Protected routes
router.post("/", authMiddleware, pollsController.create);
router.patch("/:id", authMiddleware, pollsController.update);
router.delete("/:id", authMiddleware, pollsController.delete);

export default router;
