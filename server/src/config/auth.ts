import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { env } from "./env";
import { sendResetPasswordEmail, sendVerificationEmail } from "../shared/email/email.service";
import { getClient } from "./db";
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
        sendOnSignIn: true,
    },

    emailAndPassword: {
        enabled: true,
        async sendResetPassword({ user, url }) {
            const resetUrl = url.replace(env.BETTER_AUTH_URL, env.CLIENT_URL);
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
