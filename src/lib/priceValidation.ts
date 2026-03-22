import { z } from "zod";

export const priceWatchSchema = z.object({
  search_term: z.string().min(2, "Søkeord må være minst 2 tegn").max(100, "Maks 100 tegn"),
  max_price: z
    .number()
    .positive("Pris må være positiv")
    .nullable()
    .optional()
    .transform((val) => val ?? null),
});

export type PriceWatchInput = z.infer<typeof priceWatchSchema>;
