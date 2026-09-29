"use client";

import { useState, type FormEvent } from "react";
import { Sparkles } from "lucide-react";

export default function CompletionPage() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!prompt.trim()) {
      return;
    }

    setLoading(true);
    setError(null);
    setResult("");

    try {
      const response = await fetch("/api/completion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Something went wrong.");
      }

      setResult(data.text || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
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
              <Sparkles className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <h1 className="text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              AI Completion
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {loading && (
              <div className="text-sm text-[#b8d0e8]">Loading...</div>
            )}
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Enter your prompt..."
              rows={4}
              className="ai-input w-full rounded-[18px] px-4 py-3 text-sm text-white placeholder:text-[#85a5c1] focus:border-[#3bb3ff] focus:outline-none"
            />

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="w-full rounded-xl bg-gradient-to-r from-[#3aa4f3] to-[#3b82f6] px-4 py-3 font-medium text-white shadow-[0_10px_25px_rgba(59,130,246,0.35)] transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </form>

          {error && (
            <p className="mt-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}

          {result && (
            <div className="mt-6 rounded-[18px] border border-[#1a3b5d] bg-[#091d2f] p-4">
              <p className="whitespace-pre-wrap text-sm leading-7 text-[#edf7ff]">
                {result}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
