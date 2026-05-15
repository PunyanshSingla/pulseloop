import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env") });
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/pulseloop";
const DB_NAME = process.env.DATABASE_NAME || "pulseloop";

// Manually define models
const responseSchema = new mongoose.Schema({}, { strict: false });
const Response = mongoose.models.Response || mongoose.model("Response", responseSchema);
const Poll = mongoose.models.Poll || mongoose.model("Poll", new mongoose.Schema({}, { strict: false }));

async function testExplain() {
  await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
  const poll = await Poll.findOne().sort({ createdAt: -1 });
  const pollId = poll._id;

  const explainResult = await Response.collection.aggregate([
    { $match: { pollId } },
    { $group: { _id: "$voterId", device: { $first: "$deviceInfo.device" } } },
    { $group: { _id: { $ifNull: ["$device", "Unknown"] }, count: { $sum: 1 } } }
  ]).explain("executionStats");

  console.log(JSON.stringify(explainResult, null, 2));
  process.exit(0);
}
testExplain();
