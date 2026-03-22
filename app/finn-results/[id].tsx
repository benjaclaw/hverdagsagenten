import { View, Text, FlatList, Pressable } from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { useFinnResults } from "../../src/hooks/useFinnSearches";
import { FinnResultItem } from "../../src/components/features/finn/FinnResultItem";
import { EmptyState, LoadingSpinner } from "../../src/components/ui";
import { Feather } from "@expo/vector-icons";
import { useColorScheme } from "react-native";

export default function FinnResultsScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const {
    data: results,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useFinnResults(id ?? "");

  return (
    <View className="flex-1 bg-bg-light dark:bg-bg-dark">
      <Stack.Screen
        options={{
          title: name ?? "Treff",
          headerStyle: {
            backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
          },
          headerTintColor: isDark ? "#FFFFFF" : "#0F172A",
          headerLeft: () => (
            <Pressable onPress={() => router.back()} className="mr-2">
              <Feather
                name="arrow-left"
                size={24}
                color={isDark ? "#FFFFFF" : "#0F172A"}
              />
            </Pressable>
          ),
        }}
      />

      {isLoading ? (
        <LoadingSpinner message="Laster treff..." />
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-red-600 dark:text-red-400 text-center">
            Kunne ikke laste treff: {error.message}
          </Text>
          <Pressable onPress={() => refetch()} className="mt-4">
            <Text className="text-primary font-semibold">Prøv igjen</Text>
          </Pressable>
        </View>
      ) : results && results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <FinnResultItem result={item} />}
          contentContainerClassName="px-4 pt-4 pb-8"
          onRefresh={() => refetch()}
          refreshing={isRefetching}
        />
      ) : (
        <EmptyState
          icon="inbox"
          title="Ingen treff ennå"
          description="Nye annonser vil dukke opp her når de matcher søket ditt"
        />
      )}
    </View>
  );
}
