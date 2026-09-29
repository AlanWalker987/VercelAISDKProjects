"use client";

import { useCompletion } from "@ai-sdk/react";
import { Waves } from "lucide-react";

export default function StreamPage() {
  const {
    input,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
    error,
    stop,
  } = useCompletion({
    api: "/api/stream",
  });

  return (
    <main className="min-h-full w-full px-2 py-3 text-white sm:px-3 sm:py-4 lg:px-4 lg:py-5">
      <div className="w-full min-w-0">
        <div className="ai-panel rounded-[28px] p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex items-center gap-3 sm:gap-4">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#2e6fa0] bg-[#1a3d68] text-[#dfeefc]"
              aria-hidden="true"
            >
              <Waves className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <h1 className="text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              AI Streaming
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isLoading && !completion && (
              <div className="text-sm text-[#b8d0e8]">Streaming...</div>
            )}
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Enter your prompt..."
              rows={4}
              className="ai-input w-full rounded-[18px] px-4 py-3 text-sm text-white placeholder:text-[#85a5c1] focus:border-[#3bb3ff] focus:outline-none"
            />

            {isLoading ? (
              <button
                onClick={stop}
                className="w-full cursor-pointer rounded-xl bg-[#ef4444] px-4 py-3 font-medium text-white transition hover:bg-[#f87171]"
              >
                Stop Streaming
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-gradient-to-r from-[#3aa4f3] to-[#3b82f6] px-4 py-3 font-medium text-white shadow-[0_10px_25px_rgba(59,130,246,0.35)] transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Streaming..." : "Generate"}
              </button>
            )}
          </form>

          {error && (
            <p className="mt-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error.message}
            </p>
          )}

          {completion && (
            <div className="mt-6 rounded-[18px] border border-[#1a3b5d] bg-[#091d2f] p-4">
              <p className="whitespace-pre-wrap text-sm leading-7 text-[#edf7ff]">
                {completion}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
