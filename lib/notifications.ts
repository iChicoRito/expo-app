import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const MIN_GAP_MS = 6 * 60 * 60 * 1000;
const MAX_GAP_MS = 48 * 60 * 60 * 1000;
const NOTIFICATION_COUNT = 20;
const INITIAL_DELAY_MS = 2 * 60 * 60 * 1000;

const TEMPLATES = [
  {
    title: "Tea Check",
    body: "{name}, not you ghosting the tea. Open Spillr and pull a card.",
  },
  {
    title: "Group Chat Energy",
    body: "{name}, one random question could expose the whole group chat.",
  },
  {
    title: "Chaos Incoming",
    body: "Your next card is waiting, {name}, and it's giving chaos.",
  },
  {
    title: "One Card Only",
    body: "Social battery low, {name}? Same. Still, one card won't hurt.",
  },
  {
    title: "Don't Make It Awkward",
    body: "{name}, the deck has something to ask. Don't leave it hanging.",
  },
  {
    title: "Streak Check",
    body: "{name}, your streak is waiting. Pull a card before it disappears.",
  },
];

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestPermission(): Promise<boolean> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function getScheduledCount(): Promise<number> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  return scheduled.length;
}

export async function scheduleNotifications(name: string): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const displayName = name.trim() || "you";
  let cursor = Date.now() + INITIAL_DELAY_MS;

  for (let i = 0; i < NOTIFICATION_COUNT; i++) {
    const gap = MIN_GAP_MS + Math.random() * (MAX_GAP_MS - MIN_GAP_MS);
    cursor += gap;

    const template = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
    const body = template.body.replace(/{name}/g, displayName);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: template.title,
        body,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: new Date(cursor),
      },
    });
  }
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
