import { UIMessage, streamText, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(request: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await request.json();

    /**
     * Instructions
     *
     * 1. You are a hellpful coding assistant. Keep responses under 3 sentences and focus on providing concise and accurate code examples.
     * 2. You are a friendly teacher who explains concepts using simple analogies. Always relate technical concepts to everyday experiences.
     */
    const result = streamText({
      model: google("gemini-3.6-flash"),
      instructions:
        "You are a helpful assistant. Keep responses under 3 sentences.",
      messages: await convertToModelMessages(messages),
    });

    result.usage.then((usage) => {
      console.log({
        messageCount: messages.length,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
      });
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error("Error streaming chat completion:", err);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}
