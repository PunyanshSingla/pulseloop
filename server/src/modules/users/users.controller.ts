import { Request, Response, NextFunction } from "express";
import { getClient } from "../../config/db";

export class UsersController {
  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const db = await getClient();
      
      // Find all accounts linked to this user
      const accounts = await db.collection("accounts").find({ userId: user.id }).toArray();
      const providers = accounts.map((a: any) => a.providerId || a.provider);
      
      res.status(200).json({
        success: true,
        data: {
          ...user,
          providers,
          hasPassword: providers.includes("credential")
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

export const usersController = new UsersController();
