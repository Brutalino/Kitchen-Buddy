import { Stack } from 'expo-router';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { IngredientsProvider } from '../src/context/IngredientsContext';

export default function RootLayout() {
  return (
    <NavigationContainer>
      <IngredientsProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(screens)" options={{ headerShown: false }} />
        </Stack>
      </IngredientsProvider>
    </NavigationContainer>
  );
}