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
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 py-12 text-white">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <h1 className="mb-6 text-2xl font-semibold">
          AI Food Recipe Generator
        </h1>

        {object?.recipe && (
          <div className="mb-6 rounded-xl border border-slate-700 bg-slate-950 p-5 shadow-inner">
            <h2 className="mb-5 border-b border-slate-800 pb-4 text-xl font-semibold text-slate-100">
              Recipe: {object.recipe.name}
            </h2>
            {object.recipe.ingredients && (
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-sky-400">
                  Ingredients:
                </h3>
                <ul className="space-y-2">
                  {object.recipe.ingredients && (
                    <div className="space-y-2">
                      {object.recipe.ingredients.map((ingredient, index) => (
                        <p
                          key={index}
                          className="flex items-center justify-between gap-4 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-300"
                        >
                          <span>{ingredient?.name}</span>
                          <span className="shrink-0 font-medium text-sky-300">
                            {ingredient?.quantity}
                          </span>
                        </p>
                      ))}
                    </div>
                  )}
                </ul>
              </div>
            )}
            {object.recipe.steps && (
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-sky-400">
                  Steps:
                </h3>
                <ol className="space-y-3">
                  {object.recipe.steps.map((step, index) => (
                    <li
                      key={index}
                      className="flex gap-3 rounded-lg border border-slate-800 bg-slate-900 px-3 py-3 text-sm leading-6 text-slate-300"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500/15 text-xs font-semibold text-sky-300">
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
          {isLoading && <div>Loading...</div>}
          <textarea
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
            placeholder="Enter a dish name..."
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
    </main>
  );
}
