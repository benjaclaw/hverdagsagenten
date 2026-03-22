import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

interface EmptyStateProps {
  icon?: keyof typeof Feather.glyphMap;
  title: string;
  description?: string;
}

export function EmptyState({
  icon = "inbox",
  title,
  description,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-6 py-12">
      <Feather name={icon} size={48} color="#94A3B8" />
      <Text className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
        {title}
      </Text>
      {description ? (
        <Text className="mt-2 text-center text-gray-500 dark:text-gray-400">
          {description}
        </Text>
      ) : null}
    </View>
  );
}
