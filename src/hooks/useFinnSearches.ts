import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFinnSearches,
  getFinnResults,
  createFinnSearch,
  deleteFinnSearch,
  toggleFinnSearch,
} from "../services/finnService";
import type { FinnSearch } from "../types";

const FINN_SEARCHES_KEY = ["finn-searches"] as const;
const finnResultsKey = (searchId: string) =>
  ["finn-results", searchId] as const;

export function useFinnSearches() {
  return useQuery({
    queryKey: FINN_SEARCHES_KEY,
    queryFn: getFinnSearches,
  });
}

export function useFinnResults(searchId: string) {
  return useQuery({
    queryKey: finnResultsKey(searchId),
    queryFn: () => getFinnResults(searchId),
    enabled: !!searchId,
  });
}

export function useCreateFinnSearch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Pick<FinnSearch, "name" | "url">) =>
      createFinnSearch(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINN_SEARCHES_KEY });
    },
  });
}

export function useDeleteFinnSearch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteFinnSearch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINN_SEARCHES_KEY });
    },
  });
}

export function useToggleFinnSearch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleFinnSearch(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINN_SEARCHES_KEY });
    },
  });
}
