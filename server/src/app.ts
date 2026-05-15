import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

import pollRoutes from "./modules/polls/polls.routes.js";
import analyticsRoutes from "./modules/analytics/analytics.routes.js";
import mediaRoutes from "./modules/media/media.routes.js";
import usersRoutes from "./modules/users/users.routes.js";
import aiRoutes from "./modules/ai/ai.routes.js";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

app.use("/api/polls", pollRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/user", usersRoutes);
app.use("/api/ai", aiRoutes);

app.get("/api/health", (_, res) => {
  res.status(200).json({
    success: true,
    message: "Server running successfully 🚀",
  });
});
app.use(errorMiddleware);

export default app;