import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { errorMiddleware } from "./middlewares/error.middleware";
const app = express();

// Middlewares
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(errorMiddleware);
// Health Route
app.get("/api/health", (_, res) => {
  res.status(200).json({
    success: true,
    message: "Server running successfully",
  });
});

export default app;