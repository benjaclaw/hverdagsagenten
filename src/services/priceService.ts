import { supabase } from "../lib/supabase";
import type { PriceWatch, PriceAlert } from "../types";

const KASSAL_API_BASE = "https://kassal.app/api/v1";

interface KassalProduct {
  name: string;
  brand: string | null;
  vendor: string | null;
  ean: string | null;
  url: string | null;
  image: string | null;
  description: string | null;
  current_price: {
    price: number;
    date: string;
  } | null;
  store: {
    name: string;
    code: string;
  } | null;
}

interface KassalSearchResponse {
  data: KassalProduct[];
}

export async function searchKassalProducts(
  query: string
): Promise<KassalProduct[]> {
  const apiKey = process.env.EXPO_PUBLIC_KASSALAPP_API_KEY ?? "";

  const response = await fetch(
    `${KASSAL_API_BASE}/products?search=${encodeURIComponent(query)}&size=10`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Kassal API feilet: ${response.status}`);
  }

  const json: KassalSearchResponse = await response.json();
  return json.data ?? [];
}

export async function getPriceWatches(): Promise<PriceWatch[]> {
  const { data, error } = await supabase
    .from("price_watches")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createPriceWatch(
  input: Pick<PriceWatch, "search_term" | "max_price">
): Promise<PriceWatch> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Ikke innlogget");

  const { data, error } = await supabase
    .from("price_watches")
    .insert({ ...input, user_id: user.id, is_active: true })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deletePriceWatch(id: string): Promise<void> {
  const { error } = await supabase.from("price_watches").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function togglePriceWatch(
  id: string,
  isActive: boolean
): Promise<PriceWatch> {
  const { data, error } = await supabase
    .from("price_watches")
    .update({ is_active: isActive })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getPriceAlerts(watchId: string): Promise<PriceAlert[]> {
  const { data, error } = await supabase
    .from("price_alerts")
    .select("*")
    .eq("watch_id", watchId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export type { KassalProduct };
