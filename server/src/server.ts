import mongoose from "mongoose";
import app from "./app";
import { env } from "./config/env";
import { auth } from "./config/auth";
import { toNodeHandler } from "better-auth/node";

app.all("/api/auth/*splat", toNodeHandler(auth));

const PORT = env.PORT || 5000;

async function startServer() {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      dbName: env.DATABASE_NAME,
    });
    console.log("📦 Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Connection error:", error);
    process.exit(1);
  }
}

startServer();