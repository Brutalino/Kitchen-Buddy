import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen
        name="add"
        options={{ title: 'Aggiungi', tabBarIcon: ({ color }) => <FontAwesome size={28} name="plus-square" color={color} /> }}
      />
      <Tabs.Screen
        name="expiring"
        options={{ title: 'In Scadenza', tabBarIcon: ({ color }) => <FontAwesome size={28} name="bell" color={color} /> }}
      />
      <Tabs.Screen
        name="browse"
        options={{ title: 'Cerca', tabBarIcon: ({ color }) => <FontAwesome size={28} name="search" color={color} /> }}
      />
    </Tabs>
  );
}