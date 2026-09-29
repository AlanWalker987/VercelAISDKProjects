"use client";

import { useState, type FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Wrench } from "lucide-react";
import type { ChatMessage } from "@/app/api/apiTools/route";

export default function APIToolsChatPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, stop, error } = useChat<ChatMessage>({
    transport: new DefaultChatTransport({ api: "/api/apiTools" }),
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
            <span
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#2e6fa0] bg-[#1a3d68] text-[#dfeefc]"
              aria-hidden="true"
            >
              <Wrench className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <h1 className="text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              Weather API AI Tool
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
                    case "tool-getWeather": {
                      const toolPanelClass =
                        "mt-3 overflow-hidden rounded-xl border border-[#2d5e83]/70 bg-[#071827]/80";
                      const toolHeaderClass =
                        "flex flex-wrap items-center justify-between gap-2 border-b border-[#24445f] px-3 py-2";
                      const toolLabelClass =
                        "text-xs font-semibold uppercase tracking-[0.14em] text-[#dfeefc]";
                      const toolContentClass = "px-3 py-3";

                      switch (part.state) {
                        case "input-streaming":
                          return (
                            <section
                              key={`${message.id}-getweather-${index}`}
                              className={toolPanelClass}
                            >
                              <div className={toolHeaderClass}>
                                <span className={toolLabelClass}>
                                  Weather lookup
                                </span>
                                <span className="rounded-full border border-[#3977a5]/60 bg-[#12314a] px-2 py-1 text-[11px] text-[#9dd8ff]">
                                  Receiving input
                                </span>
                              </div>
                              <div className={toolContentClass}>
                                <p className="mb-2 text-sm text-[#b8d0e8]">
                                  Building the request...
                                </p>
                                <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-[#04111d] p-3 font-mono text-xs leading-5 text-[#c8e4f7]">
                                  {JSON.stringify(part.input, null, 2) ||
                                    "Waiting for input..."}
                                </pre>
                              </div>
                            </section>
                          );
                        case "input-available":
                          return (
                            <section
                              key={`${message.id}-getweather-${index}`}
                              className={toolPanelClass}
                            >
                              <div className={toolHeaderClass}>
                                <span className={toolLabelClass}>
                                  Weather lookup
                                </span>
                                <span className="rounded-full border border-[#3977a5]/60 bg-[#12314a] px-2 py-1 text-[11px] text-[#9dd8ff]">
                                  Running
                                </span>
                              </div>
                              <div className={toolContentClass}>
                                <p className="mb-2 text-sm text-[#b8d0e8]">
                                  Looking up weather for{" "}
                                  <span className="font-medium text-[#edf7ff]">
                                    {part.input.city}
                                  </span>
                                  ...
                                </p>
                                <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-[#04111d] p-3 font-mono text-xs leading-5 text-[#c8e4f7]">
                                  {JSON.stringify(part.input, null, 2)}
                                </pre>
                              </div>
                            </section>
                          );
                        case "output-available":
                          return (
                            <section
                              key={`${message.id}-getweather-${index}`}
                              className={toolPanelClass}
                            >
                              <div className={toolHeaderClass}>
                                <span className={toolLabelClass}>
                                  Weather result
                                </span>
                                <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2 py-1 text-[11px] text-emerald-200">
                                  Complete
                                </span>
                              </div>
                              <div className={toolContentClass}>
                                <p className="text-sm leading-6 text-[#edf7ff]">
                                  {part.output.location.name}
                                </p>
                                <p className="text-sm leading-6 text-[#edf7ff]">
                                  {part.output.current.temp_c}
                                </p>
                                <p className="text-sm leading-6 text-[#edf7ff]">
                                  {part.output.current.condition.text}
                                </p>
                              </div>
                            </section>
                          );
                        case "output-error":
                          return (
                            <section
                              key={`${message.id}-getweather-${index}`}
                              className="mt-3 overflow-hidden rounded-xl border border-red-400/40 bg-red-950/30"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-red-400/20 px-3 py-2">
                                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-red-100">
                                  Weather lookup
                                </span>
                                <span className="rounded-full border border-red-300/40 bg-red-400/10 px-2 py-1 text-[11px] text-red-200">
                                  Failed
                                </span>
                              </div>
                              <p className="px-3 py-3 text-sm leading-6 text-red-100">
                                {part.errorText}
                              </p>
                            </section>
                          );
                        default:
                          return null;
                      }
                    }
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
