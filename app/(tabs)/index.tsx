import { View, Text } from "react-native";

export default function Dashboard() {
  return (
    <View className="flex-1 items-center justify-center bg-bg-light dark:bg-bg-dark">
      <Text className="text-2xl font-bold text-gray-900 dark:text-white">
        Hverdagsagenten
      </Text>
      <Text className="mt-2 text-gray-500 dark:text-gray-400">
        Dine aktive overvåkninger
      </Text>
    </View>
  );
}
