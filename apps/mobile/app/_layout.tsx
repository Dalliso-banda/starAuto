import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { theme } from '../theme';
import { initSchema } from '../db/schema';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  useEffect(() => {
    initSchema();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="part/[id]" />
        </Stack>
      </AuthProvider>
    </PaperProvider>
  );
}
