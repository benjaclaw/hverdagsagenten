import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

interface DashboardStats {
  finnSearchCount: number;
  priceWatchCount: number;
  recentFinnResults: number;
  recentPriceAlerts: number;
}

async function fetchDashboardStats(): Promise<DashboardStats> {
  const [finnSearches, priceWatches, finnResults, priceAlerts] =
    await Promise.all([
      supabase
        .from("finn_searches")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("price_watches")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("finn_results")
        .select("id", { count: "exact", head: true })
        .gte(
          "created_at",
          new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        ),
      supabase
        .from("price_alerts")
        .select("id", { count: "exact", head: true })
        .gte(
          "created_at",
          new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        ),
    ]);

  return {
    finnSearchCount: finnSearches.count ?? 0,
    priceWatchCount: priceWatches.count ?? 0,
    recentFinnResults: finnResults.count ?? 0,
    recentPriceAlerts: priceAlerts.count ?? 0,
  };
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
    refetchInterval: 1000 * 60 * 5,
  });
}
