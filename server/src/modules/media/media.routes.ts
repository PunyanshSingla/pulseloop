import { Router } from "express";
import { mediaController } from "./media.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import multer from "multer";

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  }
});

router.post("/upload", authMiddleware, upload.single("file"), mediaController.upload);

export default router;
