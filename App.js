import 'react-native-gesture-handler';
import { ExpoRoot } from "expo-router";
import Head from "expo-router/head";
import React from 'react';
import { IngredientsProvider } from './src/context/IngredientsContext';

export default function App() {
  const context = require.context("./app");

  return (
    <IngredientsProvider>
      <Head.Provider>
        <ExpoRoot context={context} />
      </Head.Provider>
    </IngredientsProvider>
  );
}