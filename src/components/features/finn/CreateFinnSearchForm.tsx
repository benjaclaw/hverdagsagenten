import { useState } from "react";
import { View, Alert } from "react-native";
import { Button, Input } from "../../ui";
import { useCreateFinnSearch } from "../../../hooks/useFinnSearches";
import { finnSearchSchema } from "../../../lib/finnValidation";

interface CreateFinnSearchFormProps {
  onSuccess?: () => void;
}

export function CreateFinnSearchForm({ onSuccess }: CreateFinnSearchFormProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const mutation = useCreateFinnSearch();

  const handleSubmit = () => {
    setFieldErrors({});

    const result = finnSearchSchema.safeParse({ name, url });
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0]?.toString() ?? "general";
        errors[key] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    mutation.mutate(
      { name: name.trim(), url: url.trim() },
      {
        onSuccess: () => {
          setName("");
          setUrl("");
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
      <Input
        label="Navn på søk"
        placeholder="F.eks. Sofa under 5000kr"
        value={name}
        onChangeText={setName}
        error={fieldErrors.name}
      />
      <Input
        label="Finn.no URL"
        placeholder="https://www.finn.no/bap/forsale/search.html?..."
        value={url}
        onChangeText={setUrl}
        autoCapitalize="none"
        keyboardType="url"
        error={fieldErrors.url}
      />
      <Button
        title="Opprett søk"
        onPress={handleSubmit}
        loading={mutation.isPending}
      />
    </View>
  );
}
