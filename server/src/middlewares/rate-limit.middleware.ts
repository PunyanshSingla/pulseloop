import rateLimit from "express-rate-limit";

export const voteRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 votes per 15 minutes
  message: {
    success: false,
    message: "Too many votes from this IP, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const createPollRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 poll creations per hour
  message: {
    success: false,
    message: "Too many polls created from this IP, please try again after an hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
