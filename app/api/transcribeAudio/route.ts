import { transcribe } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File | null;

    if (!audioFile) {
      return Response.json(
        { error: "No audio file provided." },
        { status: 400 },
      );
    }

    const arrayBuffer = await audioFile.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const transcript = await transcribe({
      model: google.transcription("gemini-3.5-transcribe"),
      audio: uint8Array,
    });

    return Response.json({
      text: transcript.text,
      segments: transcript.segments,
      language: transcript.language,
      durationInSeconds: transcript.durationInSeconds,
    });
  } catch (err) {
    console.error("Error in /api/transcribeAudio:", err);
    return Response.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Failed to transcribe audio. Please try again.",
      },
      { status: 500 },
    );
  }
}
