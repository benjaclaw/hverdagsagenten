import { useState } from "react";
import { View, FlatList, Pressable, Text } from "react-native";
import { useFinnSearches } from "../../src/hooks/useFinnSearches";
import { FinnSearchItem } from "../../src/components/features/finn/FinnSearchItem";
import { CreateFinnSearchForm } from "../../src/components/features/finn/CreateFinnSearchForm";
import { EmptyState, LoadingSpinner } from "../../src/components/ui";
import { Feather } from "@expo/vector-icons";

export default function FinnScreen() {
  const [showForm, setShowForm] = useState(false);
  const { data: searches, isLoading, error, refetch } = useFinnSearches();

  if (isLoading) {
    return <LoadingSpinner message="Laster søk..." />;
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-red-600 dark:text-red-400 text-center">
          Kunne ikke laste søk: {error.message}
        </Text>
        <Pressable onPress={() => refetch()} className="mt-4">
          <Text className="text-primary font-semibold">Prøv igjen</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-bg-light dark:bg-bg-dark">
      {showForm ? (
        <CreateFinnSearchForm onSuccess={() => setShowForm(false)} />
      ) : null}

      {!showForm ? (
        <View className="px-4 pt-4">
          <Pressable
            onPress={() => setShowForm(true)}
            className="flex-row items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 py-3"
          >
            <Feather name="plus" size={20} color="#2563EB" />
            <Text className="ml-2 font-semibold text-primary">
              Nytt Finn-søk
            </Text>
          </Pressable>
        </View>
      ) : null}

      {searches && searches.length > 0 ? (
        <FlatList
          data={searches}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <FinnSearchItem search={item} />}
          contentContainerClassName="px-4 pt-4 pb-8"
          onRefresh={() => refetch()}
          refreshing={isLoading}
        />
      ) : (
        <EmptyState
          icon="search"
          title="Ingen søk ennå"
          description="Opprett et nytt Finn-søk for å overvåke annonser"
        />
      )}
    </View>
  );
}
