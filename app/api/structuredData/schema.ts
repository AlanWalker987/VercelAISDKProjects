import { z } from "zod";

// Defined schema to get what is the structure of data AI needs to return.
export const RecipeSchema = z.object({
  recipe: z.object({
    name: z.string(),
    ingredients: z.array(
      z.object({
        name: z.string(),
        quantity: z.string(),
      }),
    ),
    steps: z.array(z.string()),
  }),
});
