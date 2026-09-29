"use client";

import { useState, type FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  ArrowUp,
  Check,
  CloudSun,
  LoaderCircle,
  MapPin,
  Square,
  Workflow,
} from "lucide-react";
import type { ChatMessage } from "@/app/api/multipleTools/route";

export default function MultipleToolsPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, stop, error } = useChat<ChatMessage>({
    transport: new DefaultChatTransport({ api: "/api/multipleTools" }),
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
              <Workflow className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <h1 className="text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              Multiple Tools
            </h1>
          </div>

          <div
            aria-live="polite"
            className="app-scrollbar ai-subpanel mb-6 max-h-[55vh] min-h-[240px] space-y-4 overflow-y-auto rounded-[22px] p-4"
          >
            {messages.length === 0 ? (
              <div className="flex min-h-[200px] flex-col items-center justify-center px-4 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-[#1f4167] bg-[#102e47] text-[#9ed7ff]">
                  <MapPin className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <p className="text-sm font-medium text-[#edf7ff]">
                  Start a conversation
                </p>
                <p className="mt-1 max-w-sm text-sm leading-6 text-[#9bb7d1]">
                  Ask about a person’s location or the weather in a city.
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`w-full rounded-2xl border p-4 sm:max-w-[88%] ${
                    message.role === "user"
                      ? "ml-auto border-[#2d7ed7]/50 bg-[#173f67]"
                      : "mr-auto border-[#1a3b5d] bg-[#0e2439]"
                  }`}
                >
                  <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#9bb7d1]">
                    {message.role === "user" ? "You" : "AI"}
                  </div>
                  <div className="space-y-3">
                    {message.parts.map((part, index) => {
                      const key = `${message.id}-${index}`;

                      switch (part.type) {
                        case "text":
                          return (
                            <p
                              key={key}
                              className="whitespace-pre-wrap text-sm leading-7 text-[#edf7ff]"
                            >
                              {part.text}
                            </p>
                          );
                        case "tool-getLocation": {
                          const panelClass =
                            "overflow-hidden rounded-xl border border-[#2d5e83]/70 bg-[#071827]/80";
                          const headerClass =
                            "flex flex-wrap items-center justify-between gap-2 border-b border-[#24445f] px-3 py-2";
                          const isError = part.state === "output-error";

                          switch (part.state) {
                            case "input-streaming":
                              return (
                                <section key={key} className={panelClass}>
                                  <div className={headerClass}>
                                    <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#dfeefc]">
                                      <MapPin className="h-4 w-4 text-[#9dd8ff]" />
                                      Location lookup
                                    </span>
                                    <span className="rounded-full border border-[#3977a5]/60 bg-[#12314a] px-2 py-1 text-[11px] text-[#9dd8ff]">
                                      Receiving input
                                    </span>
                                  </div>
                                  <div className="px-3 py-3">
                                    <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-[#04111d] p-3 font-mono text-xs leading-5 text-[#c8e4f7]">
                                      {JSON.stringify(part.input, null, 2) ??
                                        "Waiting for input..."}
                                    </pre>
                                  </div>
                                </section>
                              );
                            case "input-available":
                              return (
                                <section key={key} className={panelClass}>
                                  <div className={headerClass}>
                                    <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#dfeefc]">
                                      <MapPin className="h-4 w-4 text-[#9dd8ff]" />
                                      Location lookup
                                    </span>
                                    <span className="rounded-full border border-[#3977a5]/60 bg-[#12314a] px-2 py-1 text-[11px] text-[#9dd8ff]">
                                      Running
                                    </span>
                                  </div>
                                  <p className="px-3 py-3 text-sm text-[#b8d0e8]">
                                    Finding the location for{" "}
                                    <span className="font-medium text-[#edf7ff]">
                                      {part.input.name}
                                    </span>
                                    ...
                                  </p>
                                </section>
                              );
                            case "output-available":
                              return (
                                <section key={key} className={panelClass}>
                                  <div className={headerClass}>
                                    <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#dfeefc]">
                                      <MapPin className="h-4 w-4 text-[#9dd8ff]" />
                                      Location result
                                    </span>
                                    <span className="flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2 py-1 text-[11px] text-emerald-200">
                                      <Check className="h-3 w-3" />
                                      Complete
                                    </span>
                                  </div>
                                  <p className="px-3 py-3 text-sm leading-6 text-[#edf7ff]">
                                    {part.output}
                                  </p>
                                </section>
                              );
                            case "output-error":
                              return (
                                <section
                                  key={key}
                                  className="overflow-hidden rounded-xl border border-red-400/40 bg-red-950/30"
                                >
                                  <div className="flex items-center justify-between gap-2 border-b border-red-400/20 px-3 py-2">
                                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-red-100">
                                      Location lookup
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
                        case "tool-getWeather": {
                          const panelClass =
                            "overflow-hidden rounded-xl border border-[#2d5e83]/70 bg-[#071827]/80";
                          const headerClass =
                            "flex flex-wrap items-center justify-between gap-2 border-b border-[#24445f] px-3 py-2";

                          switch (part.state) {
                            case "input-streaming":
                              return (
                                <section key={key} className={panelClass}>
                                  <div className={headerClass}>
                                    <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#dfeefc]">
                                      <CloudSun className="h-4 w-4 text-[#9dd8ff]" />
                                      Weather lookup
                                    </span>
                                    <span className="rounded-full border border-[#3977a5]/60 bg-[#12314a] px-2 py-1 text-[11px] text-[#9dd8ff]">
                                      Receiving input
                                    </span>
                                  </div>
                                  <div className="px-3 py-3">
                                    <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-[#04111d] p-3 font-mono text-xs leading-5 text-[#c8e4f7]">
                                      {JSON.stringify(part.input, null, 2) ??
                                        "Waiting for input..."}
                                    </pre>
                                  </div>
                                </section>
                              );
                            case "input-available":
                              return (
                                <section key={key} className={panelClass}>
                                  <div className={headerClass}>
                                    <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#dfeefc]">
                                      <CloudSun className="h-4 w-4 text-[#9dd8ff]" />
                                      Weather lookup
                                    </span>
                                    <span className="rounded-full border border-[#3977a5]/60 bg-[#12314a] px-2 py-1 text-[11px] text-[#9dd8ff]">
                                      Running
                                    </span>
                                  </div>
                                  <p className="px-3 py-3 text-sm text-[#b8d0e8]">
                                    Checking the weather in{" "}
                                    <span className="font-medium text-[#edf7ff]">
                                      {part.input.city}
                                    </span>
                                    ...
                                  </p>
                                </section>
                              );
                            case "output-available":
                              return (
                                <section key={key} className={panelClass}>
                                  <div className={headerClass}>
                                    <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#dfeefc]">
                                      <CloudSun className="h-4 w-4 text-[#9dd8ff]" />
                                      Weather result
                                    </span>
                                    <span className="flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2 py-1 text-[11px] text-emerald-200">
                                      <Check className="h-3 w-3" />
                                      Complete
                                    </span>
                                  </div>
                                  <p className="px-3 py-3 text-sm leading-6 text-[#edf7ff]">
                                    {part.output}
                                  </p>
                                </section>
                              );
                            case "output-error":
                              return (
                                <section
                                  key={key}
                                  className="overflow-hidden rounded-xl border border-red-400/40 bg-red-950/30"
                                >
                                  <div className="flex items-center justify-between gap-2 border-b border-red-400/20 px-3 py-2">
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
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex items-center gap-2 px-2 text-sm text-[#b8d0e8]">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Working through your request...
              </div>
            )}
          </div>

          {error && (
            <p
              role="alert"
              className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
            >
              {error.message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about a location or the weather..."
              rows={3}
              className="ai-input w-full resize-y rounded-[18px] px-4 py-3 text-sm text-white placeholder:text-[#85a5c1] focus:border-[#3bb3ff] focus:outline-none"
            />
            {isLoading ? (
              <button
                type="button"
                onClick={stop}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#ef4444] px-4 py-3 font-medium text-white transition hover:bg-[#f87171]"
              >
                <Square className="h-4 w-4 fill-current" />
                Stop response
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3aa4f3] to-[#3b82f6] px-4 py-3 font-medium text-white shadow-[0_10px_25px_rgba(59,130,246,0.35)] transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ArrowUp className="h-4 w-4" />
                Send message
              </button>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
