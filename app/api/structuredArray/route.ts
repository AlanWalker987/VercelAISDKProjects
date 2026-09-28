import { streamObject } from "ai";
import { google } from "@ai-sdk/google";
import { PokemonSchema } from "./schema";

export async function POST(request: Request) {
  try {
    const { type } = await request.json();

    const result = streamObject({
      model: google("gemini-3.1-flash-lite-preview"),
      schema: PokemonSchema,
      output: "array",
      prompt: `Generate a list of 5 ${type} Pokémon`,
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
