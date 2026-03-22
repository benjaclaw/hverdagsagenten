import { View, Text, Alert } from "react-native";
import { useAuthStore } from "../../src/stores/authStore";
import { Button } from "../../src/components/ui";

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

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

      <View className="mt-auto pb-8">
        <Button title="Logg ut" variant="danger" onPress={handleSignOut} />
      </View>
    </View>
  );
}
