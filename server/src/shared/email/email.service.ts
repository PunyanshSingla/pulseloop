import { resend } from "../../config/resend.js"
import { env } from "../../config/env.js"
import { verificationTemplate } from "./tempelates/verification.tempelate.js";
import { resetPasswordTemplate } from "./tempelates/reset-password.tempelate.js";
export const sendEmail = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
    const { data, error } = await resend.emails.send({
        from: `PulseLoop <${env.EMAIL_FROM}>`,
        to: [to],
        subject: subject,
        html: html,
    });
    if (error) {
        throw error;
    }
    return data;
}
export const sendVerificationEmail = async ({
    email,
    url,
    name,
}: {
    email: string;
    url: string;
    name?: string;
}) => {
    return await sendEmail({
        to: email,
        subject: "Verify your PulseLoop account",
        html: verificationTemplate(url, name),
    });
};
export const sendResetPasswordEmail = async ({
    to,
    name,
    resetUrl,
}: { to: string, name?: string, resetUrl: string }) => {
    return await sendEmail({
        to,
        subject: "Reset Your Password",
        html: resetPasswordTemplate(resetUrl, name),
    })
}