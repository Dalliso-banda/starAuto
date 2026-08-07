import { useState } from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { router } from 'expo-router';
import { createPart } from '../../repositories/partsRepository';

export default function AddPartScreen() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [carModel, setCarModel] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [saving, setSaving] = useState(false);

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert('Camera access is needed to photograph the part.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.6,
      allowsEditing: true,
    });

    if (result.canceled) return;

    const cacheUri = result.assets[0].uri;
    const filename = cacheUri.split('/').pop();
    const dir = `${FileSystem.documentDirectory}parts/`;
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    const permanentUri = `${dir}${filename}`;
    await FileSystem.copyAsync({ from: cacheUri, to: permanentUri });

    setPhotoUri(permanentUri);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Give the part a name first.');
      return;
    }
    setSaving(true);
    try {
      await createPart({
        name: name.trim(),
        carModel: carModel.trim(),
        photoUri,
        quantity: parseInt(quantity, 10) || 0,
        price: parseFloat(price) || 0,
      });

      setPhotoUri(null);
      setName('');
      setCarModel('');
      setQuantity('');
      setPrice('');

      router.push('/(tabs)/stock');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>Add part</Text>

      <TouchableOpacity style={styles.photoBox} onPress={takePhoto}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.photo} />
        ) : (
          <>
            <MaterialCommunityIcons name="camera" size={28} color="#666" />
            <Text style={styles.photoText}>Tap to capture part photo</Text>
          </>
        )}
      </TouchableOpacity>

      <TextInput label="Part name" value={name} onChangeText={setName} mode="outlined" placeholder="e.g. Brake pad set" style={styles.input} />
      <TextInput label="Car make and model" value={carModel} onChangeText={setCarModel} mode="outlined" placeholder="e.g. Toyota Corolla 2014" style={styles.input} />

      <View style={styles.row}>
        <TextInput label="Quantity" value={quantity} onChangeText={setQuantity} mode="outlined" keyboardType="number-pad" style={[styles.input, styles.halfInput]} />
        <TextInput label="Price (ZMW)" value={price} onChangeText={setPrice} mode="outlined" keyboardType="decimal-pad" style={[styles.input, styles.halfInput]} />
      </View>

      <Button mode="contained" onPress={handleSave} loading={saving} disabled={saving} style={styles.button}>
        Save to stock
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 40 },
  title: { fontWeight: '500', marginBottom: 20 },
  photoBox: {
    height: 160, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', borderColor: '#999',
    justifyContent: 'center', alignItems: 'center', marginBottom: 16, overflow: 'hidden',
  },
  photo: { width: '100%', height: '100%' },
  photoText: { marginTop: 6, color: '#666', fontSize: 12 },
  input: { marginBottom: 12 },
  row: { flexDirection: 'row', gap: 10 },
  halfInput: { flex: 1 },
  button: { marginTop: 8, paddingVertical: 4 },
});
