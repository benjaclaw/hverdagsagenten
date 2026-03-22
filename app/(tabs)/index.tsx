import { useEffect } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useDashboardStats } from "../../src/hooks/useDashboardStats";
import { StatCard } from "../../src/components/features/dashboard/StatCard";
import { LoadingSpinner } from "../../src/components/ui";
import {
  registerForPushNotifications,
  savePushToken,
} from "../../src/services/pushService";
import { useAuthStore } from "../../src/stores/authStore";

export default function Dashboard() {
  const { data: stats, isLoading, refetch, isRefetching } = useDashboardStats();
  const session = useAuthStore((s) => s.session);

  useEffect(() => {
    if (!session) return;

    registerForPushNotifications().then((token) => {
      if (token) {
        savePushToken(token);
      }
    });
  }, [session]);

  if (isLoading) {
    return <LoadingSpinner message="Laster dashboard..." />;
  }

  return (
    <ScrollView
      className="flex-1 bg-bg-light dark:bg-bg-dark"
      contentContainerClassName="px-4 pt-6 pb-8"
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />
      }
    >
      <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        Hverdagsagenten
      </Text>
      <Text className="text-gray-500 dark:text-gray-400 mb-6">
        Oversikt over dine overvåkninger
      </Text>

      {/* Stats row 1 */}
      <View className="flex-row mb-3">
        <StatCard
          icon="search"
          title="Finn-søk"
          value={stats?.finnSearchCount ?? 0}
          color="#2563EB"
        />
        <StatCard
          icon="shopping-cart"
          title="Prisovervåkninger"
          value={stats?.priceWatchCount ?? 0}
          color="#059669"
        />
      </View>

      {/* Stats row 2 */}
      <View className="flex-row mb-6">
        <StatCard
          icon="bell"
          title="Nye Finn-treff"
          value={stats?.recentFinnResults ?? 0}
          subtitle="Siste 24 timer"
          color="#D97706"
        />
        <StatCard
          icon="tag"
          title="Prisvarslinger"
          value={stats?.recentPriceAlerts ?? 0}
          subtitle="Siste 24 timer"
          color="#DC2626"
        />
      </View>

      {/* Quick info */}
      <View className="rounded-xl bg-blue-50 dark:bg-blue-900/20 p-4">
        <Text className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">
          Tips
        </Text>
        <Text className="text-sm text-blue-700 dark:text-blue-400">
          Legg til Finn-søk og prisovervåkninger i fanene under for å få
          varsler om nye treff og prisendringer.
        </Text>
      </View>
    </ScrollView>
  );
}
