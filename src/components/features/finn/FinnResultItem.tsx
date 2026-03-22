import { View, Text, Image, Linking } from "react-native";
import { Card } from "../../ui/Card";
import type { FinnResult } from "../../../types";

interface FinnResultItemProps {
  result: FinnResult;
}

export function FinnResultItem({ result }: FinnResultItemProps) {
  const handlePress = () => {
    Linking.openURL(result.url);
  };

  return (
    <Card onPress={handlePress} className="mb-3">
      <View className="flex-row">
        {result.image_url ? (
          <Image
            source={{ uri: result.image_url }}
            className="h-20 w-20 rounded-lg mr-3"
            resizeMode="cover"
          />
        ) : (
          <View className="h-20 w-20 rounded-lg bg-gray-200 dark:bg-gray-700 items-center justify-center mr-3">
            <Text className="text-gray-400">Ingen bilde</Text>
          </View>
        )}
        <View className="flex-1">
          <Text
            className="text-base font-semibold text-gray-900 dark:text-white"
            numberOfLines={2}
          >
            {result.title}
          </Text>
          {result.price ? (
            <Text className="mt-1 text-lg font-bold text-primary">
              {result.price}
            </Text>
          ) : null}
          <Text className="mt-1 text-xs text-gray-400">
            {new Date(result.created_at).toLocaleDateString("nb-NO")}
          </Text>
        </View>
      </View>
    </Card>
  );
}
