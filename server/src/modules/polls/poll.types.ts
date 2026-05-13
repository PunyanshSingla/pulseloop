import { z } from "zod";

export const pollSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  visibility: z.enum(["public", "private"]).optional(),
  status: z.enum(["draft", "active", "closed"]).optional(),
  allowAnonymous: z.boolean().optional(),
  allowMultipleSubmissions: z.boolean().optional(),
  resultsPublished: z.boolean().optional(),
  expiresAt: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date().nullable().optional()
  ),
  questions: z
    .array(
      z.object({
        text: z.string().min(1, "Question text is required"),
        isMandatory: z.boolean().optional(),
        order: z.number().optional(),
        options: z
          .array(
            z.object({
              text: z.string().min(1, "Option text is required"),
              order: z.number().optional(),
            })
          )
          .min(2, "At least 2 options are required"),
      })
    )
    .min(1, "At least 1 question is required"),
});

export type CreatePollInput = z.infer<typeof pollSchema>;
export type UpdatePollInput = Partial<CreatePollInput>;
