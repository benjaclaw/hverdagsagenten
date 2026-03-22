import { z } from "zod";

export const finnSearchSchema = z.object({
  name: z.string().min(1, "Navn er påkrevd").max(100, "Maks 100 tegn"),
  url: z
    .string()
    .url("Ugyldig URL")
    .refine(
      (url) => url.includes("finn.no"),
      "URL må være fra finn.no"
    ),
});

export type FinnSearchInput = z.infer<typeof finnSearchSchema>;
