import { z } from "zod";
import dotenv from "dotenv"
dotenv.config();
const envSchema = z.object({
  PORT: z.string().optional(),
  NODE_ENV: z.string().optional(),
  CLIENT_URL: z.string(),
  MONGODB_URI: z.string(),
  DATABASE_NAME: z.string(),
  BETTER_AUTH_URL: z.string(),
  RESEND_API_KEY: z.string(),
  EMAIL_FROM: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
})
function createEnv(env: NodeJS.ProcessEnv) {
  const parsed = envSchema.safeParse(env);
  if (!parsed.success) {
    console.error(
      "❌ Invalid environment variables:"
    );
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
  }

  return parsed.data;
}

export const env = createEnv(process.env)