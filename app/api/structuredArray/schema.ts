import { z } from "zod";

export const PokemonSchema = z.object({
  name: z.string(),
  abilities: z.array(z.string()),
});

export const PokemonUISchema = z.array(PokemonSchema);
