import mongoose from 'mongoose';
import { env } from "./env.js";

const MONGODB_URI = env.MONGODB_URI;
const DB_NAME = env.DATABASE_NAME;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development, preventing connections from growing exponentially.
 */
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            dbName: DB_NAME,
            autoIndex: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 10000, // Timeout after 10s
        };

        const connectWithRetry = async (retries = 5, delay = 2000) => {
            for (let i = 0; i < retries; i++) {
                try {
                    const conn = await mongoose.connect(MONGODB_URI, opts);
                    console.log('Successfully connected to MongoDB.');
                    return conn;
                } catch (error) {
                    console.error(`Error connecting to MongoDB (Attempt ${i + 1}/${retries}):`, error);
                    if (i === retries - 1) throw error;
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        };

        cached.promise = connectWithRetry();
    }

    cached.conn = await cached.promise;
    return cached.conn;
};
export async function getClient() {
    const conn = await connectDB();
    const db = await conn.connection.getClient().db(DB_NAME);
    return db
}

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed due to app termination');
    process.exit(0);
});