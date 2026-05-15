import { Request, Response, NextFunction } from "express";
import { auth } from "../config/auth.js";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await auth.api.getSession({
      headers: new Headers(req.headers as any),
    });

    if (!session) {
      res.status(401).json({
        success: false,
        message: "Unauthorized - No active session",
      });
      return;
    }

    // Attach user and session to the request object
    (req as any).user = session.user;
    (req as any).session = session.session;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during authentication",
    });
  }
};
