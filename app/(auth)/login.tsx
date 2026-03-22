import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import { useAuthStore } from "../../src/stores/authStore";
import { loginSchema } from "../../src/lib/validation";

export default function LoginScreen() {
  const signIn = useAuthStore((s) => s.signIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setFieldErrors({});

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0]?.toString() ?? "general";
        errors[key] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Noe gikk galt. Prøv igjen.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        contentContainerClassName="flex-1 justify-center px-6"
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 dark:text-white">
            Hverdagsagenten
          </Text>
          <Text className="mt-2 text-gray-500 dark:text-gray-400">
            Logg inn for å fortsette
          </Text>
        </View>

        {error ? (
          <View className="mb-4 rounded-lg bg-red-100 p-3 dark:bg-red-900/30">
            <Text className="text-red-700 dark:text-red-400">{error}</Text>
          </View>
        ) : null}

        <View className="mb-4">
          <Text className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            E-post
          </Text>
          <TextInput
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            placeholder="din@epost.no"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          {fieldErrors.email ? (
            <Text className="mt-1 text-sm text-red-600 dark:text-red-400">
              {fieldErrors.email}
            </Text>
          ) : null}
        </View>

        <View className="mb-6">
          <Text className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Passord
          </Text>
          <TextInput
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            placeholder="••••••••"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
          />
          {fieldErrors.password ? (
            <Text className="mt-1 text-sm text-red-600 dark:text-red-400">
              {fieldErrors.password}
            </Text>
          ) : null}
        </View>

        <Pressable
          onPress={handleLogin}
          disabled={loading}
          className="items-center rounded-lg bg-primary px-4 py-3.5"
          style={({ pressed }) => ({ opacity: pressed || loading ? 0.7 : 1 })}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-base font-semibold text-white">Logg inn</Text>
          )}
        </Pressable>

        <View className="mt-6 flex-row items-center justify-center">
          <Text className="text-gray-500 dark:text-gray-400">
            Har du ikke konto?{" "}
          </Text>
          <Link href="/(auth)/register" asChild>
            <Pressable>
              <Text className="font-semibold text-primary">Registrer deg</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
