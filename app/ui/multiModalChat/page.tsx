"use client";

import Image from "next/image";
import { useState, useRef, type FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessagesSquare } from "lucide-react";

export default function MultiModalChatPage() {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/multiModalChat" }),
  });
  const isLoading = status === "submitted" || status === "streaming";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = input.trim();
    if (!text && !files?.length) {
      return;
    }

    await sendMessage({ text, files });
    setInput("");
    setFiles(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
              <MessagesSquare className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <h1 className="text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              Multi-Modal Chat
            </h1>
          </div>

          <div
            tabIndex={0}
            className="app-scrollbar ai-subpanel mb-6 max-h-[52vh] min-h-[180px] space-y-4 overflow-y-auto rounded-[22px] p-4 focus-visible:outline-none"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[90%] rounded-2xl border p-4 ${
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
                      case "file":
                        if (part.mediaType?.startsWith("image/")) {
                          return (
                            <Image
                              key={`${message.id}-${index}`}
                              src={part.url}
                              alt={part.filename ?? `attachment-${index + 1}`}
                              width={500}
                              height={500}
                              unoptimized
                              className="h-auto max-h-80 w-full rounded-lg object-contain"
                            />
                          );
                        }
                        if (part.mediaType?.startsWith("application/pdf")) {
                          return (
                            <iframe
                              key={`${message.id}-${index}`}
                              src={part.url}
                              title={part.filename ?? `attachment-${index + 1}`}
                              className="h-96 w-full rounded-lg border border-[#1a3b5d] bg-white"
                            />
                          );
                        }
                        return null;
                      default:
                        return null;
                    }
                  })}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-[#b8d0e8]">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#2f4966] border-t-[#5ec2ff]" />
                Thinking...
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label
                htmlFor="multimodal-file-upload"
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#22507f] bg-[#0c2038] px-3 py-2 text-sm font-medium text-[#dfeefc] transition hover:border-[#3eb3ff] hover:text-white"
              >
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
                {files?.length
                  ? `${files.length} file${files.length === 1 ? "" : "s"} attached`
                  : "Attach images or PDFs"}
              </label>
              <input
                id="multimodal-file-upload"
                type="file"
                accept="image/*,application/pdf"
                className="sr-only"
                onChange={(event) =>
                  setFiles(event.currentTarget.files ?? undefined)
                }
                multiple
                ref={fileInputRef}
              />
            </div>

            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about an image or PDF, or just say hello..."
              rows={3}
              className="ai-input w-full rounded-[18px] px-4 py-3 text-sm text-white placeholder:text-[#85a5c1] focus:border-[#3bb3ff] focus:outline-none"
            />

            <div className="flex gap-3">
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
                  disabled={isLoading || (!input.trim() && !files?.length)}
                  className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-[#3aa4f3] to-[#3b82f6] px-4 py-3 font-medium text-white shadow-[0_10px_25px_rgba(59,130,246,0.35)] transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Send Message
                </button>
              )}
            </div>
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
