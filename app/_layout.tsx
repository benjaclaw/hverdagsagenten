import "../global.css";
import { useEffect, useState } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuthStore } from "../src/stores/authStore";
import { hasCompletedOnboarding } from "./(auth)/onboarding";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function AuthGuard() {
  const session = useAuthStore((s) => s.session);
  const loading = useAuthStore((s) => s.loading);
  const segments = useSegments();
  const router = useRouter();
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    hasCompletedOnboarding()
      .then((done) => {
        setNeedsOnboarding(!done);
        setOnboardingChecked(true);
      })
      .catch(() => {
        setOnboardingChecked(true);
      });
  }, []);

  useEffect(() => {
    if (loading || !onboardingChecked) return;

    const inAuthGroup = segments[0] === "(auth)";

    const secondSegment = segments.length > 1 ? (segments as string[])[1] : undefined;
    if (needsOnboarding && secondSegment !== "onboarding") {
      router.replace("/(auth)/onboarding");
    } else if (!session && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (session && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [session, loading, segments, onboardingChecked, needsOnboarding]);

  return <Slot />;
}

export default function RootLayout() {
  const setSession = useAuthStore((s) => s.setSession);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { supabase } = await import("../src/lib/supabase");
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (mounted) setSession(session);

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, newSession) => {
          if (mounted) setSession(newSession);
        });

        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
      } catch {
        if (mounted) setSession(null);
      }
    };

    init();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthGuard />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
