import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors: any[] = [];

  // Zod Validation Error
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    errors = err.issues.map((e: any) => ({
      path: e.path.join("."),
      message: e.message
    }));
  }
  // Mongoose Bad ObjectId
  else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID";
  }
  // Mongo Duplicate Key
  else if (err.code === 11000) {
    statusCode = 400;
    message = `${Object.keys(err.keyValue)} already exists`;
    if (Object.keys(err.keyValue).includes("pollId") && (Object.keys(err.keyValue).includes("voterId") || Object.keys(err.keyValue).includes("respondentId"))) {
      message = "You have already voted on this poll.";
    }
  }
  // Mongoose Validation Error
  else if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
    errors = Object.values(err.errors).map((val: any) => ({
      path: val.path,
      message: val.message
    }));
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length > 0 ? errors : undefined,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};