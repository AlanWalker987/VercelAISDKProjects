"use client";

import { FormEvent, useState } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { RecipeSchema } from "@/app/api/structuredData/schema";

export default function StructuredDataPage() {
  const [dishName, setDishName] = useState("");

  const { submit, object, isLoading, error, stop } = useObject({
    api: "/api/structuredData",
    schema: RecipeSchema,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const text = dishName.trim();
    submit({ dish: text });
    setDishName("");
  };

  return (
    <main className="min-h-full w-full px-2 py-3 text-white sm:px-3 sm:py-4 lg:px-4 lg:py-5">
      <div className="w-full min-w-0">
        <div className="ai-panel rounded-[28px] p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex items-center gap-3 sm:gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#2e6fa0] bg-[#1a3d68] text-xl text-[#dfeefc]">
              ◫
            </span>
            <h1 className="text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              AI Food Recipe Generator
            </h1>
          </div>

          {object?.recipe && (
            <div className="mb-6 rounded-[18px] border border-[#1a3b5d] bg-[#091d2f] p-5 shadow-inner">
              <h2 className="mb-5 border-b border-[#1a3b5d] pb-4 text-xl font-semibold text-[#edf7ff]">
                Recipe: {object.recipe.name}
              </h2>
              {object.recipe.ingredients && (
                <div className="mb-6">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#7ac7ff]">
                    Ingredients:
                  </h3>
                  <div className="space-y-2">
                    {object.recipe.ingredients.map((ingredient, index) => (
                      <p
                        key={index}
                        className="flex items-center justify-between gap-4 rounded-lg border border-[#1a3b5d] bg-[#0d2437] px-3 py-2 text-sm text-[#dfeefc]"
                      >
                        <span>{ingredient?.name}</span>
                        <span className="shrink-0 font-medium text-[#7ac7ff]">
                          {ingredient?.quantity}
                        </span>
                      </p>
                    ))}
                  </div>
                </div>
              )}
              {object.recipe.steps && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#7ac7ff]">
                    Steps:
                  </h3>
                  <ol className="space-y-3">
                    {object.recipe.steps.map((step, index) => (
                      <li
                        key={index}
                        className="flex gap-3 rounded-lg border border-[#1a3b5d] bg-[#0d2437] px-3 py-3 text-sm leading-6 text-[#dfeefc]"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#123d68] text-xs font-semibold text-[#7ac7ff]">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isLoading && (
              <div className="text-sm text-[#b8d0e8]">Loading...</div>
            )}
            <textarea
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              placeholder="Enter a dish name..."
              rows={5}
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
                {isLoading ? "Generating..." : "Generate"}
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
