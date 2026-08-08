import { Stack } from "expo-router";
import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import { AuthProvider } from "../context/AuthContext";
import { initSchema } from "../db/schema";
import { theme } from "../theme";

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
          <Stack.Screen name="sales" />
        </Stack>
      </AuthProvider>
    </PaperProvider>
  );
}
