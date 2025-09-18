import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';

import { useIngredients } from '../../src/context/IngredientsContext';
import { Ingredient, RipenessStatus} from '../../src/types';

type FilterType = 'recent' | 'missing_data' | 'by_location' | 'by_category' | 'check_ripeness';

const ripenessLabels: { [key in RipenessStatus]: string } = {
  green: 'Verde',
  ripe: 'Maturo',
  advanced: 'Avanzato',
  too_ripe: 'Troppo Maturo',
};

const IngredientListItem = ({ item }: { item: Ingredient }) => {
  const handlePress = () => {
    router.push({
      pathname: "/(screens)/edit-ingredient",
      params: { ingredientId: item.id }
    });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.itemContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDetails}>
          {item.location || 'N/D'} - {item.category || 'N/D'}
        </Text>
        {item.ripeness && (
          <Text style={styles.ripenessText}>
            Maturazione: {ripenessLabels[item.ripeness.status]}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function BrowseScreen() {
  const { ingredients } = useIngredients();
  const [activeFilter, setActiveFilter] = useState<FilterType>('recent');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    let data;
    switch (activeFilter) {
      case 'missing_data':
        data = ingredients.filter(
          (item) => !item.category || !item.location || !item.confectionType || !item.expirationDate
        );
        break;
      case 'by_location':
        data = [...ingredients].sort((a, b) => (a.location || '').localeCompare(b.location || ''));
        break;
      case 'by_category':
        data = [...ingredients].sort((a, b) => (a.category || '').localeCompare(b.category || ''));
        break;
      
      case 'check_ripeness': { 
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        data = ingredients.filter(item => 
          item.ripeness && 
          new Date(item.ripeness.lastChecked) < threeDaysAgo
        );
        break;
      }
      case 'recent':
      default:
        data = [...ingredients].sort((a, b) => 
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
    }

    if (!searchQuery.trim()) {
      return data;
    }

    return data.filter(ingredient =>
      ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [ingredients, activeFilter, searchQuery]);

  const renderListHeader = () => {
    let title = "Tutti gli IngredientI";
    if(activeFilter === 'recent') title = "Aggiunti di Recente";
    if(activeFilter === 'missing_data') title = "Con Dati Mancanti";
    if(activeFilter === 'by_location') title = "Ordinati per Posizione";
    if(activeFilter === 'by_category') title = "Ordinati per Categoria";
    if(activeFilter === 'check_ripeness') title = "Controllo Maturazione Scaduto";

    
    return <Text style={styles.header}>{title}</Text>;
  }

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
            style={[styles.filterButton, activeFilter === 'recent' && styles.filterButtonActive]}
            onPress={() => setActiveFilter('recent')}
          >
            <Text style={[styles.filterButtonText, activeFilter === 'recent' && styles.filterButtonTextActive]}>Recenti</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'by_location' && styles.filterButtonActive]}
            onPress={() => setActiveFilter('by_location')}
          >
            <Text style={[styles.filterButtonText, activeFilter === 'by_location' && styles.filterButtonTextActive]}>Posizione</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'by_category' && styles.filterButtonActive]}
            onPress={() => setActiveFilter('by_category')}
          >
            <Text style={[styles.filterButtonText, activeFilter === 'by_category' && styles.filterButtonTextActive]}>Categoria</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'missing_data' && styles.filterButtonActive]}
            onPress={() => setActiveFilter('missing_data')}
          >
            <Text style={[styles.filterButtonText, activeFilter === 'missing_data' && styles.filterButtonTextActive]}>Dati Mancanti</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'check_ripeness' && styles.filterButtonActive]}
            onPress={() => setActiveFilter('check_ripeness')}
          >
            <Text style={[styles.filterButtonText, activeFilter === 'check_ripeness' && styles.filterButtonTextActive]}>
              Da Controllare
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredData}
        renderItem={({ item }) => <IngredientListItem item={item} />}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderListHeader}
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
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    margin: 4,
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
  itemName: { fontSize: 18, fontWeight: '500' },
  itemDetails: { fontSize: 14, color: '#666', marginTop: 4 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: 'gray' },
  ripenessText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#6a0dad',
    marginTop: 4,
  }
});