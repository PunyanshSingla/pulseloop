import mongoose from 'mongoose';
import { env } from '../src/config/env.js';
import Response from '../src/models/Response.js';

async function run() {
  try {
    await mongoose.connect(env.MONGODB_URI, { dbName: env.DATABASE_NAME });
    console.log("Connected to DB");
    await mongoose.connection.db?.collection('responses').dropIndexes();
    console.log("Indexes dropped successfully");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

run();
