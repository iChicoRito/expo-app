import { useEffect } from "react";

import { useProfileStore } from "@/contexts/profile-store";
import {
  cancelAllNotifications,
  getScheduledCount,
  requestPermission,
  scheduleNotifications,
  scheduleStreakNotifications,
} from "@/lib/notifications";
import { getEffectiveStreak } from "@/lib/streak";

const LOW_THRESHOLD = 5;

export function NotificationManager() {
  const { ready, notifications, name, setNotifications, streak } = useProfileStore();

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;

    if (notifications) {
      (async () => {
        const granted = await requestPermission();
        if (cancelled) return;
        if (!granted) {
          await setNotifications(false);
          return;
        }
        const count = await getScheduledCount();
        if (cancelled) return;
        if (count < LOW_THRESHOLD) {
          await scheduleNotifications(name);
          // Re-pin streak notifications — scheduleNotifications cancels all first.
          if (getEffectiveStreak(streak) > 0) {
            await scheduleStreakNotifications(name, streak.lastPlayAt).catch(() => {});
          }
        }
      })();
    } else {
      void cancelAllNotifications();
    }

    return () => {
      cancelled = true;
    };
  }, [ready, notifications, name, setNotifications, streak]);

  return null;
}
