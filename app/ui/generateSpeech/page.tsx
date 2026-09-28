"use client";

import { useEffect, useRef, useState } from "react";

export default function GenerateSpeechPage() {
  const [text, setText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAudio, setHasAudio] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [generatedText, setGeneratedText] = useState<string>("");

  const audioUrlRef = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const speechText = text.trim();
    if (!speechText) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setText("");
    setGeneratedText(speechText);
    setIsPlaying(false);

    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }

    try {
      const response = await fetch("/api/generateSpeech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: speechText }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate audio");
      }

      const blob = await response.blob();
      audioUrlRef.current = URL.createObjectURL(blob);
      audioRef.current = new Audio(audioUrlRef.current);
      audioRef.current.onplay = () => setIsPlaying(true);
      audioRef.current.onpause = () => setIsPlaying(false);
      audioRef.current.onended = () => setIsPlaying(false);

      setHasAudio(true);
      await audioRef.current.play();
    } catch (error) {
      console.error("Error generating audio:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
      setHasAudio(false);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (audio.paused) {
      if (audio.ended) {
        audio.currentTime = 0;
      }

      try {
        await audio.play();
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to play the generated audio.",
        );
      }
    } else {
      audio.pause();
    }
  };

  const replayAudio = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.currentTime = 0;
    void audio.play().catch((caughtError: unknown) => {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to play the generated audio.",
      );
    });
  };

  useEffect(() => {
    return () => {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current.onplay = null;
        audioRef.current.onpause = null;
        audioRef.current.onended = null;
      }
    };
  }, []);

  return (
    <main className="min-h-full w-full px-2 py-3 text-white sm:px-3 sm:py-4 lg:px-4 lg:py-5">
      <div className="w-full min-w-0">
        <div className="ai-panel rounded-[28px] p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex items-center gap-3 sm:gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#2e6fa0] bg-[#1a3d68] text-xl text-[#dfeefc]">
              ◕
            </span>
            <h1 className="text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              AI Speech Generator
            </h1>
          </div>

          {isLoading && (
            <div className="mb-6 flex items-center gap-3 rounded-[18px] border border-[#1a3b5d] bg-[#091d2f] p-4 text-sm text-[#dfeefc]">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#2f4966] border-t-[#5ec2ff]" />
              Generating audio...
            </div>
          )}

          {hasAudio && !isLoading && (
            <div className="mb-6 rounded-[18px] border border-[#1a3b5d] bg-[#091d2f] p-5">
              <p className="mb-3 whitespace-pre-wrap text-sm leading-7 text-[#edf7ff]">
                {generatedText}
              </p>
              {isPlaying && (
                <div
                  className="mb-4 flex h-12 items-center justify-center gap-1 overflow-hidden rounded-lg border border-[#2d7ed7]/30 bg-[#153c63] px-3"
                  role="img"
                  aria-label="Audio is playing"
                >
                  {Array.from({ length: 32 }, (_, index) => (
                    <span
                      key={index}
                      className="audio-wave-bar"
                      aria-hidden="true"
                    />
                  ))}
                </div>
              )}
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={togglePlayback}
                  className="flex-1 cursor-pointer rounded-xl bg-gradient-to-r from-[#3aa4f3] to-[#3b82f6] px-4 py-3 font-medium text-white shadow-[0_10px_25px_rgba(59,130,246,0.35)] transition"
                >
                  {isPlaying ? "Pause" : "Play"}
                </button>
                <button
                  type="button"
                  onClick={replayAudio}
                  className="flex-1 cursor-pointer rounded-xl border border-[#22507f] bg-[#0c2038] px-4 py-3 font-medium text-[#dfeefc] transition hover:border-[#3eb3ff] hover:text-white"
                >
                  Replay from Start
                </button>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4 border-t border-[#1a3b5d] pt-5"
          >
            <label
              htmlFor="speech-text"
              className="block text-sm font-medium text-[#dfeefc]"
            >
              Text to convert
            </label>
            <textarea
              id="speech-text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Enter text to convert to speech..."
              rows={4}
              disabled={isLoading}
              className="ai-input w-full resize-y rounded-[18px] px-4 py-3 text-sm text-white placeholder:text-[#85a5c1] focus:border-[#3bb3ff] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isLoading || !text.trim()}
              className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-[#3aa4f3] to-[#3b82f6] px-4 py-3 font-medium text-white shadow-[0_10px_25px_rgba(59,130,246,0.35)] transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Generating..." : "Generate Speech"}
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
