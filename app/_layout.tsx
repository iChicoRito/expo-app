import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { DeckStoreProvider } from '@/contexts/deck-store';
import { ProfileStoreProvider } from '@/contexts/profile-store';

export default function RootLayout() {
  return (
    <DeckStoreProvider>
      <ProfileStoreProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="play" options={{ headerShown: false }} />
          <Stack.Screen name="preparation" options={{ headerShown: false }} />
          <Stack.Screen name="game" options={{ headerShown: false }} />
          <Stack.Screen name="results" options={{ headerShown: false }} />
          <Stack.Screen name="decks" options={{ headerShown: false }} />
          <Stack.Screen name="questions" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen name="play-history" options={{ headerShown: false }} />
          <Stack.Screen name="decks-cards" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ProfileStoreProvider>
    </DeckStoreProvider>
  );
}
