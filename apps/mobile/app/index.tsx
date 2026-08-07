import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function LandingScreen() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name="car" size={36} color="#fff" />
      </View>

      <Text variant="headlineMedium" style={styles.title}>Star Auto</Text>
      <Text variant="bodyMedium" style={styles.tagline}>
        Track parts, stock and sales in one place
      </Text>

      <Button
        mode="contained-tonal"
        onPress={() => router.push('/signup')}
        style={styles.button}
        labelStyle={{ fontWeight: '500' }}
      >
        Get started
      </Button>

      <Text style={styles.loginText}>
        Already have an account?{' '}
        <Text style={styles.loginLink} onPress={() => router.push('/login')}>
          Log in
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  iconWrap: {
    width: 64, height: 64, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 18,
  },
  title: { color: '#fff', fontWeight: '500', marginBottom: 6 },
  tagline: { color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginBottom: 28 },
  button: { width: '100%', marginBottom: 12 },
  loginText: { color: 'rgba(255,255,255,0.85)', fontSize: 13 },
  loginLink: { color: '#fff', fontWeight: '500' },
});