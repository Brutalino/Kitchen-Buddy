import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text, TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../App';

import { PlatformPicker } from '../src/components/PlatformPicker';
import { useIngredients } from '../src/context/IngredientsContext';
import { ConfectionType, Ingredient, IngredientCategory, IngredientLocation, RipenessStatus } from '../src/types';

type EditScreenRouteProp = RouteProp<RootStackParamList, 'EditIngredient'>;

const categoryOptions = [ { label: 'Frutta', value: 'fruit' }, { label: 'Verdura', value: 'vegetable' }, { label: 'Latticini', value: 'dairy' }, { label: 'Pesce', value: 'fish' }, { label: 'Carne', value: 'meat' }, { label: 'Liquidi', value: 'liquid' }, { label: 'Altro', value: 'other' }];
const locationOptions = [ { label: 'Frigorifero', value: 'fridge' }, { label: 'Congelatore', value: 'freezer' }, { label: 'Dispensa', value: 'pantry' }, { label: 'Altro', value: 'other' }];
const confectionOptions = [ { label: 'Fresco', value: 'fresh' }, { label: 'In Scatola', value: 'canned' }, { label: 'Surgelato', value: 'frozen' }, { label: 'Stagionato/Curato', value: 'cured' }, { label: 'Altro', value: 'other' }];

const ripenessOptions = [
  { label: 'Verde', value: 'green' },
  { label: 'Maturo', value: 'ripe' },
  { label: 'Avanzato', value: 'advanced' },
  { label: 'Troppo Maturo', value: 'too_ripe' },
];

export default function EditIngredientScreen() {
  const navigation = useNavigation();
  const route = useRoute<EditScreenRouteProp>();
  const { ingredientId } = route.params; // Leggiamo i parametri da 'route'

  const { ingredients, updateIngredient } = useIngredients();
  
  const ingredientToEdit = ingredients.find(ing => ing.id === ingredientId);

  // Stati del modulo
  const [name, setName] = useState('');
  const [brand, setBrand] = useState(''); 
  const [category, setCategory] = useState<IngredientCategory>('other');
  const [location, setLocation] = useState<IngredientLocation>('other');
  const [confectionType, setConfectionType] = useState<ConfectionType>('other');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false); 
  const [ripeness, setRipeness] = useState<Ingredient['ripeness']>(undefined);

  useEffect(() => {
    if (ingredientToEdit) {
      setName(ingredientToEdit.name);
      setBrand(ingredientToEdit.brand || '');
      setCategory(ingredientToEdit.category || 'other');
      setLocation(ingredientToEdit.location || 'other');
      setConfectionType(ingredientToEdit.confectionType || 'other');
      setIsOpen(ingredientToEdit.isOpen);
      setRipeness(ingredientToEdit.ripeness);

      if (ingredientToEdit.expirationDate) {
        setDate(new Date(ingredientToEdit.expirationDate));
      }
    }
  }, [ingredientToEdit]);

  const handleUpdateIngredient = () => {
    if (!ingredientToEdit) { Alert.alert('Errore', 'Ingrediente non trovato.'); return; }
    if (!name.trim()) { Alert.alert('Errore', 'Il nome è obbligatorio.'); return; }

    const updatedIngredient: Ingredient = {
      ...ingredientToEdit,
      name: name.trim(),
      brand: brand.trim(),
      category: category,
      location: location,
      confectionType: confectionType,
      isOpen: isOpen,
      expirationDate: date,
      ripeness: confectionType === 'fresh' ? ripeness : undefined,
    };

    updateIngredient(updatedIngredient);
    Alert.alert('Successo', 'Ingrediente aggiornato!');
    navigation.goBack();
  };

  const handleFreezeIngredient = () => {
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
    const currentExpiryDate = date ? new Date(date) : new Date(0);
    const newExpiryDate = new Date(Math.max(currentExpiryDate.getTime(), sixMonthsFromNow.getTime()));

    setConfectionType('frozen');
    setLocation('freezer'); 
    setDate(newExpiryDate);

    Alert.alert(
      'Ingrediente Congelato!',
      `Il tipo è stato impostato su "Surgelato" e la scadenza è stata estesa al ${newExpiryDate.toLocaleDateString('it-IT')}. Salva per confermare.`
    );
  };

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

  if (!ingredientToEdit) {
    return (
      <View style={styles.container}>
        <Text>Ingrediente non trovato!</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingContainer}
    >
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.label}>Nome Ingrediente *</Text>
          <TextInput style={styles.input} placeholder="Es. Pomodori" value={name} onChangeText={setName} />
          
          <Text style={styles.label}>Marca (Opzionale)</Text>
          <TextInput style={styles.input} value={brand} onChangeText={setBrand} />

          <Text style={styles.label}>Categoria</Text>
          <PlatformPicker options={categoryOptions} selectedValue={category} onValueChange={(value) => setCategory(value as IngredientCategory)} />
          
          <Text style={styles.label}>Posizione</Text>
          <PlatformPicker options={locationOptions} selectedValue={location} onValueChange={(value) => setLocation(value as IngredientLocation)} />

          <Text style={styles.label}>Tipo di Confezione</Text>
          <PlatformPicker options={confectionOptions} selectedValue={confectionType} onValueChange={(value) => setConfectionType(value as ConfectionType)} />

          <View style={styles.actionButtonsContainer}>
            {/* Pulsante visibile solo se l'ingrediente non è già congelato */}
            {confectionType !== 'frozen' && (
              <Button title="❄️ Congela" onPress={handleFreezeIngredient} color="#007AFF" />
            )}
            <View style={styles.mainButtonWrapper}>
              <Button title="Salva Modifiche" onPress={handleUpdateIngredient} />
            </View>
          </View>

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

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Prodotto Aperto?</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isOpen ? "#f5dd4b" : "#f4f3f4"}
              onValueChange={setIsOpen}
              value={isOpen}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button title="Salva Modifiche" onPress={handleUpdateIngredient} />
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingVertical: 10,
  },
   actionButtonsContainer: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainButtonWrapper: {
    flex: 1,
    marginLeft: 10,
  },
});