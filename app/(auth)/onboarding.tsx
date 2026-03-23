import { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  useWindowDimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const ONBOARDING_KEY = "hverdagsagenten_onboarding_done";

interface OnboardingPage {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  description: string;
  color: string;
}

const pages: OnboardingPage[] = [
  {
    icon: "search",
    title: "Finn-overvåkning",
    description:
      "Legg til Finn-søk og få varsler når nye annonser dukker opp. Aldri gå glipp av et godt tilbud igjen.",
    color: "#2563EB",
  },
  {
    icon: "shopping-cart",
    title: "Prisovervåkning",
    description:
      "Overvåk matpriser og få beskjed når produktene du vil ha er på tilbud.",
    color: "#059669",
  },
  {
    icon: "bell",
    title: "Smarte varsler",
    description:
      "Få push-varsler rett på mobilen. Du bestemmer hva du vil overvåke.",
    color: "#D97706",
  },
];

export async function markOnboardingDone(): Promise<void> {
  try {
    if (Platform.OS === "web") {
      localStorage.setItem(ONBOARDING_KEY, "true");
    } else {
      await SecureStore.setItemAsync(ONBOARDING_KEY, "true");
    }
  } catch {
    // ignore
  }
}

export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    if (Platform.OS === "web") {
      return localStorage.getItem(ONBOARDING_KEY) === "true";
    }
    const val = await SecureStore.getItemAsync(ONBOARDING_KEY);
    return val === "true";
  } catch {
    return false;
  }
}

export default function OnboardingScreen() {
  const [currentPage, setCurrentPage] = useState(0);
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const page = pages[currentPage];

  const handleNext = async () => {
    if (currentPage < pages.length - 1) {
      const next = currentPage + 1;
      setCurrentPage(next);
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
    } else {
      await markOnboardingDone();
      router.replace("/(auth)/login");
    }
  };

  const handleSkip = async () => {
    await markOnboardingDone();
    router.replace("/(auth)/login");
  };

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = e.nativeEvent.contentOffset.x;
      const pageIndex = Math.round(offsetX / width);
      if (pageIndex >= 0 && pageIndex < pages.length) {
        setCurrentPage(pageIndex);
      }
    },
    [width],
  );

  if (!page) return null;

  return (
    <View className="flex-1 bg-bg-light dark:bg-bg-dark">
      {/* Skip button */}
      <View className="flex-row justify-end px-6 pt-16">
        <Pressable onPress={handleSkip}>
          <Text className="text-gray-500 dark:text-gray-400 font-medium">
            Hopp over
          </Text>
        </Pressable>
      </View>

      {/* Swipeable content */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        scrollEventThrottle={16}
        className="flex-1"
      >
        {pages.map((p, index) => (
          <View
            key={index}
            style={{ width }}
            className="flex-1 items-center justify-center px-8"
          >
            <View
              className="h-24 w-24 rounded-full items-center justify-center mb-8"
              style={{ backgroundColor: `${p.color}20` }}
            >
              <Feather name={p.icon} size={48} color={p.color} />
            </View>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">
              {p.title}
            </Text>
            <Text className="text-base text-gray-500 dark:text-gray-400 text-center leading-6">
              {p.description}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Bottom controls */}
      <View className="px-6 pb-12">
        {/* Page indicators */}
        <View className="flex-row justify-center mb-8">
          {pages.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full mx-1 ${
                index === currentPage ? "w-8 bg-primary" : "w-2 bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </View>

        <Pressable
          onPress={handleNext}
          className="items-center rounded-lg bg-primary px-4 py-3.5"
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <Text className="text-base font-semibold text-white">
            {currentPage < pages.length - 1 ? "Neste" : "Kom i gang"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
