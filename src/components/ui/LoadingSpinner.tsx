import { View, ActivityIndicator, Text } from "react-native";

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({
  message,
  fullScreen = true,
}: LoadingSpinnerProps) {
  return (
    <View
      className={`items-center justify-center ${fullScreen ? "flex-1" : "py-8"}`}
    >
      <ActivityIndicator size="large" color="#2563EB" />
      {message ? (
        <Text className="mt-3 text-gray-500 dark:text-gray-400">{message}</Text>
      ) : null}
    </View>
  );
}
