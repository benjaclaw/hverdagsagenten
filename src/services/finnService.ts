import { supabase } from "../lib/supabase";
import type { FinnSearch, FinnResult } from "../types";

export async function getFinnSearches(): Promise<FinnSearch[]> {
  const { data, error } = await supabase
    .from("finn_searches")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getFinnSearch(id: string): Promise<FinnSearch> {
  const { data, error } = await supabase
    .from("finn_searches")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function createFinnSearch(
  input: Pick<FinnSearch, "name" | "url">
): Promise<FinnSearch> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Ikke innlogget");

  const { data, error } = await supabase
    .from("finn_searches")
    .insert({ ...input, user_id: user.id, is_active: true })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteFinnSearch(id: string): Promise<void> {
  const { error } = await supabase.from("finn_searches").delete().eq("id", id);

  if (error) throw new Error(error.message);
}

export async function toggleFinnSearch(
  id: string,
  isActive: boolean
): Promise<FinnSearch> {
  const { data, error } = await supabase
    .from("finn_searches")
    .update({ is_active: isActive })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getFinnResults(searchId: string): Promise<FinnResult[]> {
  const { data, error } = await supabase
    .from("finn_results")
    .select("*")
    .eq("search_id", searchId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}
