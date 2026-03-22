import { View, Pressable, type ViewProps } from "react-native";

interface CardProps extends ViewProps {
  onPress?: () => void;
  children: React.ReactNode;
}

export function Card({ onPress, children, className = "", ...props }: CardProps) {
  const baseStyles = `rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`;

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={baseStyles}
        style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
        {...props}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View className={baseStyles} {...props}>
      {children}
    </View>
  );
}
