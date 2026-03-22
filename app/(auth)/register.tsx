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
import { Link, router } from "expo-router";
import { useAuthStore } from "../../src/stores/authStore";
import { registerSchema } from "../../src/lib/validation";

export default function RegisterScreen() {
  const signUp = useAuthStore((s) => s.signUp);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    setError("");
    setFieldErrors({});

    const result = registerSchema.safeParse({ email, password, confirmPassword });
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
      await signUp(email.trim(), password);
      setSuccess(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Noe gikk galt. Prøv igjen.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          Sjekk e-posten din
        </Text>
        <Text className="mt-4 text-center text-gray-500 dark:text-gray-400">
          Vi har sendt en bekreftelseslenke til {email}. Klikk på lenken for å
          aktivere kontoen din.
        </Text>
        <Pressable
          onPress={() => router.replace("/(auth)/login")}
          className="mt-8 items-center rounded-lg bg-primary px-6 py-3.5"
        >
          <Text className="font-semibold text-white">Gå til innlogging</Text>
        </Pressable>
      </View>
    );
  }

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
            Opprett konto
          </Text>
          <Text className="mt-2 text-gray-500 dark:text-gray-400">
            Kom i gang med Hverdagsagenten
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

        <View className="mb-4">
          <Text className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Passord
          </Text>
          <TextInput
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            placeholder="Minst 6 tegn"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="new-password"
          />
          {fieldErrors.password ? (
            <Text className="mt-1 text-sm text-red-600 dark:text-red-400">
              {fieldErrors.password}
            </Text>
          ) : null}
        </View>

        <View className="mb-6">
          <Text className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Bekreft passord
          </Text>
          <TextInput
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            placeholder="Gjenta passordet"
            placeholderTextColor="#9CA3AF"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoComplete="new-password"
          />
          {fieldErrors.confirmPassword ? (
            <Text className="mt-1 text-sm text-red-600 dark:text-red-400">
              {fieldErrors.confirmPassword}
            </Text>
          ) : null}
        </View>

        <Pressable
          onPress={handleRegister}
          disabled={loading}
          className="items-center rounded-lg bg-primary px-4 py-3.5"
          style={({ pressed }) => ({ opacity: pressed || loading ? 0.7 : 1 })}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-base font-semibold text-white">
              Opprett konto
            </Text>
          )}
        </Pressable>

        <View className="mt-6 flex-row items-center justify-center">
          <Text className="text-gray-500 dark:text-gray-400">
            Har du allerede konto?{" "}
          </Text>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text className="font-semibold text-primary">Logg inn</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
