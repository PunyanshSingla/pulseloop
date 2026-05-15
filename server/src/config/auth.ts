import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { env } from "./env.js";
import { sendResetPasswordEmail, sendVerificationEmail } from "../shared/email/email.service.js";
import { getClient } from "./db.js";
const db =  await getClient()
if (!db) throw new Error("MongoDB connection not found");
export const auth = betterAuth({
    database: mongodbAdapter(db),
    user: {
        modelName: "users",
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "user",
            }
        },
    },
    account: {
        storeStateStrategy: "cookie",
    },
    baseURL: env.BETTER_AUTH_URL,
    trustedOrigins: [
        env.CLIENT_URL
    ],
    emailVerification: {
        async sendVerificationEmail({ user, url, token }) {
            const verificationUrl = `${env.CLIENT_URL}/verify-email?token=${token}`;
            await sendVerificationEmail({ email: user.email, url: verificationUrl, name: user.name });
        },
        sendOnSignUp: true,
        sendOnSignIn: true,
    },

    emailAndPassword: {
        enabled: true,
        async sendResetPassword({ user, url }) {
            const token = url.split("/").pop()?.split("?")[0];
            const resetUrl = `${env.CLIENT_URL}/reset-password?token=${token}`;
            await sendResetPasswordEmail({
                to: user.email,
                resetUrl: resetUrl,
                name: user.name,
            });
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
