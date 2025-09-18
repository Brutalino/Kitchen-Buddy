// app/_layout.tsx

import React from 'react';
import { Tabs, Stack } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { IngredientsProvider } from '../src/context/IngredientsContext';

export default function RootLayout() {
  return (
    // Il provider rimane il contenitore più esterno per lo stato
    <IngredientsProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#f5f5f' },
          headerTintColor: '#000',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        {/*
          Definiamo il nostro Tab Navigator come una schermata DELLO Stack principale.
          Questo crea la struttura gerarchica corretta.
        */}
        <Stack.Screen
          name="(tabs)"
          options={{
            // Nascondiamo l'header dello Stack per questa schermata,
            // così le Tabs possono mostrare i loro titoli.
            headerShown: false,
          }}
        />
        
        {/*
          Definiamo la nostra schermata di modifica come un'altra schermata dello Stack.
          Expo Router è abbastanza intelligente da capire che i file dentro /app/(screens)
          appartengono a questo gruppo.
        */}
        <Stack.Screen
          name="(screens)/edit-ingredient"
          options={{
            title: 'Modifica Ingrediente',
            presentation: 'modal',
          }}
        />

        {/* E definiamo anche lo scanner qui */}
        <Stack.Screen
          name="(screens)/scanner"
          options={{
            title: 'Scanner',
            presentation: 'modal',
          }}
        />
      </Stack>
    </IngredientsProvider>
  );
}