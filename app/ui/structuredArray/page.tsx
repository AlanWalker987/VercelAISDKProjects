"use client";

import { FormEvent, useState } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { ListChecks } from "lucide-react";
import { PokemonUISchema } from "@/app/api/structuredArray/schema";

export default function StructuredArrayPage() {
  const [type, setType] = useState("");

  const { submit, object, isLoading, error, stop } = useObject({
    api: "/api/structuredArray",
    schema: PokemonUISchema,
  });

  const pokemonList = Array.isArray(object)
    ? object.filter(
        (pokemon): pokemon is { name: string; abilities: string[] } =>
          Boolean(pokemon && typeof pokemon.name === "string"),
      )
    : [];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = type.trim();
    if (!value) {
      return;
    }

    submit({ type: value });
    setType("");
  };

  return (
    <main className="min-h-full w-full px-2 py-3 text-white sm:px-3 sm:py-4 lg:px-4 lg:py-5">
      <div className="w-full min-w-0">
        <div className="ai-panel rounded-[28px] p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex items-center gap-3 sm:gap-4">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#2e6fa0] bg-[#1a3d68] text-[#dfeefc]"
              aria-hidden="true"
            >
              <ListChecks className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <h1 className="text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              AI Pokémon Generator
            </h1>
          </div>

          {pokemonList.length > 0 && (
            <div className="mb-6 space-y-4">
              {pokemonList.map((pokemon, index) => (
                <div
                  key={`${pokemon.name}-${index}`}
                  className="rounded-[18px] border border-[#1a3b5d] bg-[#091d2f] p-5 shadow-inner"
                >
                  <h2 className="mb-4 text-xl font-semibold text-[#edf7ff]">
                    {pokemon.name}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {(pokemon.abilities ?? []).map((ability, abilityIndex) => (
                      <span
                        key={`${ability}-${abilityIndex}`}
                        className="rounded-full border border-[#2d7ed7]/40 bg-[#153c63] px-3 py-1 text-xs font-medium text-[#bfe6ff]"
                      >
                        {ability}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isLoading && (
              <div className="text-sm text-[#b8d0e8]">Loading...</div>
            )}
            <textarea
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Enter a Pokémon type..."
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
                disabled={isLoading || !type.trim()}
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
