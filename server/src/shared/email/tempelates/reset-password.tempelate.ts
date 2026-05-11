export const resetPasswordTemplate = (url: string, name?: string) => {
  return `
  <div style="font-family: Arial, sans-serif; background:#f4f4f5; padding:40px 20px;">
    <div style="max-width:600px; margin:auto; background:white; border-radius:16px; overflow:hidden;">

      <div style="background:#111827; padding:32px; text-align:center;">
        <h1 style="color:white; margin:0; font-size:28px;">
          PulseLoop
        </h1>
      </div>

      <div style="padding:40px 32px;">
        <h2 style="margin-top:0; color:#111827;">
          Reset Your Password
        </h2>

        <p style="font-size:16px; color:#4b5563; line-height:1.7;">
          Hi ${name || "there"},
        </p>

        <p style="font-size:16px; color:#4b5563; line-height:1.7;">
          We received a request to reset your password.
          Click the button below to create a new password.
        </p>

        <div style="text-align:center; margin:40px 0;">
          <a
            href="${url}"
            style="
              background:#111827;
              color: white;
              text-decoration: none;
              padding: 14px 28px;
              border-radius: 10px;
              display: inline-block;
              font-weight: 600;
              font-size: 16px;
            "
          >
            Reset Password
          </a>
        </div>

        <p style="font-size:14px; color:#6b7280; line-height:1.7;">
          This link will expire automatically for security reasons.
        </p>

        <p style="font-size:14px; color:#6b7280; line-height:1.7;">
          If you didn't request this password reset,
          you can safely ignore this email.
        </p>
      </div>

      <div style="padding:24px; background:#f9fafb; text-align:center;">
        <p style="margin:0; color:#9ca3af; font-size:13px;">
          &copy; ${new Date().getFullYear()} PulseLoop. All rights reserved.
        </p>
      </div>

    </div>
  </div>
  `;
};
