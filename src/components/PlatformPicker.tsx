import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
// Usiamo il nostro CustomPicker affidabile per iOS
import { CustomPicker } from './CustomPicker'; 

type Option = {
  label: string;
  value: string;
};

type PlatformPickerProps = {
  options: Option[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
};

export const PlatformPicker = (props: PlatformPickerProps) => {
  // Su Android, usiamo il Picker nativo che funziona
  if (Platform.OS === 'android') {
    return (
      <View style={styles.androidPickerWrapper}>
        <Picker
          selectedValue={props.selectedValue}
          onValueChange={(itemValue) => props.onValueChange(itemValue)}
        >
          {props.options.map((option) => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
      </View>
    );
  }

  // Su iOS, usiamo il nostro CustomPicker che è 100% affidabile.
  return <CustomPicker {...props} />;
};

const styles = StyleSheet.create({
  androidPickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});