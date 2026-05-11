import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { errorMiddleware } from "./middlewares/error.middleware";

import pollRoutes from "./modules/polls/polls.routes";

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

app.get("/api/health", (_, res) => {
  res.status(200).json({
    success: true,
    message: "Server running successfully 🚀",
  });
});
app.use(errorMiddleware);

export default app;