import { Slot } from 'expo-router';
import React from 'react';
import { IngredientsProvider } from '../src/context/IngredientsContext';

export default function RootLayout() {
  return (
    <IngredientsProvider>
      <Slot />
    </IngredientsProvider>
  );
}