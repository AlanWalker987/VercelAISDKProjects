import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    const result = await generateObject({
      model: google("gemini-3.1-flash-lite-preview"),
      output: "enum",
      enum: ["positive", "negative", "neutral"],
      prompt: `Classify the sentiment in this text: "${text}"`,
    });

    return result.toJsonResponse();
  } catch (err) {
    console.error("Error in /api/structuredEnum:", err);
    return new Response("Failed to generate enum", { status: 500 });
  }
}
