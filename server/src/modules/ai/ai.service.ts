import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { env } from "../../config/env.js";

export class AIService {
  private googleProvider;

  constructor() {
    this.googleProvider = createGoogleGenerativeAI({
      apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
    });
  }

  async generatePoll(prompt: string) {
    if (!env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error("AI features are not configured. Please set GOOGLE_GENERATIVE_AI_API_KEY in environment variables.");
    }

    const modelId = env.GOOGLE_GENERATIVE_AI_MODEL || 'gemini-2.5-flash';

    const { object } = await generateObject({
      model: this.googleProvider(modelId),
      schema: z.object({
        title: z.string(),
        description: z.string(),
        questions: z.array(z.object({
          text: z.string(),
          isMandatory: z.boolean(),
          options: z.array(z.string()).min(2)
        })).min(1).max(10)
      }),
      prompt: `Create a professional and engaging poll about: ${prompt}. 
      Return a title, a brief description, and 1 to 10 questions. 
      Each question should have at least 2 options. 
      Make the questions diverse and interesting.
      IMPORTANT: Return ONLY plain text. Do NOT use any markdown formatting (no asterisks, bold, italics, or hashes). The content must be ready to be placed directly into standard text inputs.`,
    });
    
    return object;
  }
}

export const aiService = new AIService();
