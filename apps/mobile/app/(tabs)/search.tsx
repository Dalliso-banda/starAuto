import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text, TextInput, useTheme } from 'react-native-paper';
import { useState } from 'react';

export default function SearchPartsScreen() {
  const theme = useTheme();
  const [query, setQuery] = useState('');

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <Text variant="headlineLarge" style={styles.header}>
        Search Parts
      </Text>

      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            label="Search by name or SKU"
            value={query}
            onChangeText={setQuery}
            style={styles.input}
          />
          <Button mode="contained" style={styles.button} onPress={() => {}}>
            Search
          </Button>
        </Card.Content>
      </Card>

      <View style={styles.infoBox}>
        <Text>
          Enter a part name or SKU to find matching inventory items. 
          </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
  },
  header: {
    marginTop: 16,
    marginBottom: 18,
  },
  card: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 10,
  },
  infoBox: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
});
