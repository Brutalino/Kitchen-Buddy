// app/(tabs)/add.tsx --- VERSIONE FINALE, STABILE E FUNZIONANTE

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView,
  KeyboardAvoidingView, Platform, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router'; 

// Usiamo il nostro PlatformPicker stabile
import { PlatformPicker } from '../../src/components/PlatformPicker'; 
import { useIngredients } from '../../src/context/IngredientsContext';
import { Ingredient, IngredientCategory, IngredientLocation, ConfectionType, RipenessStatus } from '../../src/types';

const categoryOptions = [ { label: 'Frutta', value: 'fruit' }, { label: 'Verdura', value: 'vegetable' }, { label: 'Latticini', value: 'dairy' }, { label: 'Pesce', value: 'fish' }, { label: 'Carne', value: 'meat' }, { label: 'Liquidi', value: 'liquid' }, { label: 'Altro', value: 'other' }];
const locationOptions = [ { label: 'Frigorifero', value: 'fridge' }, { label: 'Congelatore', value: 'freezer' }, { label: 'Dispensa', value: 'pantry' }, { label: 'Altro', value: 'other' }];
const confectionOptions = [ { label: 'Fresco', value: 'fresh' }, { label: 'In Scatola', value: 'canned' }, { label: 'Surgelato', value: 'frozen' }, { label: 'Stagionato/Curato', value: 'cured' }, { label: 'Altro', value: 'other' }];

const ripenessOptions = [
  { label: 'Verde', value: 'green' },
  { label: 'Maturo', value: 'ripe' },
  { label: 'Avanzato', value: 'advanced' },
  { label: 'Troppo Maturo', value: 'too_ripe' },
];

export default function AddIngredientScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ scannedName?: string; scannedBrand?: string }>();
  const { addIngredient } = useIngredients();
  
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<IngredientCategory>('other');
  const [location, setLocation] = useState<IngredientLocation>('other');
  const [confectionType, setConfectionType] = useState<ConfectionType>('other');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [ripeness, setRipeness] = useState<Ingredient['ripeness']>(undefined);

  useEffect(() => {
    if (params.scannedName && !name) {
      setName(params.scannedName);
    }
    if (params.scannedBrand && !brand) {
      setBrand(params.scannedBrand);
    }
  }, [params.scannedName, params.scannedBrand]);

  const handleOpenDatePicker = () => {
    setTempDate(date || new Date());
    setDatePickerVisible(true);
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setDatePickerVisible(false);
      if (event.type === 'set' && selectedDate) { setDate(selectedDate); }
    } else {
      if(selectedDate) { setTempDate(selectedDate); }
    }
  };

  const handleConfirmDateIOS = () => { setDate(tempDate); setDatePickerVisible(false); };
  const handleCancelDateIOS = () => { setDatePickerVisible(false); };
  
  const handleAddIngredient = () => {
    if (!name.trim()) { Alert.alert('Errore', "Il nome dell'ingrediente è obbligatorio."); return; }
    addIngredient({ name: name.trim(), brand: brand.trim(), category, location, confectionType, expirationDate: date, ripeness: confectionType === 'fresh' ? ripeness : undefined, });
    Alert.alert('Successo', `"${name.trim()}" è stato aggiunto!`);
    setName(''); setBrand(''); setCategory('other'); setLocation('other'); setConfectionType('other'); setDate(undefined); setRipeness(undefined);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingContainer}
    >
      <ScrollView>
        <View style={styles.container}>
           <View style={styles.scannerButtonContainer}>
            <Button
              title="📷  Scansiona Codice a Barre"
              onPress={() => router.push('/(screens)/scanner')}
            />
          </View>
          <Text style={styles.label}>Nome Ingrediente *</Text>
          <TextInput style={styles.input} placeholder="Es. Pomodori" value={name} onChangeText={setName} />
          
          <Text style={styles.label}>Marca (Opzionale)</Text>
          <TextInput style={styles.input} placeholder="Es. Mutti" value={brand} onChangeText={setBrand} />

          <Text style={styles.label}>Categoria</Text>
          <PlatformPicker options={categoryOptions} selectedValue={category} onValueChange={(value) => setCategory(value as IngredientCategory)} />
          
          <Text style={styles.label}>Posizione</Text>
          <PlatformPicker options={locationOptions} selectedValue={location} onValueChange={(value) => setLocation(value as IngredientLocation)} />

          <Text style={styles.label}>Tipo di Confezione</Text>
          <PlatformPicker options={confectionOptions} selectedValue={confectionType} onValueChange={(value) => setConfectionType(value as ConfectionType)} />

          {confectionType === 'fresh' && (
            <>
              <Text style={styles.label}>Stato di Maturazione</Text>
              <PlatformPicker
                options={ripenessOptions}
                selectedValue={ripeness?.status || 'ripe'}
                onValueChange={(newStatus) => {
                  setRipeness({
                    status: newStatus as RipenessStatus,
                    lastChecked: new Date(),
                  });
                }}
              />
            </>
          )}

          <Text style={styles.label}>Data di Scadenza</Text>
          <TouchableOpacity style={styles.datePickerButton} onPress={handleOpenDatePicker}>
            <Text style={styles.datePickerText}>{date ? date.toLocaleDateString('it-IT') : 'Seleziona una data'}</Text>
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <Button title="Aggiungi Ingrediente" onPress={handleAddIngredient} />
          </View>
        </View>
      </ScrollView>

      {/* Modal per DatePicker */}
      {Platform.OS === 'android' && isDatePickerVisible && (
        <DateTimePicker value={date || new Date()} mode="date" display="default" onChange={handleDateChange} />
      )}
      {Platform.OS === 'ios' && (
        <Modal transparent={true} animationType="slide" visible={isDatePickerVisible} onRequestClose={handleCancelDateIOS}>
          <View style={styles.modalOverlay}>
            <SafeAreaView style={styles.modalContent}>
              <DateTimePicker value={tempDate} mode="date" display="spinner" onChange={handleDateChange} locale="it-IT" themeVariant="light"/>
              <View style={styles.modalButtonContainer}>
                <Button title="Annulla" onPress={handleCancelDateIOS} />
                <Button title="Conferma" onPress={handleConfirmDateIOS} />
              </View>
            </SafeAreaView>
          </View>
        </Modal>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingContainer: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, marginTop: 15 },
  input: { borderWidth: 1, borderColor: '#ccc', paddingHorizontal: 10, borderRadius: 5, fontSize: 16, height: 55 },
  datePickerButton: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, height: 55, justifyContent: 'center', paddingHorizontal: 10 },
  datePickerText: { fontSize: 16 },
  buttonContainer: { marginTop: 30 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { backgroundColor: 'white', paddingBottom: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  modalButtonContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#eee' },
  scannerButtonContainer: {
    marginBottom: 20, 
  },
});