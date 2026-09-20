import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(request: Request) {
  try {
    const prompt = await request.json();

    const result = streamText({
      model: google("gemini-3.6-flash"),
      prompt:
        prompt?.prompt || "Write a short story about a robot learning to love.",
    });

    result.usage.then((usage) => {
      console.log({
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
      });
    });
    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error("Error in /api/stream:", err);
    return new Response("Failed to stream text", { status: 500 });
  }
}
