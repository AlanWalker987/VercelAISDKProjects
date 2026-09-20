"use client";

import { useState, type FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const isLoading = status === "submitted" || status === "streaming";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = input.trim();
    await sendMessage({ text });
    setInput("");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 py-12 text-white">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <h1 className="mb-6 text-2xl font-semibold">AI Chat Bot</h1>

        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-2 max-w-[85%] rounded-xl border p-4 last:mb-0 ${
              message.role === "user"
                ? "ml-auto border-sky-500/40 bg-sky-500/10"
                : "mr-auto border-slate-700 bg-slate-950"
            }`}
          >
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
              {message.role === "user" ? "You:" : "AI:"}
            </div>
            {message.parts.map((part, index) => {
              switch (part.type) {
                case "text":
                  return (
                    <p
                      key={`${message.id}-${index}`}
                      className="whitespace-pre-wrap text-sm leading-7 text-slate-200"
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

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {isLoading && (
            <div className="text-sm text-slate-400">Thinking...</div>
          )}
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask something..."
            rows={5}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-sky-500 focus:outline-none"
          />

          {isLoading ? (
            <button
              type="button"
              onClick={stop}
              className="w-full cursor-pointer rounded-xl bg-red-500 px-4 py-3 font-medium text-slate-950 transition hover:bg-red-400"
            >
              Stop Chat
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer rounded-xl bg-sky-500 px-4 py-3 font-medium text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
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
    </main>
  );
}
