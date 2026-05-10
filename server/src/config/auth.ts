import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { env } from "./env";
import { sendResetPasswordEmail, sendVerificationEmail } from "../shared/email/email.service";

const client = new MongoClient(env.MONGODB_URI);
const db = client.db(env.DATABASE_NAME);

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client
    }),
    baseURL: env.BETTER_AUTH_URL,
    trustedOrigins: [
        env.CLIENT_URL
    ],
    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            await sendVerificationEmail({ email: user.email, url, name: user.name });
        },
        sendOnSignIn: true,
    },

    emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, url }) => {
            await sendResetPasswordEmail({ to: user.email, resetUrl: url, name: user.name });
        },
        requireEmailVerification: true,
    },
    socialProviders: {
        google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
    },
});