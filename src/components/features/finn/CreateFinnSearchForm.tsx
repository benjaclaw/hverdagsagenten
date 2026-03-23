import { useState } from "react";
import { View, Alert, Text, Pressable, TextInput } from "react-native";
import { Button } from "../../ui";
import { useCreateFinnSearch } from "../../../hooks/useFinnSearches";
import {
  finnSearchSchema,
  FINN_CATEGORIES,
  buildFinnUrl,
  type FinnCategory,
} from "../../../lib/finnValidation";

interface CreateFinnSearchFormProps {
  onSuccess?: () => void;
}

export function CreateFinnSearchForm({ onSuccess }: CreateFinnSearchFormProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<FinnCategory>("torget");
  const [query, setQuery] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const mutation = useCreateFinnSearch();

  const handleSubmit = () => {
    setFieldErrors({});

    const parsed = finnSearchSchema.safeParse({
      name,
      category,
      query,
      priceFrom: priceFrom ? Number(priceFrom) : null,
      priceTo: priceTo ? Number(priceTo) : null,
    });

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0]?.toString() ?? "general";
        errors[key] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    const url = buildFinnUrl({
      category,
      query: query.trim(),
      priceFrom: priceFrom ? Number(priceFrom) : null,
      priceTo: priceTo ? Number(priceTo) : null,
    });

    mutation.mutate(
      { name: name.trim(), url },
      {
        onSuccess: () => {
          setName("");
          setQuery("");
          setPriceFrom("");
          setPriceTo("");
          setCategory("torget");
          onSuccess?.();
        },
        onError: (error) => {
          Alert.alert("Feil", error.message);
        },
      }
    );
  };

  return (
    <View className="p-4">
      {/* Navn */}
      <View className="mb-3">
        <Text className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          Navn på søk
        </Text>
        <TextInput
          className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          placeholder="F.eks. Sofa under 5000kr"
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={setName}
        />
        {fieldErrors.name ? (
          <Text className="mt-1 text-xs text-red-500">{fieldErrors.name}</Text>
        ) : null}
      </View>

      {/* Kategori */}
      <View className="mb-3">
        <Text className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          Kategori
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {FINN_CATEGORIES.map((cat) => (
            <Pressable
              key={cat.value}
              onPress={() => setCategory(cat.value)}
              className={`rounded-full px-4 py-2 ${
                category === cat.value
                  ? "bg-primary"
                  : "bg-gray-100 dark:bg-gray-700"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  category === cat.value
                    ? "text-white"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </View>
        {fieldErrors.category ? (
          <Text className="mt-1 text-xs text-red-500">
            {fieldErrors.category}
          </Text>
        ) : null}
      </View>

      {/* Søkeord */}
      <View className="mb-3">
        <Text className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          Søkeord
        </Text>
        <TextInput
          className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          placeholder="F.eks. sofa, sykkel, iPhone..."
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
        />
        {fieldErrors.query ? (
          <Text className="mt-1 text-xs text-red-500">
            {fieldErrors.query}
          </Text>
        ) : null}
      </View>

      {/* Prisområde */}
      <View className="mb-4 flex-row gap-3">
        <View className="flex-1">
          <Text className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Min. pris
          </Text>
          <TextInput
            className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            placeholder="Valgfritt"
            placeholderTextColor="#9CA3AF"
            value={priceFrom}
            onChangeText={setPriceFrom}
            keyboardType="numeric"
          />
        </View>
        <View className="flex-1">
          <Text className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Maks pris
          </Text>
          <TextInput
            className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            placeholder="Valgfritt"
            placeholderTextColor="#9CA3AF"
            value={priceTo}
            onChangeText={setPriceTo}
            keyboardType="numeric"
          />
        </View>
      </View>

      <Button
        title="Opprett søk"
        onPress={handleSubmit}
        loading={mutation.isPending}
      />
    </View>
  );
}
