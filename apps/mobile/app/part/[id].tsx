import { useEffect, useState } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { getPartById, Part } from '../../repositories/partsRepository';

export default function PartDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [part, setPart] = useState<Part | null>(null);

  useEffect(() => {
    if (id) getPartById(id).then(setPart);
  }, [id]);

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

        <Text style={styles.addedDate}>Added {new Date(part.created_at).toLocaleDateString()}</Text>
      </View>
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
  addedDate: { fontSize: 12, color: '#999' },
});
