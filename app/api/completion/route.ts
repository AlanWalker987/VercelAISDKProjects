import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(request: Request) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "Google Generative AI API key is missing." },
      { status: 500 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const prompt =
    typeof body?.prompt === "string" && body.prompt.trim()
      ? body.prompt.trim()
      : "Write a short story about a robot learning to love.";

  const { text } = await generateText({
    model: google("gemini-3.6-flash"),
    prompt,
  });

  return Response.json({ text });
}
