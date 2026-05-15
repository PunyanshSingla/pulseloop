import mongoose from "mongoose";
import app from "./app.js";
import { env } from "./config/env.js";
import { auth } from "./config/auth.js";
import { toNodeHandler } from "better-auth/node";
import { createServer } from "http";
import { socketService } from "./services/socket.service.js";
import { connectDB } from "./config/db.js";

app.all("/api/auth/*splat", toNodeHandler(auth));

const PORT = env.PORT || 5000;
const httpServer = createServer(app);

// Initialize Socket.io
socketService.initialize(httpServer, env.CLIENT_URL);

async function startServer() {
  try {
    await connectDB()

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Connection error:", error);
    process.exit(1);
  }
}

startServer();