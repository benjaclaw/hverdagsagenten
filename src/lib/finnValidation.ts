import { z } from "zod";

export const FINN_CATEGORIES = [
  { value: "torget", label: "Torget", path: "/bap/forsale/search.html" },
  { value: "bil", label: "Bil", path: "/car/used/search.html" },
  { value: "bolig", label: "Bolig", path: "/realestate/homes/search.html" },
  { value: "jobb", label: "Jobb", path: "/job/fulltime/search.html" },
  { value: "mc", label: "MC", path: "/mc/used/search.html" },
  { value: "bat", label: "Båt", path: "/boat/used/search.html" },
] as const;

export type FinnCategory = (typeof FINN_CATEGORIES)[number]["value"];

export const finnSearchSchema = z.object({
  name: z.string().min(1, "Navn er påkrevd").max(100, "Maks 100 tegn"),
  category: z.enum(["torget", "bil", "bolig", "jobb", "mc", "bat"], {
    message: "Velg en kategori",
  }),
  query: z.string().min(1, "Søkeord er påkrevd").max(200, "Maks 200 tegn"),
  priceFrom: z
    .number()
    .min(0, "Pris kan ikke være negativ")
    .nullable()
    .optional(),
  priceTo: z
    .number()
    .min(0, "Pris kan ikke være negativ")
    .nullable()
    .optional(),
});

export type FinnSearchInput = z.infer<typeof finnSearchSchema>;

export function buildFinnUrl(input: {
  category: FinnCategory;
  query: string;
  priceFrom?: number | null;
  priceTo?: number | null;
}): string {
  const cat = FINN_CATEGORIES.find((c) => c.value === input.category);
  if (!cat) throw new Error("Ugyldig kategori");

  const params = new URLSearchParams();
  params.set("q", input.query);
  if (input.priceFrom != null) {
    params.set("price_from", String(input.priceFrom));
  }
  if (input.priceTo != null) {
    params.set("price_to", String(input.priceTo));
  }

  return `https://www.finn.no${cat.path}?${params.toString()}`;
}
