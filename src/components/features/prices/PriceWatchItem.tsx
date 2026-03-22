import { View, Text, Alert } from "react-native";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { useDeletePriceWatch } from "../../../hooks/usePriceWatches";
import type { PriceWatch } from "../../../types";

interface PriceWatchItemProps {
  watch: PriceWatch;
}

export function PriceWatchItem({ watch }: PriceWatchItemProps) {
  const deleteMutation = useDeletePriceWatch();

  const handleDelete = () => {
    Alert.alert(
      "Slett overvåkning",
      `Vil du slette overvåkning for "${watch.search_term}"?`,
      [
        { text: "Avbryt", style: "cancel" },
        {
          text: "Slett",
          style: "destructive",
          onPress: () => deleteMutation.mutate(watch.id),
        },
      ]
    );
  };

  return (
    <Card className="mb-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 mr-3">
          <Text className="text-base font-semibold text-gray-900 dark:text-white">
            {watch.search_term}
          </Text>
          <View className="mt-1 flex-row items-center">
            {watch.max_price !== null ? (
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Maks pris: {watch.max_price.toFixed(2)} kr
              </Text>
            ) : (
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Ingen prisgrense
              </Text>
            )}
          </View>
          <View className="mt-1 flex-row items-center">
            <View
              className={`h-2 w-2 rounded-full mr-2 ${
                watch.is_active ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              {watch.is_active ? "Aktiv" : "Pauset"}
            </Text>
          </View>
        </View>
        <Button
          title="Slett"
          variant="danger"
          size="sm"
          onPress={handleDelete}
          loading={deleteMutation.isPending}
        />
      </View>
    </Card>
  );
}
