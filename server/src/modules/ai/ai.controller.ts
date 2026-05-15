import { Request, Response } from "express";
import { aiService } from "./ai.service.js";

export const aiController = {
  async generatePoll(req: Request, res: Response) {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ success: false, message: "Prompt is required" });
      }

      const pollData = await aiService.generatePoll(prompt);
      res.status(200).json({ success: true, data: pollData });
    } catch (error: any) {
      console.error("AI Generation Error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to generate poll" });
    }
  }
};
