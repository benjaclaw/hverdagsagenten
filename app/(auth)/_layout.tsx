import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function AuthLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
        },
      }}
    />
  );
}
