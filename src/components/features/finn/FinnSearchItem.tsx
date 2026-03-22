import { View, Text, Alert } from "react-native";
import { router } from "expo-router";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import {
  useDeleteFinnSearch,
  useToggleFinnSearch,
} from "../../../hooks/useFinnSearches";
import type { FinnSearch } from "../../../types";

interface FinnSearchItemProps {
  search: FinnSearch;
}

export function FinnSearchItem({ search }: FinnSearchItemProps) {
  const deleteMutation = useDeleteFinnSearch();
  const toggleMutation = useToggleFinnSearch();

  const handleDelete = () => {
    Alert.alert("Slett søk", `Er du sikker på at du vil slette "${search.name}"?`, [
      { text: "Avbryt", style: "cancel" },
      {
        text: "Slett",
        style: "destructive",
        onPress: () => deleteMutation.mutate(search.id),
      },
    ]);
  };

  const handleToggle = () => {
    toggleMutation.mutate({ id: search.id, isActive: !search.is_active });
  };

  const handlePress = () => {
    router.push({
      pathname: "/finn-results/[id]",
      params: { id: search.id, name: search.name },
    });
  };

  return (
    <Card onPress={handlePress} className="mb-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 mr-3">
          <Text className="text-base font-semibold text-gray-900 dark:text-white">
            {search.name}
          </Text>
          <Text
            className="mt-1 text-sm text-gray-500 dark:text-gray-400"
            numberOfLines={1}
          >
            {search.url}
          </Text>
          <View className="mt-2 flex-row items-center">
            <View
              className={`h-2 w-2 rounded-full mr-2 ${
                search.is_active ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              {search.is_active ? "Aktiv" : "Pauset"}
            </Text>
          </View>
        </View>
        <View className="flex-row gap-2">
          <Button
            title={search.is_active ? "Pause" : "Aktiver"}
            variant="ghost"
            size="sm"
            onPress={handleToggle}
            loading={toggleMutation.isPending}
          />
          <Button
            title="Slett"
            variant="danger"
            size="sm"
            onPress={handleDelete}
            loading={deleteMutation.isPending}
          />
        </View>
      </View>
    </Card>
  );
}
