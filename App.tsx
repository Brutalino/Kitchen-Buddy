import FontAwesome from '@expo/vector-icons/FontAwesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import React from 'react';
import 'react-native-gesture-handler';

import { IngredientsProvider } from './src/context/IngredientsContext';

// Import delle schermate
import AddIngredientScreen from './screens/AddIngredientScreen';
import EditIngredientScreen from './screens/EditIngredientScreen';
import ExpiringScreen from './screens/ExpiringScreen';
import ScannerScreen from './screens/ScannerScreen';
import BrowseScreen from '/screens/BrowseScreen';

// Definizione dei tipi
export type HomeTabParamList = {
  Add: { scannedName?: string; scannedBrand?: string } | undefined;
  Expiring: undefined;
  Browse: undefined;
};

export type RootStackParamList = {
  HomeTabs: NavigatorScreenParams<HomeTabParamList>;
  EditIngredient: { ingredientId: string };
  Scanner: undefined;
};

const Tab = createBottomTabNavigator<HomeTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

function HomeTabs() {
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: 'blue', headerShown: true }}>
      <Tab.Screen
        name="Add"
        component={AddIngredientScreen}
        options={{ 
          title: 'Aggiungi', 
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="plus-square" color={color} /> 
        }}
        initialParams={{ scannedName: '', scannedBrand: '' }}
      />
      <Tab.Screen
        name="Expiring"
        component={ExpiringScreen}
        options={{ 
          title: 'In Scadenza', 
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="bell" color={color} /> 
        }}
      />
      <Tab.Screen
        name="Browse"
        component={BrowseScreen}
        options={{ 
          title: 'Cerca', 
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="search" color={color} /> 
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <IngredientsProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="HomeTabs"
            component={HomeTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditIngredient"
            component={EditIngredientScreen}
            options={{ title: 'Modifica Ingrediente' }}
          />
          <Stack.Screen
            name="Scanner"
            component={ScannerScreen}
            options={{ title: 'Scanner', presentation: 'modal' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </IngredientsProvider>
  );
}