import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen name="index" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="finn" options={{ title: "Finn" }} />
      <Tabs.Screen name="prices" options={{ title: "Priser" }} />
      <Tabs.Screen name="profile" options={{ title: "Profil" }} />
    </Tabs>
  );
}
