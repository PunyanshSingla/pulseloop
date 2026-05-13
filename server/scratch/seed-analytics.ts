import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Manually define models to avoid import issues from the main app
const pollSchema = new mongoose.Schema({}, { strict: false });
const Poll = mongoose.models.Poll || mongoose.model("Poll", pollSchema);

const questionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model("Question", questionSchema);

const optionSchema = new mongoose.Schema({}, { strict: false });
const QuestionOption = mongoose.models.QuestionOption || mongoose.model("QuestionOption", optionSchema);

const responseSchema = new mongoose.Schema({}, { strict: false });
const Response = mongoose.models.Response || mongoose.model("Response", responseSchema);

const pollViewSchema = new mongoose.Schema({}, { strict: false });
const PollView = mongoose.models.PollView || mongoose.model("PollView", pollViewSchema);

dotenv.config({ path: resolve(process.cwd(), ".env") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/pulseloop";
const DB_NAME = process.env.DATABASE_NAME || "pulseloop";

async function seed() {
  try {
    console.log("Connecting to:", MONGODB_URI, "DB:", DB_NAME);
    await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
    console.log("Connected to MongoDB");

    // Find the latest poll
    const poll = await Poll.findOne().sort({ createdAt: -1 });
    if (!poll) {
      console.log("No polls found to seed. Please create a poll in the UI first.");
      process.exit(0);
    }

    console.log(`Seeding data for poll: ${poll.get('title')} (${poll._id})`);

    const pollId = poll._id;
    const questions = await Question.find({ pollId });
    const optionsByQuestion: Record<string, any[]> = {};
    for (const q of questions) {
      optionsByQuestion[q._id.toString()] = await QuestionOption.find({ questionId: q._id });
    }

    const browsers = ["Chrome", "Safari", "Firefox", "Edge", "Mobile Safari"];
    const osList = ["Windows", "MacOS", "iOS", "Android", "Linux"];
    const devices = ["Desktop", "Mobile", "Tablet"];
    
    // 1. Seed Views
    console.log("Seeding views...");
    const viewsCount = 150 + Math.floor(Math.random() * 100);
    const viewOps = [];
    for (let i = 0; i < viewsCount; i++) {
      viewOps.push({
        pollId,
        viewerId: `voter_${Math.random().toString(36).substring(7)}`,
        fingerprint: `fp_${Math.random().toString(36).substring(7)}`,
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000))
      });
    }
    await PollView.insertMany(viewOps);

    // 2. Seed Responses
    console.log("Seeding responses...");
    const responseCount = 80 + Math.floor(Math.random() * 50);
    const responseOps = [];
    for (let i = 0; i < responseCount; i++) {
      const browser = browsers[Math.floor(Math.random() * browsers.length)];
      const os = osList[Math.floor(Math.random() * osList.length)];
      const device = devices[Math.floor(Math.random() * devices.length)];
      const createdAt = new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000));
      const voterId = `voter_${Math.random().toString(36).substring(7)}`;
      const fingerprint = `fp_${Math.random().toString(36).substring(7)}`;

      for (const q of questions) {
        const options = optionsByQuestion[q._id.toString()];
        if (!options || options.length === 0) continue;
        const option = options[Math.floor(Math.random() * options.length)];
        
        responseOps.push({
          pollId,
          questionId: q._id,
          selectedOptionId: option._id,
          isAnonymous: true,
          fingerprint,
          voterId,
          ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
          deviceInfo: {
            browser,
            os,
            device,
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            screenResolution: "1920x1080",
            language: "en-US"
          },
          timeTaken: 10 + Math.floor(Math.random() * 20),
          createdAt
        });
      }
    }
    
    if (responseOps.length > 0) {
      await Response.insertMany(responseOps);
    }

    // Update poll view count
    await Poll.updateOne({ _id: pollId }, { $set: { viewCount: viewsCount } });

    console.log(`Seeding completed! Added ${viewsCount} views and ${responseCount} participants.`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
