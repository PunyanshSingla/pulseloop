import { Request, Response, NextFunction } from "express";
import { pollsService } from "./polls.service";
import { pollSchema } from "./poll.types";
import { socketService } from "../../services/socket.service";
import Poll from "../../models/Poll";
import ResponseModel from "../../models/Response";

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
      let filters: any = {};
      
      if (isPublic) {
        filters = { visibility: "public", status: "active" };
      } else {
        const userId = (req as any).user?.id;
        if (!userId) {
          res.status(401).json({ success: false, message: "Unauthorized to view dashboard polls" });
          return;
        }
        filters = { createdBy: userId };
      }
      
      const polls = await pollsService.getPolls(filters);
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
      const fingerprint = req.headers["x-fingerprint"] as string;

      const poll = await pollsService.getPollById(id as string, { userId, ipAddress, fingerprint });
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
      const { responses, timeTaken: totalTimeTaken, fingerprint, deviceInfo } = req.body; 
      const user = (req as any).user;
      const userId = user?.id;
      let ipAddress = (req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").toString();
      const voterId = (req.headers["x-voter-id"] || "").toString();

      // Local development workaround: Fetch real public IP if voting from localhost
      if (ipAddress === "::1" || ipAddress === "127.0.0.1" || ipAddress.startsWith("192.168.")) {
        try {
          const publicIpRes = await fetch("https://api.ipify.org?format=json");
          const publicIpData = await publicIpRes.json();
          if (publicIpData?.ip) {
            ipAddress = publicIpData.ip;
          }
        } catch (e) {
          console.error("Failed to fetch public IP for local dev", e);
        }
      }

      // Check if the poll exists and allows multiple submissions
      const poll = await Poll.findById(pollId);
      if (!poll) throw new Error("Poll not found");

      console.log(`[Vote Attempt] Poll: ${poll.title}, User: ${userId || "Guest"}, Device: ${deviceInfo?.os}/${deviceInfo?.browser}`);

      if (!poll.allowMultipleSubmissions) {
        // Build a robust query to catch duplicates across all 3 layers
        const duplicateQuery: any = { pollId };
        
        if (userId) {
          duplicateQuery.respondentId = userId;
        } else {
          // Check all 3 layers for anonymous users
          const orConditions: any[] = [];
          if (voterId) orConditions.push({ voterId: voterId });
          if (fingerprint) orConditions.push({ fingerprint: fingerprint });
          if (ipAddress) orConditions.push({ ipAddress: ipAddress });

          if (orConditions.length > 0) {
            duplicateQuery.$or = orConditions;
          } else {
            // Safety fallback if everything is missing (should not happen)
            duplicateQuery.ipAddress = ipAddress;
          }
        }

        const existingResponse = await ResponseModel.findOne(duplicateQuery);
        if (existingResponse) {
          console.log(`[Vote Blocked] Duplicate detected for ${userId || "Guest"} (VoterID: ${voterId})`);
          res.status(403).json({ 
            success: false, 
            message: "You have already voted on this poll. Multiple submissions are not allowed." 
          });
          return;
        }
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
      } else {
        // Legacy single format support
        const { questionId, selectedOptionId, timeTaken } = req.body;
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

  async trackView(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { fingerprint } = req.body;
      const voterId = (req.headers["x-voter-id"] || "").toString();
      let ipAddress = (req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").toString();
      const userId = (req as any).user?.id;

      // Local development workaround: Fetch real public IP if viewing from localhost
      if (ipAddress === "::1" || ipAddress === "127.0.0.1" || ipAddress.startsWith("192.168.")) {
        try {
          const publicIpRes = await fetch("https://api.ipify.org?format=json");
          const publicIpData = await publicIpRes.json();
          if (publicIpData?.ip) {
            ipAddress = publicIpData.ip;
          }
        } catch (e) {
          console.error("Failed to fetch public IP for local dev", e);
        }
      }

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

      res.status(200).json({ success: true, isNewView });
    } catch (error) {
      next(error);
    }
  }

  async getAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const analytics = await pollsService.getPollAnalytics(id as string);
      res.status(200).json({ success: true, data: analytics });
    } catch (error) {
      next(error);
    }
  }
}

export const pollsController = new PollsController();
