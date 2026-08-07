import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, TextInput, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { searchParts, getAllParts, Part } from '../repositories/partsRepository';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Part[]>([]);

  useEffect(() => {
    const run = async () => {
      if (query.trim() === '') {
        setResults(await getAllParts());
      } else {
        setResults(await searchParts(query.trim()));
      }
    };
    run();
  }, [query]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => router.back()} />
        <TextInput
          mode="outlined"
          placeholder="Search by part or car model"
          value={query}
          onChangeText={setQuery}
          autoFocus
          style={styles.input}
          dense
        />
      </View>

      <ScrollView contentContainerStyle={styles.results}>
        {results.length === 0 ? (
          <Text style={styles.emptyText}>No parts match "{query}"</Text>
        ) : (
          results.map((part) => (
            <Pressable
              key={part.id}
              onPress={() => router.push(`/part/${part.id}`)}
              style={styles.partRow}
            >
              <View style={styles.iconWrap}>
                <MaterialCommunityIcons name="car-wrench" size={20} color="#185FA5" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.partName}>{part.name}</Text>
                <Text style={styles.partSub}>{part.car_make_model}</Text>
              </View>
              <Text style={styles.qtyText}>x{part.quantity}</Text>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 30 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 },
  input: { flex: 1, marginRight: 8 },
  results: { padding: 16, paddingTop: 4 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 30, fontSize: 13 },
  partRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 0.5, borderColor: '#ddd', borderRadius: 8,
    padding: 10, marginBottom: 8,
  },
  iconWrap: {
    width: 38, height: 38, borderRadius: 8, backgroundColor: '#E6F1FB',
    justifyContent: 'center', alignItems: 'center',
  },
  partName: { fontSize: 13, fontWeight: '500' },
  partSub: { fontSize: 11, color: '#999', marginTop: 1 },
  qtyText: { fontSize: 12, color: '#666' },
});
