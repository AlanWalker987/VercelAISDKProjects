"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";

interface TranscriptResult {
  text: string;
  segments?: Array<{ start: number; end: number; text: string }>;
  language?: string;
  durationInSeconds?: number;
}

export default function TranscribeAudioPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0] ?? null;
    setSelectedFile(file);
    setTranscript(null);
    setError(null);
  }

  function resetForm() {
    setSelectedFile(null);
    setTranscript(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedFile) {
      setError("Please select an audio file to transcribe.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("audio", selectedFile);

      const response = await fetch("/api/transcribeAudio", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to transcribe audio. Please try again.");
      }

      const data = await response.json();

      setTranscript(data as TranscriptResult);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
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
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#2e6fa0] bg-[#1a3d68] text-xl text-[#dfeefc]">
              ◐
            </span>
            <h1 className="text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              Transcribe Audio
            </h1>
          </div>

          {isLoading && (
            <div className="mb-6 flex items-center gap-3 rounded-[18px] border border-[#1a3b5d] bg-[#091d2f] p-4 text-sm text-[#dfeefc]">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#2f4966] border-t-[#5ec2ff]" />
              Transcribing audio...
            </div>
          )}

          {transcript && !isLoading && (
            <section className="mb-6 rounded-[18px] border border-[#1a3b5d] bg-[#091d2f] p-5 shadow-inner">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#7ac7ff]">
                Transcript
              </h2>
              <p className="whitespace-pre-wrap text-sm leading-7 text-[#edf7ff]">
                {transcript.text}
              </p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-[#1a3b5d] pt-3 text-sm text-[#b8d0e8]">
                <span>Language: {transcript.language?.trim() || "N/A"}</span>
                <span>
                  Duration:{" "}
                  {typeof transcript.durationInSeconds === "number"
                    ? `${transcript.durationInSeconds.toFixed(1)} seconds`
                    : "N/A"}
                </span>
              </div>
            </section>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4 border-t border-[#1a3b5d] pt-5"
          >
            {selectedFile && (
              <div className="flex items-center justify-between gap-4 rounded-[18px] border border-[#1a3b5d] bg-[#091d2f] px-4 py-3 text-sm">
                <span className="min-w-0 truncate text-[#dfeefc]">
                  Selected: {selectedFile.name}
                </span>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isLoading}
                  className="shrink-0 font-medium text-[#fca5a5] transition hover:text-red-200 disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="sr-only"
              id="audio-upload"
              disabled={isLoading}
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <label
                htmlFor="audio-upload"
                className={`flex min-h-12 flex-1 items-center justify-center rounded-xl border border-[#22507f] bg-[#0c2038] px-4 py-3 text-center text-sm font-medium text-[#dfeefc] transition ${
                  isLoading
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer hover:border-[#3eb3ff] hover:text-white"
                }`}
              >
                {selectedFile
                  ? "Choose a different audio file"
                  : "Select an audio file"}
              </label>

              <button
                type="submit"
                disabled={isLoading || !selectedFile}
                className="min-h-12 cursor-pointer rounded-xl bg-gradient-to-r from-[#3aa4f3] to-[#3b82f6] px-5 py-3 font-medium text-white shadow-[0_10px_25px_rgba(59,130,246,0.35)] transition disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-44"
              >
                {isLoading ? "Transcribing..." : "Transcribe Audio"}
              </button>
            </div>
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
