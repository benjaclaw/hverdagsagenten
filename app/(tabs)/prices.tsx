import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Alert,
  SectionList,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  usePriceWatches,
  useKassalSearch,
  useCreatePriceWatch,
} from "../../src/hooks/usePriceWatches";
import { KassalSearchResult } from "../../src/components/features/prices/KassalSearchResult";
import { PriceWatchItem } from "../../src/components/features/prices/PriceWatchItem";
import { EmptyState, LoadingSpinner } from "../../src/components/ui";

export default function PricesScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const { data: watches, isLoading: watchesLoading, refetch } = usePriceWatches();
  const { data: searchResults, isLoading: searchLoading } =
    useKassalSearch(debouncedQuery);
  const createMutation = useCreatePriceWatch();

  const handleSearchChange = useCallback(
    (text: string) => {
      setSearchQuery(text);
      if (debounceTimer) clearTimeout(debounceTimer);
      const timer = setTimeout(() => {
        setDebouncedQuery(text.trim());
      }, 500);
      setDebounceTimer(timer);
    },
    [debounceTimer]
  );

  const handleAddWatch = (searchTerm: string, maxPrice: number | null) => {
    createMutation.mutate(
      { search_term: searchTerm, max_price: maxPrice },
      {
        onSuccess: () => {
          Alert.alert("Lagt til", `Overvåkning opprettet for "${searchTerm}"`);
        },
        onError: (error) => {
          Alert.alert("Feil", error.message);
        },
      }
    );
  };

  return (
    <View className="flex-1 bg-bg-light dark:bg-bg-dark">
      {/* Search bar */}
      <View className="px-4 pt-4">
        <View className="flex-row items-center rounded-lg border border-gray-300 bg-white px-3 dark:border-gray-600 dark:bg-gray-800">
          <Feather name="search" size={18} color="#9CA3AF" />
          <TextInput
            className="flex-1 px-3 py-3 text-gray-900 dark:text-white"
            placeholder="Søk etter matvarer..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={handleSearchChange}
            autoCapitalize="none"
          />
          {searchQuery ? (
            <Pressable
              onPress={() => {
                setSearchQuery("");
                setDebouncedQuery("");
              }}
            >
              <Feather name="x" size={18} color="#9CA3AF" />
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Search results from Kassal */}
      {debouncedQuery.length >= 2 ? (
        <View className="px-4 pt-4">
          <Text className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Søkeresultater
          </Text>
          {searchLoading ? (
            <LoadingSpinner fullScreen={false} message="Søker..." />
          ) : searchResults && searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              keyExtractor={(item, index) =>
                `${item.ean ?? item.name}-${index}`
              }
              renderItem={({ item }) => (
                <KassalSearchResult
                  product={item}
                  onAddWatch={handleAddWatch}
                />
              )}
              scrollEnabled={false}
            />
          ) : (
            <Text className="text-center text-gray-500 dark:text-gray-400 py-4">
              Ingen resultater for &quot;{debouncedQuery}&quot;
            </Text>
          )}
        </View>
      ) : null}

      {/* Existing watches */}
      <View className="flex-1 px-4 pt-4">
        <Text className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Dine overvåkninger
        </Text>
        {watchesLoading ? (
          <LoadingSpinner fullScreen={false} />
        ) : watches && watches.length > 0 ? (
          <FlatList
            data={watches}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <PriceWatchItem watch={item} />}
            contentContainerClassName="pb-8"
            onRefresh={() => refetch()}
            refreshing={watchesLoading}
          />
        ) : (
          <EmptyState
            icon="shopping-cart"
            title="Ingen overvåkninger"
            description="Søk etter matvarer og legg til overvåkning"
          />
        )}
      </View>
    </View>
  );
}
