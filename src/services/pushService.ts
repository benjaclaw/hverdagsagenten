import { Platform } from "react-native";
import Constants from "expo-constants";

let notificationsConfigured = false;

async function configureNotifications() {
  if (notificationsConfigured) return;
  try {
    const Notifications = await import("expo-notifications");
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    notificationsConfigured = true;
  } catch {
    console.warn("expo-notifications not available");
  }
}

export async function registerForPushNotifications(): Promise<string | null> {
  try {
    const Device = await import("expo-device");
    if (!Device.isDevice) return null;

    await configureNotifications();
    const Notifications = await import("expo-notifications");

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") return null;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#2563EB",
      });
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    return token;
  } catch (error) {
    console.warn("Push registration failed:", error);
    return null;
  }
}

export async function savePushToken(token: string): Promise<void> {
  try {
    const { supabase } = await import("../lib/supabase");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("push_tokens")
      .upsert({ user_id: user.id, token }, { onConflict: "user_id,token" });
  } catch (error) {
    console.warn("Save push token failed:", error);
  }
}
