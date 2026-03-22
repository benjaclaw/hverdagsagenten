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
import { supabase } from "../../src/lib/supabase";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReset = async () => {
    setError("");

    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setError("Skriv inn en gyldig e-postadresse");
      return;
    }

    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        trimmed
      );
      if (resetError) throw resetError;
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
          Vi har sendt en lenke for å tilbakestille passordet til {email.trim()}.
        </Text>
        <Link href="/(auth)/login" asChild>
          <Pressable className="mt-8 items-center rounded-lg bg-primary px-6 py-3.5">
            <Text className="font-semibold text-white">
              Tilbake til innlogging
            </Text>
          </Pressable>
        </Link>
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
            Glemt passord
          </Text>
          <Text className="mt-2 text-gray-500 dark:text-gray-400">
            Skriv inn e-posten din, så sender vi en tilbakestillingslenke
          </Text>
        </View>

        {error ? (
          <View className="mb-4 rounded-lg bg-red-100 p-3 dark:bg-red-900/30">
            <Text className="text-red-700 dark:text-red-400">{error}</Text>
          </View>
        ) : null}

        <View className="mb-6">
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
        </View>

        <Pressable
          onPress={handleReset}
          disabled={loading}
          className="items-center rounded-lg bg-primary px-4 py-3.5"
          style={({ pressed }) => ({ opacity: pressed || loading ? 0.7 : 1 })}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-base font-semibold text-white">
              Send tilbakestillingslenke
            </Text>
          )}
        </Pressable>

        <View className="mt-6 flex-row items-center justify-center">
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text className="font-semibold text-primary">
                Tilbake til innlogging
              </Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
