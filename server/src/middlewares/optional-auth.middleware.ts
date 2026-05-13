import { Request, Response, NextFunction } from "express";
import { auth } from "../config/auth";

export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await auth.api.getSession({
      headers: new Headers(req.headers as any),
    });

    if (session) {
      // Attach user and session if they exist
      (req as any).user = session.user;
      (req as any).session = session.session;
    }

    next();
  } catch (error) {
    // Even on error, we proceed as anonymous
    next();
  }
};
