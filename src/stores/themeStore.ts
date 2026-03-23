import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { Platform, useColorScheme as useSystemColorScheme } from "react-native";

type ThemeMode = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

const THEME_KEY = "hverdagsagenten_theme";

interface ThemeState {
  mode: ThemeMode;
  loaded: boolean;
  setMode: (mode: ThemeMode) => void;
  loadTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: "light",
  loaded: false,
  setMode: (mode: ThemeMode) => {
    set({ mode });
    if (Platform.OS === "web") {
      try {
        localStorage.setItem(THEME_KEY, mode);
      } catch {
        // ignore
      }
    } else {
      SecureStore.setItemAsync(THEME_KEY, mode).catch(() => {
        // ignore
      });
    }
  },
  loadTheme: async () => {
    try {
      let stored: string | null = null;
      if (Platform.OS === "web") {
        stored = localStorage.getItem(THEME_KEY);
      } else {
        stored = await SecureStore.getItemAsync(THEME_KEY);
      }
      if (stored === "light" || stored === "dark" || stored === "system") {
        set({ mode: stored, loaded: true });
      } else {
        set({ loaded: true });
      }
    } catch {
      set({ loaded: true });
    }
  },
}));

export function useResolvedTheme(): ResolvedTheme {
  const mode = useThemeStore((s) => s.mode);
  const systemScheme = useSystemColorScheme();

  if (mode === "system") {
    return systemScheme === "dark" ? "dark" : "light";
  }
  return mode;
}
