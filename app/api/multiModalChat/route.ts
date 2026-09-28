import { UIMessage, streamText, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(request: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await request.json();

    const result = streamText({
      model: google("gemini-3.6-flash"),
      instructions:
        "You are a helpful assistant. Keep responses under 3 sentences.",
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error("Error streaming chat completion:", err);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}
