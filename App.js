import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ExpoRoot } from 'expo-router';

export default function App() {
  const context = require.context('./app');

  return (
    <NavigationContainer>
      <ExpoRoot context={context} />
    </NavigationContainer>
  );
}