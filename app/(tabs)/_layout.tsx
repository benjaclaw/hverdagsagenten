import { useColorScheme } from "react-native";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
        },
        headerTintColor: isDark ? "#FFFFFF" : "#0F172A",
        tabBarStyle: {
          backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
          borderTopColor: isDark ? "#1E293B" : "#E2E8F0",
        },
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: isDark ? "#94A3B8" : "#64748B",
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="finn" options={{ title: "Finn" }} />
      <Tabs.Screen name="prices" options={{ title: "Priser" }} />
      <Tabs.Screen name="profile" options={{ title: "Profil" }} />
    </Tabs>
  );
}
