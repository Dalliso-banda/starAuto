import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { logIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await logIn(email, password);
      router.replace('/(tabs)/stock');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <Text variant="headlineSmall" style={styles.title}>Welcome back</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>Log in to your Star Auto account</Text>

        <TextInput label="Email" value={email} onChangeText={setEmail} mode="outlined" keyboardType="email-address" autoCapitalize="none" style={styles.input} />
        <TextInput label="Password" value={password} onChangeText={setPassword} mode="outlined" secureTextEntry style={styles.input} />

        <Button mode="contained" onPress={handleLogin} loading={loading} disabled={loading} style={styles.button}>
          Log in
        </Button>

        <Text style={styles.signupText}>
          No account yet?{' '}
          <Text style={styles.signupLink} onPress={() => router.push('/signup')}>
            Create one
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontWeight: '500', marginBottom: 4 },
  subtitle: { color: '#666', marginBottom: 24 },
  input: { marginBottom: 14 },
  button: { marginTop: 8, paddingVertical: 4 },
  signupText: { marginTop: 20, textAlign: 'center', color: '#666' },
  signupLink: { color: '#185FA5', fontWeight: '500' },
});
