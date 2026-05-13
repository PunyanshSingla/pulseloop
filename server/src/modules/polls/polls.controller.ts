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
      const pollId = req.params.id as string;
      const { responses, timeTaken: totalTimeTaken } = req.body; // Can be array or legacy single format
      const user = (req as any).user;
      const userId = user?.id;

      let results = [];
      
      if (Array.isArray(responses)) {
        for (const resp of responses) {
          const { questionId, selectedOptionId, timeTaken } = resp;
          const result = await pollsService.castVote(pollId, questionId, selectedOptionId, userId, timeTaken);
          results.push(result);
        }
      } else {
        // Legacy single format support
        const { questionId, selectedOptionId, timeTaken } = req.body;
        const result = await pollsService.castVote(pollId, questionId, selectedOptionId, userId, timeTaken);
        results.push(result);
      }

      // Get updated poll data for real-time broadcast
      const updatedPoll = await pollsService.getPollById(pollId);
      socketService.emitToPoll(pollId, "poll:updated", updatedPoll);
      socketService.emitToPoll(pollId, "vote:cast", {
        userName: user?.name || "A participant",
        pollId
      });

      res.status(201).json({ success: true, data: results });
    } catch (error) {
      next(error);
    }
  }

  async getResponses(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const responses = await pollsService.getPollResponses(id as string);
      res.status(200).json({ success: true, data: responses });
    } catch (error) {
      next(error);
    }
  }
}

export const pollsController = new PollsController();
