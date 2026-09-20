import { streamObject } from "ai";
import { google } from "@ai-sdk/google";
import { RecipeSchema } from "./schema";

export async function POST(request: Request) {
  try {
    const { dish } = await request.json();

    const result = streamObject({
      model: google("gemini-3.1-flash-lite-preview"),
      schema: RecipeSchema,
      prompt: `Generate a recipe for ${dish}`,
    });

    result.usage.then((usage) => {
      console.log({
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
      });
    });
    return result.toTextStreamResponse();
  } catch (err) {
    console.error("Error in /api/stream:", err);
    return new Response("Failed to stream text", { status: 500 });
  }
}

/**
 *
 * Structured Data use cases
 *
 * Product catalogues with prices, descriptions, and availability
 * Analysis reports with data points and conclusions
 * Task list with priority and due dates
 * Quiz questions with multiple-choice answers
 */
