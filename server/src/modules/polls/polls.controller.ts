import { Request, Response, NextFunction } from "express";
import { pollsService } from "./polls.service";
import { z } from "zod";

const pollSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  visibility: z.enum(["public", "private"]).optional(),
  status: z.enum(["draft", "active", "closed"]).optional(),
  allowAnonymous: z.boolean().optional(),
  resultsPublished: z.boolean().optional(),
  expiresAt: z.preprocess((arg) => (typeof arg === "string" ? new Date(arg) : arg), z.date().nullable().optional()),
  questions: z
    .array(
      z.object({
        text: z.string().min(1, "Question text is required"),
        isMandatory: z.boolean().optional(),
        order: z.number().optional(),
        options: z
          .array(
            z.object({
              text: z.string().min(1, "Option text is required"),
              order: z.number().optional(),
            })
          )
          .min(2, "At least 2 options are required"),
      })
    )
    .min(1, "At least 1 question is required"),
});

export class PollsController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = pollSchema.parse(req.body);
      const userId = (req as any).user.id;
      const poll = await pollsService.createPoll(validatedData, userId);
      res.status(201).json({ success: true, data: poll });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const polls = await pollsService.getPolls();
      res.status(200).json({ success: true, data: polls });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const poll = await pollsService.getPollById(id as string);
      if (!poll) {
        res.status(404).json({ success: false, message: "Poll not found" });
        return;
      }
      res.status(200).json({ success: true, data: poll });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = pollSchema.partial().parse(req.body);
      const userId = (req as any).user.id;
      const poll = await pollsService.updatePoll(id as string, validatedData, userId);
      res.status(200).json({ success: true, data: poll });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      await pollsService.deletePoll(id as string, userId);
      res.status(200).json({ success: true, message: "Poll deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export const pollsController = new PollsController();
