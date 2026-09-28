import { google } from "@ai-sdk/google";
import { generateSpeech } from "ai";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    const { audio } = await generateSpeech({
      model: google.speechModel("gemini-3.8-flash-lite-tts"),
      text,
    });

    const buffer = new ArrayBuffer(audio.uint8Array.byteLength);

    new Uint8Array(buffer).set(audio.uint8Array);

    return new Response(buffer, {
      headers: {
        "Content-Type": audio.mediaType || "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("Error generating speech:", error);
    return new Response("Failed to generate speech", { status: 500 });
  }
}
