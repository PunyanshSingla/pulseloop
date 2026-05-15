import { Request, Response, NextFunction } from "express";
import cloudinary from "../../config/cloudinary.js";

export class MediaController {
  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: "No file provided" });
        return;
      }

      // Upload to Cloudinary from memory buffer
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      
      const result = await cloudinary.uploader.upload(dataURI, {
        resource_type: "auto",
        folder: "pulseloop_avatars",
      });

      res.status(200).json({
        success: true,
        data: {
          secure_url: result.secure_url,
          public_id: result.public_id,
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

export const mediaController = new MediaController();
