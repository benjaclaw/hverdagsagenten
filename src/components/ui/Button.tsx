import { Pressable, Text, ActivityIndicator } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

const variantStyles = {
  primary: "bg-primary",
  secondary: "bg-gray-200 dark:bg-gray-700",
  danger: "bg-red-600",
  ghost: "bg-transparent",
};

const variantTextStyles = {
  primary: "text-white",
  secondary: "text-gray-900 dark:text-white",
  danger: "text-white",
  ghost: "text-primary",
};

const sizeStyles = {
  sm: "px-3 py-2",
  md: "px-4 py-3",
  lg: "px-6 py-4",
};

const sizeTextStyles = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  size = "md",
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`items-center rounded-lg ${variantStyles[variant]} ${sizeStyles[size]}`}
      style={({ pressed }) => ({
        opacity: pressed || isDisabled ? 0.6 : 1,
      })}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "secondary" || variant === "ghost" ? "#2563EB" : "#FFFFFF"}
        />
      ) : (
        <Text
          className={`font-semibold ${variantTextStyles[variant]} ${sizeTextStyles[size]}`}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}
