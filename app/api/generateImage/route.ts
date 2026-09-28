import { google } from "@ai-sdk/google";
import { generateImage } from "ai";

export async function POST(request: Request) {
  try {
    const prompt = await request.json();

    const { image } = await generateImage({
      model: google.imageModel("gemini-3.6-flash"),
      prompt,
      providerOptions: {
        google: {
          style: "vivid",
          quality: "hd",
        },
      },
    });

    return Response.json(image.base64);
  } catch (err) {
    console.error("Error in /api/generateImage:", err);
    return new Response("Failed to generate image", { status: 500 });
  }
}
