"use client";

import { useState } from "react";

export default function StructuredEnumPage() {
  const [text, setText] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeSentiment = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);
    setText("");

    try {
      const response = await fetch("/api/structuredEnum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Something went wrong");
      }

      const nextSentiment =
        typeof data === "string"
          ? data
          : (data?.object ?? data?.sentiment ?? "");

      setSentiment(String(nextSentiment));
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-full w-full px-2 py-3 text-white sm:px-3 sm:py-4 lg:px-4 lg:py-5">
      <div className="w-full min-w-0">
        <div className="ai-panel rounded-[28px] p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex items-center gap-3 sm:gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#2e6fa0] bg-[#1a3d68] text-xl text-[#dfeefc]">
              ◌
            </span>
            <h1 className="text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              AI Sentiment Analyzer
            </h1>
          </div>

          {isLoading ? (
            <div className="mb-6 text-sm text-[#b8d0e8]">
              Analyzing sentiment...
            </div>
          ) : sentiment ? (
            <div className="mb-6 rounded-[18px] border border-[#1a3b5d] bg-[#091d2f] p-5 shadow-inner">
              <div className="text-center text-3xl font-bold text-[#edf7ff]">
                {sentiment === "positive" && "😊 Positive"}
                {sentiment === "negative" && "😞 Negative"}
                {sentiment === "neutral" && "😐 Neutral"}
              </div>
            </div>
          ) : null}

          <form onSubmit={analyzeSentiment} className="space-y-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to analyze..."
              rows={5}
              className="ai-input w-full rounded-[18px] px-4 py-3 text-sm text-white placeholder:text-[#85a5c1] focus:border-[#3bb3ff] focus:outline-none"
            />

            <button
              type="submit"
              disabled={isLoading || !text.trim()}
              className="w-full rounded-xl bg-gradient-to-r from-[#3aa4f3] to-[#3b82f6] px-4 py-3 font-medium text-white shadow-[0_10px_25px_rgba(59,130,246,0.35)] transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Analyzing..." : "Analyze"}
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
