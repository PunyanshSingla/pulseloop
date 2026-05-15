import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { resolve } from "path";
dotenv.config({ path: resolve(process.cwd(), ".env") });
async function check() {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: "pulseloop" });
    const pollSchema = new mongoose.Schema({}, { strict: false });
    const Poll = mongoose.models.Poll || mongoose.model("Poll", pollSchema);
    const responseSchema = new mongoose.Schema({}, { strict: false });
    const Response = mongoose.models.Response || mongoose.model("Response", responseSchema);
    const poll = await Poll.findOne({ title: "djalkfj" });
    if (poll) {
        const responses = await Response.countDocuments({ pollId: poll._id });
        console.log("DATABASE_STATS:", JSON.stringify({
            title: poll.get("title"),
            id: poll._id,
            views: poll.get("viewCount"),
            responses: responses
        }));
    }
    else {
        console.log("Poll not found");
    }
    process.exit(0);
}
check();
