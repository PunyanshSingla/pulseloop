import { Request, Response, NextFunction } from "express";
import { pollsService } from "./polls.service.js";
import { pollSchema } from "./poll.types.js";
import { socketService } from "../../services/socket.service.js";
import Poll from "../../models/Poll.js";
import ResponseModel from "../../models/Response.js";
import { generateServerFingerprint } from "../../utils/fingerprint.js";

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
      const isPublic = req.query.type === "public";
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = parseInt(req.query.skip as string) || 0;
      const search = req.query.search as string;
      const allowAnonymous = req.query.allowAnonymous;
      
      let filters: any = {};
      
      if (isPublic) {
        filters = { visibility: "public", status: { $ne: "draft" } };
        
        if (allowAnonymous !== undefined) {
          filters.allowAnonymous = allowAnonymous === "true";
        }

        if (search) {
          filters.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
          ];
        }
      } else {
        const userId = (req as any).user?.id;
        if (!userId) {
          res.status(401).json({ success: false, message: "Unauthorized to view dashboard polls" });
          return;
        }
        filters = { createdBy: userId };
      }
      
      const polls = await pollsService.getPolls(filters, { limit, skip });
      res.status(200).json({ success: true, data: polls });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      const ipAddress = (req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").toString();
      const serverFingerprint = generateServerFingerprint(req);
      const clientFingerprint = req.headers["x-fingerprint"] as string;

      const poll = await pollsService.getPollById(id as string, { 
        userId, 
        ipAddress, 
        fingerprint: serverFingerprint || clientFingerprint 
      });
      
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
      const { responses, timeTaken: totalTimeTaken, deviceInfo, fingerprint: clientFingerprint, voteAsAnonymous } = req.body; 
      const user = (req as any).user;
      let userId = user?.id;
      const ipAddress = (req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").toString();
      const voterId = (req.headers["x-voter-id"] || "").toString();
      
      // Generate secure server-side fingerprint
      const serverFingerprint = generateServerFingerprint(req);
      const fingerprint = serverFingerprint || clientFingerprint;

      // Check if the poll exists
      const poll = await Poll.findById(pollId);
      if (!poll) throw new Error("Poll not found");

      if (voteAsAnonymous && poll.allowAnonymous) {
        userId = undefined;
      }

      console.log(`[Vote Attempt] Poll: ${poll.title}, User: ${userId || "Guest"}, Device: ${deviceInfo?.os}/${deviceInfo?.browser}`);

      // 1. Check Poll Status
      if (poll.status !== "active") {
        res.status(403).json({ success: false, message: "This poll is not currently accepting responses." });
        return;
      }

      // 2. Check Expiry
      if (poll.expiresAt && new Date(poll.expiresAt) < new Date()) {
        res.status(403).json({ success: false, message: "This poll has expired and is no longer accepting responses." });
        return;
      }

      // 3. Check Authentication Mode
      if (!userId && !poll.allowAnonymous) {
        res.status(401).json({ success: false, message: "This poll requires authentication. Please log in to vote." });
        return;
      }

      // 4. Check Multiple Submissions
      if (!poll.allowMultipleSubmissions) {
        const query: any = { pollId };
        
        if (userId) {
          query.respondentId = userId;
        } else {
          const orConditions = [];
          if (fingerprint) orConditions.push({ fingerprint });
          if (voterId) orConditions.push({ voterId });
          // If we don't have fingerprint or voterId, we fall back to checking ipAddress as a last resort, though it's less reliable for shared networks
          if (ipAddress && orConditions.length === 0) orConditions.push({ ipAddress });
          
          if (orConditions.length > 0) {
            query.$or = orConditions;
          }
        }
        
        if (Object.keys(query).length > 1) { // Ensure we have at least one condition besides pollId
          const existingResponse = await ResponseModel.findOne(query);
          if (existingResponse) {
            res.status(403).json({ 
              success: false, 
              message: "You have already voted on this poll. Multiple submissions are not allowed." 
            });
            return;
          }
        }
      }

      // Backend Validation: Mandatory Questions
      const questions = await pollsService.getQuestionsByPollId(pollId);
      const mandatoryQuestionIds = questions.filter(q => q.isMandatory).map(q => q._id.toString());
      const answeredQuestionIds = responses.map((r: any) => r.questionId);

      const missingMandatory = mandatoryQuestionIds.filter(id => !answeredQuestionIds.includes(id));
      if (missingMandatory.length > 0) {
        res.status(400).json({ 
          success: false, 
          message: "Please answer all mandatory questions before submitting." 
        });
        return;
      }

      let results = [];
      
      if (Array.isArray(responses)) {
        for (const resp of responses) {
          const { questionId, selectedOptionId, timeTaken } = resp;
          const result = await pollsService.castVote(
            pollId, 
            questionId, 
            selectedOptionId, 
            userId, 
            timeTaken, 
            fingerprint, 
            ipAddress,
            voterId,
            deviceInfo
          );
          results.push(result);
        }
      }

      // Get updated poll data for real-time broadcast
      const updatedPoll = await pollsService.getPollById(pollId);
      socketService.emitToPoll(pollId, "poll:updated", updatedPoll);
      socketService.emitToPoll(pollId, "vote:cast", {
        userName: user?.name || "A participant",
        pollId
      });

      // Notify owner's dashboard
      if (updatedPoll?.createdBy) {
        socketService.emitToDashboard(updatedPoll.createdBy.toString(), "analytics:update", {
          pollId,
          type: "vote"
        });
      }

      res.status(201).json({ success: true, data: results });
    } catch (error) {
      // Catch duplicate key error from unique indexes
      if ((error as any).code === 11000) {
        res.status(403).json({ 
          success: false, 
          message: "You have already voted on this poll. Multiple submissions are not allowed." 
        });
        return;
      }
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

  async trackView(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { fingerprint: clientFingerprint } = req.body;
      const voterId = (req.headers["x-voter-id"] || "").toString();
      const ipAddress = (req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").toString();
      const userId = (req as any).user?.id;
      
      const serverFingerprint = generateServerFingerprint(req);
      const fingerprint = serverFingerprint || clientFingerprint;

      // Use userId if available, otherwise fallback to voterId
      const viewerId = userId || voterId;

      if (!viewerId) {
        res.status(400).json({ success: false, message: "Missing viewer identification" });
        return;
      }

      const isNewView = await pollsService.trackPollView(id as string, { 
        viewerId, 
        fingerprint, 
        ipAddress 
      });

      if (isNewView) {
        const poll = await Poll.findById(id);
        if (poll?.createdBy) {
          socketService.emitToDashboard(poll.createdBy.toString(), "analytics:update", {
            pollId: id,
            type: "view"
          });
        }
      }

      res.status(200).json({ success: true, isNewView });
    } catch (error) {
      next(error);
    }
  }

  async getAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = (req as any).user;

      const poll = await Poll.findById(id);
      if (!poll) throw new Error("Poll not found");

      // Access granted if:
      // 1. Results are published
      // 2. User is the creator
      const isOwner = user && poll.createdBy.toString() === user.id;
      
      if (!poll.resultsPublished && !isOwner) {
        res.status(403).json({ success: false, message: "Unauthorized access to analytics" });
        return;
      }

      const analytics = await pollsService.getPollAnalytics(id as string);
      res.status(200).json({ success: true, data: analytics });
    } catch (error) {
      next(error);
    }
  }

  async publishResults(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      const poll = await pollsService.publishResults(id as string, userId);

      // Notify all connected clients in the poll room
      socketService.emitToPoll(id as string, "poll:published", poll);

      res.status(200).json({ success: true, data: poll });
    } catch (error) {
      next(error);
    }
  }

  async getVoted(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = parseInt(req.query.skip as string) || 0;
      
      const polls = await pollsService.getVotedPolls(userId, { limit, skip });
      res.status(200).json({ success: true, data: polls });
    } catch (error) {
      next(error);
    }
  }
}

export const pollsController = new PollsController();
