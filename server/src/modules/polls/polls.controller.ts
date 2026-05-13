import { Request, Response, NextFunction } from "express";
import { pollsService } from "./polls.service";
import { pollSchema } from "./poll.types";
import { socketService } from "../../services/socket.service";

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
      
      // Notify participants about poll updates (e.g. title/options changed)
      socketService.emitToPoll(id as string, "poll:updated", poll);
      
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

  async vote(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: pollId } = req.params;
      const { questionId, selectedOptionId } = req.body;
      const user = (req as any).user;
      
      const response = await pollsService.castVote(pollId, questionId, selectedOptionId, user?.id);
      
      // Get updated poll data for real-time broadcast
      const updatedPoll = await pollsService.getPollById(pollId);
      socketService.emitToPoll(pollId, "poll:updated", updatedPoll);
      socketService.emitToPoll(pollId, "vote:cast", { 
        userName: user?.name || "A participant",
        questionId, 
        optionId: selectedOptionId 
      });

      res.status(201).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }
}

export const pollsController = new PollsController();
