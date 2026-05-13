import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { resolve } from "path";
import { pollsService } from "../src/modules/polls/polls.service";
import Poll from "../src/models/Poll";
import Response from "../src/models/Response";
import PollView from "../src/models/PollView";
import Question from "../src/models/Question";
import QuestionOption from "../src/models/QuestionOption";
import User from "../src/models/User";

dotenv.config({ path: resolve(process.cwd(), ".env") });

async function testAnalytics() {
  await mongoose.connect(process.env.MONGODB_URI!, { dbName: "pulseloop" });

  const poll = await Poll.findOne({ title: "djalkfj" });
  if (poll) {
    const analytics = await pollsService.getPollAnalytics(poll._id.toString());
    console.log(JSON.stringify(analytics, null, 2));
  } else {
    console.log("Poll not found");
  }

  process.exit(0);
}

testAnalytics();
