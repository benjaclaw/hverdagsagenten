import { View, Text, Image } from "react-native";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import type { KassalProduct } from "../../../services/priceService";

interface KassalSearchResultProps {
  product: KassalProduct;
  onAddWatch: (searchTerm: string, maxPrice: number | null) => void;
}

export function KassalSearchResult({
  product,
  onAddWatch,
}: KassalSearchResultProps) {
  const price = product.current_price?.price ?? null;
  const storeName = product.store?.name ?? "Ukjent butikk";

  return (
    <Card className="mb-3">
      <View className="flex-row">
        {product.image ? (
          <Image
            source={{ uri: product.image }}
            className="h-16 w-16 rounded-lg mr-3"
            resizeMode="contain"
          />
        ) : (
          <View className="h-16 w-16 rounded-lg bg-gray-200 dark:bg-gray-700 items-center justify-center mr-3">
            <Text className="text-xs text-gray-400">Ingen</Text>
          </View>
        )}
        <View className="flex-1">
          <Text
            className="text-sm font-semibold text-gray-900 dark:text-white"
            numberOfLines={2}
          >
            {product.name}
          </Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400">
            {storeName}
          </Text>
          {price !== null ? (
            <Text className="mt-1 text-base font-bold text-primary">
              {price.toFixed(2)} kr
            </Text>
          ) : null}
        </View>
        <View className="justify-center">
          <Button
            title="Overvåk"
            size="sm"
            onPress={() => onAddWatch(product.name, price)}
          />
        </View>
      </View>
    </Card>
  );
}
