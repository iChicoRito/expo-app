import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

import { USER_NAME_KEY } from "@/constants/storage";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    SecureStore.getItemAsync(USER_NAME_KEY)
      .then((savedName) => {
        if (savedName && savedName.trim().length > 0) {
          router.replace({ pathname: "/play", params: { name: savedName.trim() } });
        } else {
          router.replace("/onboarding");
        }
      })
      .catch(() => {
        router.replace("/onboarding");
      });
  }, []);

  return <View style={styles.blank} />;
}

const styles = StyleSheet.create({
  blank: { flex: 1, backgroundColor: "#ffffff" },
});
