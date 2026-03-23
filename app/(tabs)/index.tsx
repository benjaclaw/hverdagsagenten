import { useEffect, useState, useRef, useCallback } from "react";
import { View, Text, ScrollView, RefreshControl, Pressable } from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useDashboardStats } from "../../src/hooks/useDashboardStats";
import { StatCard } from "../../src/components/features/dashboard/StatCard";
import { LoadingSpinner } from "../../src/components/ui";
import { Card } from "../../src/components/ui/Card";
import {
  registerForPushNotifications,
  savePushToken,
} from "../../src/services/pushService";
import { useAuthStore } from "../../src/stores/authStore";

interface HeroSlide {
  title: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
  bgColor: string;
}

const heroSlides: HeroSlide[] = [
  {
    title: "Få varsel når drømmeboligen dukker opp",
    icon: "home",
    color: "#2563EB",
    bgColor: "#DBEAFE",
  },
  {
    title: "Aldri gå glipp av tilbud på favorittvarene",
    icon: "tag",
    color: "#059669",
    bgColor: "#D1FAE5",
  },
  {
    title: "Spar tid og penger med smarte agenter",
    icon: "zap",
    color: "#D97706",
    bgColor: "#FEF3C7",
  },
];

function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const slide = heroSlides[current];
  if (!slide) return null;

  return (
    <View className="mb-6">
      <View
        className="rounded-2xl p-5 items-center"
        style={{ backgroundColor: slide.bgColor }}
      >
        <View
          className="h-14 w-14 rounded-full items-center justify-center mb-3"
          style={{ backgroundColor: `${slide.color}20` }}
        >
          <Feather name={slide.icon} size={28} color={slide.color} />
        </View>
        <Text
          className="text-base font-semibold text-center"
          style={{ color: slide.color }}
        >
          {slide.title}
        </Text>
      </View>
      <View className="flex-row justify-center mt-3 gap-2">
        {heroSlides.map((_, index) => (
          <Pressable
            key={index}
            onPress={() => {
              setCurrent(index);
              if (timerRef.current) clearInterval(timerRef.current);
              startTimer();
            }}
          >
            <View
              className={`h-2 rounded-full ${
                index === current ? "w-6 bg-primary" : "w-2 bg-gray-300 dark:bg-gray-600"
              }`}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

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

      {/* Hero banner */}
      <HeroBanner />

      {/* Stats row 1 */}
      <View className="flex-row gap-3 mb-3">
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
      <View className="flex-row gap-3 mb-6">
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

      {/* Quick action buttons */}
      <View className="flex-row gap-3">
        <Card
          onPress={() => router.push("/(tabs)/finn")}
          className="flex-1"
        >
          <View className="items-center">
            <View className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 items-center justify-center mb-2">
              <Feather name="plus" size={20} color="#2563EB" />
            </View>
            <Text className="text-sm font-semibold text-gray-900 dark:text-white text-center">
              Nytt Finn-søk
            </Text>
          </View>
        </Card>
        <Card
          onPress={() => router.push("/(tabs)/prices")}
          className="flex-1"
        >
          <View className="items-center">
            <View className="h-10 w-10 rounded-full bg-green-50 dark:bg-green-900/20 items-center justify-center mb-2">
              <Feather name="shopping-cart" size={20} color="#059669" />
            </View>
            <Text className="text-sm font-semibold text-gray-900 dark:text-white text-center">
              Søk matvarepriser
            </Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}
