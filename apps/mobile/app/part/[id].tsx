import { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Text, IconButton, Button, Modal, Portal, TextInput } from 'react-native-paper';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import { getPartById, Part } from '../../repositories/partsRepository';
import { recordSale } from '../../repositories/salesRepository';

export default function PartDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [part, setPart] = useState<Part | null>(null);
  const [saleModalVisible, setSaleModalVisible] = useState(false);
  const [saleQty, setSaleQty] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [saving, setSaving] = useState(false);

  const loadPart = useCallback(async () => {
    if (id) {
      const data = await getPartById(id);
      setPart(data);
      if (data) setSalePrice(String(data.price));
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      loadPart();
    }, [loadPart])
  );

  const openSaleModal = () => {
    setSaleQty('');
    setSaleModalVisible(true);
  };

  const handleRecordSale = async () => {
    if (!part) return;
    const qty = parseInt(saleQty, 10);
    const price = parseFloat(salePrice);

    if (!qty || qty <= 0) {
      alert('Enter a valid quantity.');
      return;
    }

    setSaving(true);
    try {
      await recordSale({ partId: part.id, quantitySold: qty, salePrice: price || 0 });
      setSaleModalVisible(false);
      await loadPart();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!part) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => router.back()} />
      </View>

      {part.photo_uri ? (
        <Image source={{ uri: part.photo_uri }} style={styles.photo} />
      ) : (
        <View style={[styles.photo, styles.photoPlaceholder]}>
          <Text style={{ color: '#999' }}>No photo</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.name}>{part.name}</Text>
        <Text style={styles.carModel}>{part.car_make_model}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Quantity</Text>
            <Text style={styles.statValue}>{part.quantity}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Price</Text>
            <Text style={styles.statValue}>K {part.price.toFixed(2)}</Text>
          </View>
        </View>

        <Button
          mode="contained"
          onPress={openSaleModal}
          disabled={part.quantity === 0}
          style={styles.sellButton}
        >
          {part.quantity === 0 ? 'Out of stock' : 'Record sale'}
        </Button>

        <Text style={styles.addedDate}>Added {new Date(part.created_at).toLocaleDateString()}</Text>
      </View>

      <Portal>
        <Modal
          visible={saleModalVisible}
          onDismiss={() => setSaleModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalTitle}>Record sale</Text>
          <Text style={styles.modalSubtitle}>{part.quantity} in stock</Text>

          <TextInput
            label="Quantity sold"
            value={saleQty}
            onChangeText={setSaleQty}
            mode="outlined"
            keyboardType="number-pad"
            style={styles.modalInput}
          />
          <TextInput
            label="Sale price per unit (ZMW)"
            value={salePrice}
            onChangeText={setSalePrice}
            mode="outlined"
            keyboardType="decimal-pad"
            style={styles.modalInput}
          />

          <Button mode="contained" onPress={handleRecordSale} loading={saving} disabled={saving}>
            Confirm sale
          </Button>
        </Modal>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingTop: 30 },
  photo: { width: '100%', height: 260, backgroundColor: '#eee' },
  photoPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20 },
  name: { fontSize: 20, fontWeight: '500' },
  carModel: { fontSize: 14, color: '#666', marginTop: 4, marginBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statBox: { flex: 1, backgroundColor: '#F1EFE8', borderRadius: 10, padding: 14 },
  statLabel: { fontSize: 12, color: '#666' },
  statValue: { fontSize: 20, fontWeight: '500', marginTop: 4 },
  sellButton: { marginBottom: 16 },
  addedDate: { fontSize: 12, color: '#999' },
  modal: { backgroundColor: '#fff', margin: 24, padding: 20, borderRadius: 12 },
  modalTitle: { fontSize: 16, fontWeight: '500' },
  modalSubtitle: { fontSize: 12, color: '#666', marginBottom: 16 },
  modalInput: { marginBottom: 12 },
});
