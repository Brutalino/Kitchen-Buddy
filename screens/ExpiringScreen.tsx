import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useIngredients } from '../src/context/IngredientsContext';
import { Ingredient } from '../src/types';

const ExpiringItem = ({ item }: { item: Ingredient }) => {
  const isExpired = item.expirationDate ? new Date(item.expirationDate) < new Date() : false;
  
  let remainingText = 'Nessuna data di scadenza';
  if (item.expirationDate) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const expiryDate = new Date(item.expirationDate); expiryDate.setHours(0, 0, 0, 0);
    const daysRemaining = Math.round((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    remainingText = `Scade tra ${daysRemaining} giorni`;
    if (daysRemaining === 0) remainingText = 'Scade oggi';
    if (daysRemaining === 1) remainingText = 'Scade domani';
    if (isExpired) remainingText = 'Scaduto!';
  }

  const handlePress = () => {
    router.push({ pathname: "/(screens)/edit-ingredient", params: { ingredientId: item.id } });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.itemContainer}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{item.name}</Text>
          {/* Mostriamo un'icona se il prodotto è aperto */}
          {item.isOpen && <FontAwesome6 name="box-open" size={24} color="red" />}
        </View>
        <Text style={[styles.itemDetails, isExpired && styles.expiredText]}>
          {remainingText} {item.expirationDate ? `(${new Date(item.expirationDate).toLocaleDateString('it-IT')})` : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default function ExpiringScreen() {
  const { ingredients } = useIngredients();
  const [daysThreshold, setDaysThreshold] = useState(7);
  const [searchQuery, setSearchQuery] = useState('');

  const expiringSoonItems = useMemo(() => {
    const now = new Date();
    const limitDate = new Date();
    limitDate.setDate(now.getDate() + daysThreshold);

    const itemsToShow = ingredients.filter(item => {
      // Condizione 1: L'ingrediente è aperto?
      const isFrozen = item.confectionType === 'frozen';
      const isOpen = item.isOpen === true;

      // Condizione 2: L'ingrediente ha una data di scadenza imminente?
      const isExpiringSoon = item.expirationDate && 
                             new Date(item.expirationDate) >= now && 
                             new Date(item.expirationDate) <= limitDate;

      const isRipe = item.ripeness?.status === 'ripe';
      // Restituiamo true se ALMENO UNA delle due condizioni è vera
      if (isFrozen) {
        return isExpiringSoon; // Se è congelato, lo mostriamo SOLO SE sta per scadere.
      } else {
        return isOpen || isExpiringSoon || isRipe; // Altrimenti, lo mostriamo se è aperto O sta per scadere.
      }
    });

    const sortedItems = itemsToShow.sort((a, b) => {
      const dateA = a.expirationDate ? new Date(a.expirationDate).getTime() : Infinity;
      const dateB = b.expirationDate ? new Date(b.expirationDate).getTime() : Infinity;
      return dateA - dateB;
    });

    if (!searchQuery.trim()) {
      return sortedItems;
    }
    
    return sortedItems.filter(ingredient =>
      ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [ingredients, daysThreshold, searchQuery]);

  return (
    <View style={styles.container}>
      <View style={styles.controlsContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cerca ingrediente per nome..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="always"
        />
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, daysThreshold === 3 && styles.filterButtonActive]}
            onPress={() => setDaysThreshold(3)}
          >
            <Text style={[styles.filterButtonText, daysThreshold === 3 && styles.filterButtonTextActive]}>Entro 3 Giorni</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, daysThreshold === 7 && styles.filterButtonActive]}
            onPress={() => setDaysThreshold(7)}
          >
            <Text style={[styles.filterButtonText, daysThreshold === 7 && styles.filterButtonTextActive]}>Entro 7 Giorni</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, daysThreshold === 30 && styles.filterButtonActive]}
            onPress={() => setDaysThreshold(30)}
          >
            <Text style={[styles.filterButtonText, daysThreshold === 30 && styles.filterButtonTextActive]}>Entro 30 Giorni</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={expiringSoonItems}
        renderItem={({ item }) => <ExpiringItem item={item} />}
        keyExtractor={item => item.id}
        ListHeaderComponent={<Text style={styles.header}>In Scadenza e Aperti</Text>}
        ListEmptyComponent={<Text style={styles.emptyText}>Nessun ingrediente trovato.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { fontSize: 22, fontWeight: 'bold', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10, backgroundColor: '#fff' },
  controlsContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 10,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 4,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    color: '#000',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  itemContainer: { backgroundColor: '#fff', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemName: { fontSize: 18, fontWeight: '500' , flex: 1},
  itemDetails: { fontSize: 14, color: '#666', marginTop: 4 },
  expiredText: { color: 'red', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: 'gray' },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
});