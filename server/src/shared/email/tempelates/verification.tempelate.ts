export const verificationTemplate = (url: string, name?: string) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 24px; color: #111;">
      <h1>Verify your email</h1>

      <p>
        ${name ? `Hi ${name},` : "Hi,"}
      </p>

      <p>
        Thanks for joining PulseLoop.
        Please verify your email address by clicking the button below.
      </p>

      <a
        href="${url}"
        style="
          display: inline-block;
          background: black;
          color: white;
          padding: 12px 20px;
          text-decoration: none;
          border-radius: 8px;
          margin-top: 16px;
        "
      >
        Verify Email
      </a>

      <p style="margin-top: 24px; font-size: 14px; color: #666;">
        If you did not create an account, you can safely ignore this email.
      </p>
    </div>
  `;
};