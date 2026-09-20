"use client";

import { useCompletion } from "@ai-sdk/react";

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
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 py-12 text-white">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <h1 className="mb-6 text-2xl font-semibold">AI Streaming</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isLoading && !completion && <div>Streaming...</div>}
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Enter your prompt..."
            rows={5}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-sky-500 focus:outline-none"
          />

          {isLoading ? (
            <button
              onClick={stop}
              className="w-full rounded-xl cursor-pointer bg-red-500 px-4 py-3 font-medium text-slate-950 transition hover:bg-red-400"
            >
              Stop Streaming
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl cursor-pointer bg-sky-500 px-4 py-3 font-medium text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
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
          <div className="mt-6 rounded-xl border border-slate-700 bg-slate-950 p-4">
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-200">
              {completion}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
