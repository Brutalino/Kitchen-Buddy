import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, ActivityIndicator, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
// --- NUOVI IMPORT PER LA NAVIGAZIONE ---
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

type ScannerNavigationProp = StackNavigationProp<RootStackParamList, 'Scanner'>;

export default function ScannerScreen() {
  const navigation = useNavigation<ScannerNavigationProp>();
  
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);
    setIsLoading(true);

    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${data}.json`);
      const json = await response.json();

      if (json.status === 1 && json.product) {
        const product = json.product;
        
        navigation.navigate('HomeTabs', { 
          screen: 'Add', // Specifichiamo la tab
          params: { // E i parametri per quella tab
          scannedName: product.product_name || '',
          scannedBrand: product.brands || '',
          }
        });
        
      } else {
        Alert.alert('Prodotto non trovato', `Il codice a barre ${data} non è nel database.`, [
          { text: 'OK', onPress: () => setScanned(false) }
        ]);
      }
    } catch (error) {
      Alert.alert('Errore', 'Impossibile connettersi al server.', [
        { text: 'OK', onPress: () => setScanned(false) }
      ]);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.infoText}>Abbiamo bisogno del tuo permesso per usare la fotocamera</Text>
        <Button onPress={requestPermission} title="Concedi Permesso" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "ean13", "ean8", "upc_a", "upc_e"],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.overlay}>
        <View style={styles.unfocusedContainer}></View>
        <View style={styles.middleContainer}>
          <View style={styles.unfocusedContainer}></View>
          <View style={styles.focusedContainer}></View>
          <View style={styles.unfocusedContainer}></View>
        </View>
        <View style={styles.unfocusedContainer}></View>
      </View>
      <View style={styles.overlay}>
        <Text style={styles.title}>Inquadra un codice a barre</Text>
        {isLoading && <ActivityIndicator size="large" color="#fff" />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  middleContainer: {
    flex: 0.8,
    flexDirection: 'row',
    borderRadius: 10,
  },
  focusedContainer: {
    flex: 8,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 10,
  },
  infoContainer: {
    position: 'absolute',
    top: '15%',
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  infoText: { textAlign: 'center', fontSize: 18, marginBottom: 20 },
});