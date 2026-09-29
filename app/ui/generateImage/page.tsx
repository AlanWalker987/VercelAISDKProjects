"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { Image as ImageIcon } from "lucide-react";

export default function GenerateImagePage() {
  const [prompt, setPrompt] = useState("");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const imagePrompt = prompt.trim();
    if (!imagePrompt) {
      return;
    }

    setIsLoading(true);
    setImageSrc(null);
    setError(null);

    try {
      const response = await fetch("/api/generateImage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(imagePrompt),
      });

      const data: unknown = await response.json();

      if (!response.ok) {
        const message =
          typeof data === "object" && data !== null && "error" in data
            ? String(data.error)
            : "Image generation failed. Please try again.";
        throw new Error(message);
      }

      if (typeof data !== "string") {
        throw new Error("The image service returned an invalid response.");
      }

      setImageSrc(`data:image/png;base64,${data}`);
    } catch (caughtError) {
      console.error("Error generating image:", caughtError);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-full w-full px-2 py-3 text-white sm:px-3 sm:py-4 lg:px-4 lg:py-5">
      <div className="w-full min-w-0">
        <div className="ai-panel rounded-[28px] p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex items-center gap-3 sm:gap-4">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#2e6fa0] bg-[#1a3d68] text-[#dfeefc]"
              aria-hidden="true"
            >
              <ImageIcon className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <h1 className="text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              AI Image Generator
            </h1>
          </div>

          <div className="mb-6 flex aspect-square w-full items-center justify-center overflow-hidden rounded-[18px] border border-[#1a3b5d] bg-[#071b2c] sm:aspect-[4/3]">
            {isLoading ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[#0d2437]/80">
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#2f4966] border-t-[#5ec2ff]" />
                <span className="text-sm text-[#dfeefc]">
                  Creating your image...
                </span>
              </div>
            ) : imageSrc ? (
              <Image
                alt={`Generated image: ${prompt.trim()}`}
                className="h-full w-full object-contain"
                src={imageSrc}
                width={1024}
                height={1024}
                unoptimized
              />
            ) : (
              <div className="px-6 text-center">
                <p className="text-sm font-medium text-[#dfeefc]">
                  Your generated image will appear here
                </p>
                <p className="mt-2 text-xs leading-5 text-[#8ea9c5]">
                  Start with a subject, setting, and visual style.
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label
              htmlFor="image-prompt"
              className="block text-sm font-medium text-[#dfeefc]"
            >
              Image prompt
            </label>
            <textarea
              id="image-prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Describe the image you want to create..."
              rows={3}
              disabled={isLoading}
              className="ai-input w-full resize-y rounded-[18px] px-4 py-3 text-sm text-white placeholder:text-[#85a5c1] focus:border-[#3bb3ff] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-[#3aa4f3] to-[#3b82f6] px-4 py-3 font-medium text-white shadow-[0_10px_25px_rgba(59,130,246,0.35)] transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Generating..." : "Generate Image"}
            </button>
          </form>

          {error && (
            <p className="mt-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
