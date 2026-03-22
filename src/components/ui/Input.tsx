import { View, Text, TextInput, type TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <View className="mb-4">
      {label ? (
        <Text className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </Text>
      ) : null}
      <TextInput
        className={`rounded-lg border bg-white px-4 py-3 text-gray-900 dark:bg-gray-800 dark:text-white ${
          error
            ? "border-red-500 dark:border-red-400"
            : "border-gray-300 dark:border-gray-600"
        }`}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error ? (
        <Text className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
