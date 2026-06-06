import { useEffect } from "react";

import { useProfileStore } from "@/contexts/profile-store";
import {
  cancelAllNotifications,
  getScheduledCount,
  requestPermission,
  scheduleNotifications,
} from "@/lib/notifications";

const LOW_THRESHOLD = 5;

export function NotificationManager() {
  const { ready, notifications, name, setNotifications } = useProfileStore();

  useEffect(() => {
    if (!ready) return;

    if (notifications) {
      (async () => {
        const granted = await requestPermission();
        if (!granted) {
          await setNotifications(false);
          return;
        }
        const count = await getScheduledCount();
        if (count < LOW_THRESHOLD) {
          await scheduleNotifications(name);
        }
      })();
    } else {
      cancelAllNotifications();
    }
  }, [ready, notifications, name, setNotifications]);

  return null;
}
