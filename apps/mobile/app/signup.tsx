import { useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [shopName, setShopName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      await signUp(fullName, shopName, email, password);
      router.replace('/(tabs)/stock');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text variant="headlineSmall" style={styles.title}>Create account</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>Set up access for your shop</Text>

        <TextInput label="Full name" value={fullName} onChangeText={setFullName} mode="outlined" style={styles.input} />
        <TextInput label="Shop name" value={shopName} onChangeText={setShopName} mode="outlined" style={styles.input} />
        <TextInput label="Email" value={email} onChangeText={setEmail} mode="outlined" keyboardType="email-address" autoCapitalize="none" style={styles.input} />
        <TextInput label="Password" value={password} onChangeText={setPassword} mode="outlined" secureTextEntry style={styles.input} />

        <Button mode="contained" onPress={handleSignUp} loading={loading} disabled={loading} style={styles.button}>
          Create account
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 60 },
  title: { fontWeight: '500', marginBottom: 4 },
  subtitle: { color: '#666', marginBottom: 24 },
  input: { marginBottom: 14 },
  button: { marginTop: 8, paddingVertical: 4 },
});
