"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
var zod_1 = require("zod");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var envSchema = zod_1.z.object({
    PORT: zod_1.z.string().optional(),
    NODE_ENV: zod_1.z.string().optional(),
    CLIENT_URL: zod_1.z.string(),
    MONGODB_URI: zod_1.z.string(),
    DATABASE_NAME: zod_1.z.string(),
    BETTER_AUTH_URL: zod_1.z.string(),
    RESEND_API_KEY: zod_1.z.string(),
    EMAIL_FROM: zod_1.z.string(),
    GOOGLE_CLIENT_ID: zod_1.z.string(),
    GOOGLE_CLIENT_SECRET: zod_1.z.string(),
});
function createEnv(env) {
    var parsed = envSchema.safeParse(env);
    if (!parsed.success) {
        console.error("❌ Invalid environment variables:");
        console.error(parsed.error.flatten().fieldErrors);
        process.exit(1);
    }
    return parsed.data;
}
exports.env = createEnv(process.env);
