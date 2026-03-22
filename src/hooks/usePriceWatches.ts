import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPriceWatches,
  getPriceAlerts,
  createPriceWatch,
  deletePriceWatch,
  searchKassalProducts,
} from "../services/priceService";
import type { PriceWatch } from "../types";

const PRICE_WATCHES_KEY = ["price-watches"] as const;
const priceAlertsKey = (watchId: string) => ["price-alerts", watchId] as const;
const kassalSearchKey = (query: string) => ["kassal-search", query] as const;

export function usePriceWatches() {
  return useQuery({
    queryKey: PRICE_WATCHES_KEY,
    queryFn: getPriceWatches,
  });
}

export function usePriceAlerts(watchId: string) {
  return useQuery({
    queryKey: priceAlertsKey(watchId),
    queryFn: () => getPriceAlerts(watchId),
    enabled: !!watchId,
  });
}

export function useKassalSearch(query: string) {
  return useQuery({
    queryKey: kassalSearchKey(query),
    queryFn: () => searchKassalProducts(query),
    enabled: query.length >= 2,
  });
}

export function useCreatePriceWatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Pick<PriceWatch, "search_term" | "max_price">) =>
      createPriceWatch(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRICE_WATCHES_KEY });
    },
  });
}

export function useDeletePriceWatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePriceWatch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRICE_WATCHES_KEY });
    },
  });
}
