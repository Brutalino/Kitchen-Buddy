import { Stack } from 'expo-router';
import React from 'react';
import { IngredientsProvider } from '../src/context/IngredientsContext';

export default function RootLayout() {
  return (
    // Spostiamo il Provider qui, al livello più alto possibile
    <IngredientsProvider>
      <Stack>
        {/* Questa rotta si riferisce al nostro gruppo di schede (Tabs) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Questa rotta si riferisce al nostro gruppo di schermate (Stack) */}
        <Stack.Screen name="(screens)" options={{ headerShown: false }} />
      </Stack>
    </IngredientsProvider>
  );
}