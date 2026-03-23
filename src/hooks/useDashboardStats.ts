import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

interface DashboardStats {
  finnSearchCount: number;
  priceWatchCount: number;
  recentFinnResults: number;
  recentPriceAlerts: number;
}

async function safeCount(
  query: PromiseLike<{ count: number | null; error: unknown }>,
): Promise<number> {
  try {
    const result = await query;
    if (result.error) return 0;
    return result.count ?? 0;
  } catch {
    return 0;
  }
}

async function fetchDashboardStats(): Promise<DashboardStats> {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [finnSearchCount, priceWatchCount, recentFinnResults, recentPriceAlerts] =
    await Promise.all([
      safeCount(
        supabase
          .from("finn_searches")
          .select("id", { count: "exact", head: true }),
      ),
      safeCount(
        supabase
          .from("price_watches")
          .select("id", { count: "exact", head: true }),
      ),
      safeCount(
        supabase
          .from("finn_results")
          .select("id", { count: "exact", head: true })
          .gte("created_at", yesterday),
      ),
      safeCount(
        supabase
          .from("price_alerts")
          .select("id", { count: "exact", head: true })
          .gte("created_at", yesterday),
      ),
    ]);

  return {
    finnSearchCount,
    priceWatchCount,
    recentFinnResults,
    recentPriceAlerts,
  };
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
    refetchInterval: 1000 * 60 * 5,
  });
}
