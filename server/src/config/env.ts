import { z } from "zod";
const envSchema = z.object({
    PORT: z.string().optional(),
    NODE_ENV: z.string().optional(),
    CLIENT_URL: z.string()
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