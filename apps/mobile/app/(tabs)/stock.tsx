import { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, router } from 'expo-router';
import { getAllParts, Part } from '../../repositories/partsRepository';

export default function StockScreen() {
  const [parts, setParts] = useState<Part[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadParts = useCallback(async () => {
    const data = await getAllParts();
    setParts(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadParts();
    }, [loadParts])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadParts();
    setRefreshing(false);
  };

  const totalInStock = parts.reduce((sum, p) => sum + p.quantity, 0);
  const lowStock = parts.filter((p) => p.quantity > 0 && p.quantity <= 2);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good afternoon</Text>
          <Text style={styles.shopName}>Star Auto</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>In stock</Text>
          <Text style={styles.statValue}>{totalInStock}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Parts listed</Text>
          <Text style={styles.statValue}>{parts.length}</Text>
        </View>
      </View>

      {lowStock.length > 0 && (
        <View style={styles.warningBanner}>
          <MaterialCommunityIcons name="alert" size={18} color="#854F0B" />
          <Text style={styles.warningText}>
            {lowStock.length} part{lowStock.length > 1 ? 's' : ''} running low
          </Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Recent parts</Text>

      {parts.length === 0 ? (
        <Text style={styles.emptyText}>No parts added yet. Tap "Add part" to get started.</Text>
      ) : (
        parts.map((part) => (
          <Pressable key={part.id} onPress={() => router.push(`/part/${part.id}`)} style={styles.partRow}>
            <View style={styles.iconWrap}>
              <MaterialCommunityIcons name="car-wrench" size={20} color="#185FA5" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.partName}>{part.name}</Text>
              <Text style={styles.partSub}>{part.car_make_model}</Text>
            </View>
            <View style={[styles.qtyBadge, part.quantity <= 2 && styles.qtyBadgeLow]}>
              <Text style={[styles.qtyText, part.quantity <= 2 && styles.qtyTextLow]}>
                x{part.quantity}
              </Text>
            </View>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 40 },
  header: { marginBottom: 16 },
  greeting: { fontSize: 12, color: '#666' },
  shopName: { fontSize: 18, fontWeight: '500' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  statCard: { flex: 1, backgroundColor: '#F1EFE8', borderRadius: 10, padding: 12 },
  statLabel: { fontSize: 12, color: '#666' },
  statValue: { fontSize: 22, fontWeight: '500', marginTop: 4 },
  warningBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FAEEDA', borderRadius: 8, padding: 10, marginBottom: 14,
  },
  warningText: { fontSize: 13, color: '#854F0B' },
  sectionTitle: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  emptyText: { fontSize: 13, color: '#666', textAlign: 'center', marginTop: 20 },
  partRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#ddd',
    borderRadius: 8, padding: 10, marginBottom: 8,
  },
  iconWrap: {
    width: 38, height: 38, borderRadius: 8, backgroundColor: '#E6F1FB',
    justifyContent: 'center', alignItems: 'center',
  },
  partName: { fontSize: 13, fontWeight: '500' },
  partSub: { fontSize: 11, color: '#999', marginTop: 1 },
  qtyBadge: { backgroundColor: '#EAF3DE', borderRadius: 100, paddingHorizontal: 8, paddingVertical: 3 },
  qtyBadgeLow: { backgroundColor: '#FCEBEB' },
  qtyText: { fontSize: 11, color: '#3B6D11' },
  qtyTextLow: { color: '#A32D2D' },
});
