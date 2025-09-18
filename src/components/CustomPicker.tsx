import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Button,
} from 'react-native';


type Option = {
  label: string;
  value: string;
};

type CustomPickerProps = {
  options: Option[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
};

export const CustomPicker = ({
  options,
  selectedValue,
  onValueChange,
  placeholder = 'Seleziona un\'opzione',
}: CustomPickerProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find(option => option.value === selectedValue);

  const handleSelect = (value: string) => {
    onValueChange(value);
    setModalVisible(false);
  };

  return (
    <>
      {/* Questo è il pulsante visibile nella schermata del modulo */}
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.pickerButtonText}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
      </TouchableOpacity>

      {/* Questo è il modal che appare quando si preme il pulsante */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* La lista delle opzioni */}
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => handleSelect(item.value)}
              >
                <Text style={styles.optionText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
          {/* Il pulsante per chiudere il modal senza scegliere */}
          <Button title="Annulla" onPress={() => setModalVisible(false)} />
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  pickerButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    height: 55,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  pickerButtonText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    marginTop: 20,
  },
  optionItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 18,
    textAlign: 'center',
  },
});