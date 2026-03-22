import { View, Text, FlatList, Pressable } from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { usePriceAlerts } from "../../src/hooks/usePriceWatches";
import { EmptyState, LoadingSpinner } from "../../src/components/ui";
import { Card } from "../../src/components/ui/Card";
import { Feather } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import type { PriceAlert } from "../../src/types";

function PriceAlertItem({ alert }: { alert: PriceAlert }) {
  return (
    <Card className="mb-3">
      <Text className="text-base font-semibold text-gray-900 dark:text-white">
        {alert.product_name}
      </Text>
      {alert.store ? (
        <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {alert.store}
        </Text>
      ) : null}
      <Text className="text-lg font-bold text-primary mt-1">
        {alert.price.toFixed(2)} kr
      </Text>
      <Text className="text-xs text-gray-400 mt-1">
        {new Date(alert.created_at).toLocaleDateString("nb-NO")}
      </Text>
    </Card>
  );
}

export default function PriceAlertsScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const {
    data: alerts,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = usePriceAlerts(id ?? "");

  return (
    <View className="flex-1 bg-bg-light dark:bg-bg-dark">
      <Stack.Screen
        options={{
          title: name ?? "Prisvarslinger",
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
        <LoadingSpinner message="Laster prishistorikk..." />
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-red-600 dark:text-red-400 text-center">
            Kunne ikke laste prishistorikk: {error.message}
          </Text>
          <Pressable onPress={() => refetch()} className="mt-4">
            <Text className="text-primary font-semibold">Prøv igjen</Text>
          </Pressable>
        </View>
      ) : alerts && alerts.length > 0 ? (
        <FlatList
          data={alerts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PriceAlertItem alert={item} />}
          contentContainerClassName="px-4 pt-4 pb-8"
          onRefresh={() => refetch()}
          refreshing={isRefetching}
        />
      ) : (
        <EmptyState
          icon="tag"
          title="Ingen prisvarslinger ennå"
          description="Prisvarslinger dukker opp her når prisen endrer seg"
        />
      )}
    </View>
  );
}
