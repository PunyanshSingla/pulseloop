import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { resolve } from "path";
import { performance } from "perf_hooks";

dotenv.config({ path: resolve(process.cwd(), ".env") });
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/pulseloop";
const DB_NAME = process.env.DATABASE_NAME || "pulseloop";

// Manually define models
const pollSchema = new mongoose.Schema({}, { strict: false });
const Poll = mongoose.models.Poll || mongoose.model("Poll", pollSchema);
const questionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model("Question", questionSchema);
const responseSchema = new mongoose.Schema({}, { strict: false });
const Response = mongoose.models.Response || mongoose.model("Response", responseSchema);

async function testPerf() {
  await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
  const poll = await Poll.findOne().sort({ createdAt: -1 });
  if (!poll) {
    console.log("No poll found");
    process.exit(0);
  }
  const pollId = poll._id;

  console.log("Testing Question.aggregate...");
  const t0 = performance.now();
  await Question.aggregate([
    { $match: { pollId } },
    { $sort: { order: 1 } },
    { $lookup: { from: "questionoptions", localField: "_id", foreignField: "questionId", as: "options" } },
    { $unwind: "$options" },
    { $lookup: { from: "responses", let: { optionId: "$options._id" }, pipeline: [ { $match: { $expr: { $eq: ["$selectedOptionId", "$$optionId"] } } }, { $count: "count" } ], as: "optResponses" } },
    { $addFields: { "options.count": { $ifNull: [{ $arrayElemAt: ["$optResponses.count", 0] }, 0] } } },
    { $group: { _id: "$_id", text: { $first: "$text" }, order: { $first: "$order" }, options: { $push: "$options" } } }
  ]);
  const t1 = performance.now();
  console.log(`Question.aggregate took ${t1 - t0} milliseconds.`);

  console.log("Testing sequentially awaited aggregations...");
  const t2 = performance.now();
  const [deviceBreakdown, browserBreakdown, osBreakdown, countryBreakdown] = await Promise.all([
      Response.aggregate([{ $match: { pollId } }, { $group: { _id: "$voterId", device: { $first: "$deviceInfo.device" } } }, { $group: { _id: { $ifNull: ["$device", "Unknown"] }, count: { $sum: 1 } } }]),
      Response.aggregate([{ $match: { pollId } }, { $group: { _id: "$voterId", browser: { $first: "$deviceInfo.browser" } } }, { $group: { _id: { $ifNull: ["$browser", "Unknown"] }, count: { $sum: 1 } } }]),
      Response.aggregate([{ $match: { pollId } }, { $group: { _id: "$voterId", os: { $first: "$deviceInfo.os" } } }, { $group: { _id: { $ifNull: ["$os", "Unknown"] }, count: { $sum: 1 } } }]),
      Response.aggregate([{ $match: { pollId } }, { $group: { _id: "$voterId", ip: { $first: "$ipAddress" } } }, { $group: { _id: "$ip", count: { $sum: 1 } } }])
  ]);
  const t3 = performance.now();
  console.log(`Promise.all for demographics took ${t3 - t2} milliseconds.`);
  
  process.exit(0);
}
testPerf();
