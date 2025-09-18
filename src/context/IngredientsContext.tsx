import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ingredient } from '../types';

const STORAGE_KEY = '@KitchenBuddy:ingredients';

export type IngredientFormData = Omit<Ingredient, 'id' | 'dateAdded' | 'isOpen' >;

interface IngredientsContextType {
  ingredients: Ingredient[];
  addIngredient: (ingredientData: IngredientFormData) => void; 
  updateIngredient: (updatedIngredient: Ingredient) => void;
}

const IngredientsContext = createContext<IngredientsContextType | undefined>(undefined);

export const IngredientsProvider = ({ children }: { children: ReactNode }) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadIngredients = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (jsonValue !== null) {
          const loadedIngredients: Ingredient[] = JSON.parse(jsonValue);
          setIngredients(loadedIngredients);
        }
      } catch (e) {
        console.error("Failed to load ingredients from storage", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadIngredients();
  }, []); 

  useEffect(() => {
    if (!isLoading) {
      const saveIngredients = async () => {
        try {
          const jsonValue = JSON.stringify(ingredients);
          await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
        } catch (e) {
          console.error("Failed to save ingredients to storage", e);
        }
      };

      saveIngredients();
    }
  }, [ingredients, isLoading]); // La dipendenza [ingredients, isLoading] significa: "esegui questo effetto quando 'ingredients' o 'isLoading' cambiano"


  const addIngredient = (ingredientData: IngredientFormData) => {
    const newIngredient: Ingredient = {
      ...ingredientData,
      id: new Date().getTime().toString(),
      dateAdded: new Date(),
      isOpen: false,
    };
    
    setIngredients(prevIngredients => [...prevIngredients, newIngredient]);
  };

  const updateIngredient = (updatedIngredient: Ingredient) => {
    setIngredients(prevIngredients => 
      prevIngredients.map(ingredient => 
        ingredient.id === updatedIngredient.id ? updatedIngredient : ingredient
      )
    );
  };

  return (
    <IngredientsContext.Provider value={{ ingredients, addIngredient, updateIngredient }}>
      {children}
    </IngredientsContext.Provider>
  );
};

export const useIngredients = () => {
  const context = useContext(IngredientsContext);
  if (context === undefined) {
    throw new Error('useIngredients must be used within a IngredientsProvider');
  }
  return context;
};