import {
  UIMessage,
  InferUITools,
  UIDataTypes,
  streamText,
  convertToModelMessages,
  tool,
  stepCountIs,
} from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

const tools = {
  getLocation: tool({
    description: "Get the location of a user",
    inputSchema: z.object({
      name: z.string().describe("The name of the user"),
    }),
    execute: async ({ name }) => {
      if (name === "Bruce Wayne") {
        return "gotham city";
      } else if (name === "Clark Kent") {
        return "metropolis";
      } else {
        return "unknown";
      }
    },
  }),
  getWeather: tool({
    description: "Get the weather for a location",
    inputSchema: z.object({
      city: z.string().describe("The city to get the weather for"),
    }),
    execute: async ({ city }) => {
      const normalizedCity = city.trim().toLowerCase();
      if (normalizedCity === "error city") {
        throw new Error("Weather service unavailable");
      }
      if (normalizedCity === "italo") {
        return "70F and cloudy";
      } else if (normalizedCity === "metropolis") {
        return "80F and sunny";
      } else if (normalizedCity === "gotham city") {
        return "55F and rainy";
      } else {
        return "unknown";
      }
    },
  }),
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(request: Request) {
  try {
    const { messages }: { messages: ChatMessage[] } = await request.json();

    const result = streamText({
      model: google("gemini-3.6-flash"),
      instructions:
        "Use the available tools for location and weather facts. If the user asks for the weather for a person, first call getLocation with that person's exact name. After its result is returned, call getWeather with the exact city returned by getLocation. Never pass a person's name to getWeather or guess a city. For a location-only request, call getLocation. For weather in a named city, call getWeather with that city. Answer from the tool results and do not invent results.",
      messages: await convertToModelMessages(messages),
      tools,
      stopWhen: stepCountIs(3),
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error("Error streaming chat completion:", err);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}
