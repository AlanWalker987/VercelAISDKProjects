"use client";

import { useState, type FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export default function ToolsPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/tools" }),
  });
  const isLoading = status === "submitted" || status === "streaming";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = input.trim();
    await sendMessage({ text });
    setInput("");
  }

  return (
    <main className="min-h-full w-full px-2 py-3 text-white sm:px-3 sm:py-4 lg:px-4 lg:py-5">
      <div className="w-full min-w-0">
        <div className="ai-panel rounded-[28px] p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex items-center gap-3 sm:gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#2e6fa0] bg-[#1a3d68] text-xl text-[#dfeefc]">
              ✦
            </span>
            <h1 className="text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              AI Tools
            </h1>
          </div>

          <div className="app-scrollbar ai-subpanel mb-6 max-h-[55vh] min-h-[200px] space-y-4 overflow-y-auto rounded-[22px] p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[85%] rounded-2xl border p-4 ${
                  message.role === "user"
                    ? "ml-auto border-[#2d7ed7]/50 bg-[#173f67]"
                    : "mr-auto border-[#1a3b5d] bg-[#0e2439]"
                }`}
              >
                <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#9bb7d1]">
                  {message.role === "user" ? "You" : "AI"}
                </div>
                {message.parts.map((part, index) => {
                  switch (part.type) {
                    case "text":
                      return (
                        <p
                          key={`${message.id}-${index}`}
                          className="whitespace-pre-wrap text-sm leading-7 text-[#edf7ff]"
                        >
                          {part.text}
                        </p>
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isLoading && (
              <div className="text-sm text-[#b8d0e8]">Thinking...</div>
            )}
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask something..."
              rows={5}
              className="ai-input w-full rounded-[18px] px-4 py-3 text-sm text-white placeholder:text-[#85a5c1] focus:border-[#3bb3ff] focus:outline-none"
            />

            {isLoading ? (
              <button
                type="button"
                onClick={stop}
                className="w-full cursor-pointer rounded-xl bg-[#ef4444] px-4 py-3 font-medium text-white transition hover:bg-[#f87171]"
              >
                Stop Chat
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-[#3aa4f3] to-[#3b82f6] px-4 py-3 font-medium text-white shadow-[0_10px_25px_rgba(59,130,246,0.35)] transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                Send Message
              </button>
            )}
          </form>

          {error && (
            <p className="mt-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error.message}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
