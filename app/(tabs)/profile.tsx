import { View, Text, Alert, Pressable } from "react-native";
import { useAuthStore } from "../../src/stores/authStore";
import { useThemeStore } from "../../src/stores/themeStore";
import { Button } from "../../src/components/ui";
import { Feather } from "@expo/vector-icons";

type ThemeMode = "light" | "dark" | "system";

const themeOptions: { value: ThemeMode; label: string; icon: keyof typeof Feather.glyphMap }[] = [
  { value: "light", label: "Lys", icon: "sun" },
  { value: "dark", label: "Mørk", icon: "moon" },
  { value: "system", label: "System", icon: "smartphone" },
];

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);

  const handleSignOut = () => {
    Alert.alert("Logg ut", "Er du sikker på at du vil logge ut?", [
      { text: "Avbryt", style: "cancel" },
      {
        text: "Logg ut",
        style: "destructive",
        onPress: () => signOut(),
      },
    ]);
  };

  return (
    <View className="flex-1 bg-bg-light dark:bg-bg-dark px-4 pt-6">
      <View className="items-center mb-8">
        <View className="h-20 w-20 rounded-full bg-primary items-center justify-center mb-4">
          <Text className="text-3xl font-bold text-white">
            {user?.email?.charAt(0).toUpperCase() ?? "?"}
          </Text>
        </View>
        <Text className="text-lg font-semibold text-gray-900 dark:text-white">
          {user?.email ?? "Ukjent bruker"}
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Medlem siden{" "}
          {user?.created_at
            ? new Date(user.created_at).toLocaleDateString("nb-NO")
            : "ukjent"}
        </Text>
      </View>

      {/* Theme selector */}
      <View className="mb-6">
        <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Utseende
        </Text>
        <View className="flex-row gap-3">
          {themeOptions.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => setMode(option.value)}
              className={`flex-1 items-center rounded-xl border p-3 ${
                mode === option.value
                  ? "border-primary bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
              }`}
            >
              <Feather
                name={option.icon}
                size={20}
                color={mode === option.value ? "#2563EB" : "#9CA3AF"}
              />
              <Text
                className={`mt-1 text-xs font-medium ${
                  mode === option.value
                    ? "text-primary"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="mt-auto pb-8">
        <Button title="Logg ut" variant="danger" onPress={handleSignOut} />
      </View>
    </View>
  );
}
