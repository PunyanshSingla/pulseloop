import { Request } from "express";
import crypto from "crypto";

/**
 * Generates a stable fingerprint based on request headers.
 * This is more secure than relying solely on client-provided fingerprints.
 */
export const generateServerFingerprint = (req: Request): string => {
  const userAgent = req.headers["user-agent"] || "";
  const acceptLanguage = req.headers["accept-language"] || "";
  const ipAddress = (req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").toString();
  
  // We combine these stable headers to create a hash
  const data = `${userAgent}|${acceptLanguage}|${ipAddress}`;
  return crypto.createHash("sha256").update(data).digest("hex");
};
