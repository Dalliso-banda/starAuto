import { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, IconButton, Avatar } from 'react-native-paper';
import { useFocusEffect, router } from 'expo-router';
import { getAllParts, Part } from '../repositories/partsRepository';
import { getAllSales, Sale } from '../repositories/salesRepository';

export default function SalesScreen() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [parts, setParts] = useState<Part[]>([]);

  const loadData = useCallback(async () => {
    const [salesData, partsData] = await Promise.all([getAllSales(), getAllParts()]);
    setSales(salesData);
    setParts(partsData);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const totalRevenue = sales.reduce((sum, s) => sum + s.quantity_sold * s.sale_price, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => router.back()} />
        <Text style={styles.title}>Sales history</Text>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Total sales</Text>
          <Text style={styles.summaryValue}>{sales.length}</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Revenue</Text>
          <Text style={styles.summaryValue}>K {totalRevenue.toFixed(2)}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {sales.length === 0 ? (
          <Text style={styles.emptyText}>No sales recorded yet.</Text>
        ) : (
          sales.map((sale) => {
            const part = parts.find((p) => p.id === sale.part_id);
            return (
              <View key={sale.id} style={styles.row}>
                <Avatar.Icon size={36} icon="cart" style={styles.icon} color="#1976D2" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.partName}>{part?.name ?? 'Deleted part'}</Text>
                  <Text style={styles.saleSub}>
                    {sale.quantity_sold} sold · K {(sale.quantity_sold * sale.sale_price).toFixed(2)}
                  </Text>
                </View>
                <Text style={styles.date}>
                  {new Date(sale.sold_at).toLocaleDateString()}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 30 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 },
  title: { fontSize: 17, fontWeight: '500' },
  summaryRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginTop: 8, marginBottom: 8 },
  summaryBox: { flex: 1, backgroundColor: '#F1EFE8', borderRadius: 10, padding: 12 },
  summaryLabel: { fontSize: 12, color: '#666' },
  summaryValue: { fontSize: 20, fontWeight: '500', marginTop: 4 },
  list: { padding: 16, paddingTop: 4 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 30, fontSize: 13 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 0.5, borderColor: '#ddd', borderRadius: 8,
    padding: 10, marginBottom: 8,
  },
  icon: { backgroundColor: '#E3F2FD' },
  partName: { fontSize: 13, fontWeight: '500' },
  saleSub: { fontSize: 11, color: '#999', marginTop: 1 },
  date: { fontSize: 11, color: '#999' },
});
