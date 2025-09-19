import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import { createBottomTabNavigator, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { NavigatorScreenParams } from '@react-navigation/native';

import { IngredientsProvider } from './src/context/IngredientsContext';

// Importiamo le nostre schermate con i percorsi corretti
import AddIngredientScreen from './app/(tabs)/add';
import ExpiringScreen from './app/(tabs)/expiring';
import BrowseScreen from './app/(tabs)/browse';
import EditIngredientScreen from './app/(screens)/edit-ingredient';
import ScannerScreen from './app/(screens)/scanner';

// --- DEFINIZIONE DEI TIPI PER LA NAVIGAZIONE (FONDAMENTALE) ---

// Parametri che il Tab Navigator può ricevere (solo la tab 'Add' ne riceve)
export type HomeTabParamList = {
  Add: { scannedName?: string; scannedBrand?: string } | undefined; // Permettiamo anche undefined
  Expiring: undefined;
  Browse: undefined;
};

// Parametri che lo Stack Navigator principale può ricevere
export type RootStackParamList = {
  HomeTabs: NavigatorScreenParams<HomeTabParamList>;
  EditIngredient: { ingredientId: string };
  Scanner: undefined;
};

// Esportiamo i tipi per le props delle schermate, così le possiamo usare nei file figli
export type RootStackScreenProps<T extends keyof RootStackParamList> = StackScreenProps<RootStackParamList, T>;
export type HomeTabScreenProps<T extends keyof HomeTabParamList> = BottomTabScreenProps<HomeTabParamList, T>;


// Creiamo i navigatori
const Tab = createBottomTabNavigator<HomeTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

// Componente che definisce le nostre schede
function HomeTabs() {
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: 'blue', headerShown: true }}>
      <Tab.Screen
        name="Add"
        component={AddIngredientScreen}
        options={{ title: 'Aggiungi', tabBarIcon: ({ color }) => <FontAwesome size={28} name="plus-square" color={color} /> }}
        // Inizializziamo i parametri per la prima volta
        initialParams={{ scannedName: '', scannedBrand: ''}}
      />
      <Tab.Screen
        name="Expiring"
        component={ExpiringScreen}
        options={{ title: 'In Scadenza', tabBarIcon: ({ color }) => <FontAwesome size={28} name="bell" color={color} /> }}
      />
      <Tab.Screen
        name="Browse"
        component={BrowseScreen}
        options={{ title: 'Cerca', tabBarIcon: ({ color }) => <FontAwesome size={28} name="search" color={color} /> }}
      />
    </Tab.Navigator>
  );
}

// Componente App principale
export default function App() {
  return (
    <IngredientsProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {/* La prima schermata è il nostro intero gruppo di Tabs */}
          <Stack.Screen
            name="HomeTabs" // Usiamo un nome più descrittivo
            component={HomeTabs}
            options={{ headerShown: false }}
          />
          {/* Le altre schermate vengono definite qui */}
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