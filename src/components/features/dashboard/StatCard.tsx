import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Card } from "../../ui/Card";

interface StatCardProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  value: number;
  subtitle?: string;
  color?: string;
}

export function StatCard({
  icon,
  title,
  value,
  subtitle,
  color = "#2563EB",
}: StatCardProps) {
  return (
    <Card className="flex-1 mr-3 last:mr-0">
      <View className="flex-row items-center mb-2">
        <View
          className="h-8 w-8 rounded-full items-center justify-center mr-2"
          style={{ backgroundColor: `${color}20` }}
        >
          <Feather name={icon} size={16} color={color} />
        </View>
        <Text className="text-xs text-gray-500 dark:text-gray-400">
          {title}
        </Text>
      </View>
      <Text className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </Text>
      {subtitle ? (
        <Text className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {subtitle}
        </Text>
      ) : null}
    </Card>
  );
}
