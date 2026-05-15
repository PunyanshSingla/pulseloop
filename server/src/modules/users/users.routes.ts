import { Router } from "express";
import { usersController } from "./users.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", authMiddleware, usersController.getMe);

export default router;
