import { Stack } from 'expo-router';
import React from 'react';

export default function ScreensLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f5f5f5',
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="edit-ingredient"
        options={{
          title: 'Modifica Ingrediente', 
        }}
      />
      <Stack.Screen
        name="scanner"
        options={{
          title: 'Scanner',
          presentation: 'modal', 
        }}
      />
    </Stack>
  );
}