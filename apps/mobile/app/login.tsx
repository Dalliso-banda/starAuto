import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useAuth } from "../context/AuthContext";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const { logIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);

  const emailValid = EMAIL_REGEX.test(email.trim());
  const passwordValid = password.length > 0;
  const emailError =
    touchedEmail && !emailValid ? "Enter a valid email address." : "";
  const passwordError =
    touchedPassword && !passwordValid ? "Enter your password." : "";
  const canSubmit = emailValid && passwordValid && !loading;

  const handleLogin = async () => {
    setTouchedEmail(true);
    setTouchedPassword(true);

    if (!email.trim()) {
      alert("Enter your email address.");
      return;
    }
    if (!emailValid) {
      alert("Enter a valid email address.");
      return;
    }
    if (!password) {
      alert("Enter your password.");
      return;
    }

    setLoading(true);
    try {
      await logIn(email, password);
      router.replace("/(tabs)/stock");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Text variant="headlineSmall" style={styles.title}>
          Welcome back
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Log in to your Star Auto account
        </Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          onBlur={() => setTouchedEmail(true)}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          error={!!emailError}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          onBlur={() => setTouchedPassword(true)}
          mode="outlined"
          secureTextEntry
          style={styles.input}
          error={!!passwordError}
        />
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          disabled={!canSubmit}
          style={styles.button}
        >
          Log in
        </Button>

        <Text style={styles.signupText}>
          No account yet?{" "}
          <Text
            style={styles.signupLink}
            onPress={() => router.push("/signup")}
          >
            Create one
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: { fontWeight: "500", marginBottom: 4 },
  subtitle: { color: "#666", marginBottom: 24 },
  input: { marginBottom: 14 },
  button: { marginTop: 8, paddingVertical: 4 },
  signupText: { marginTop: 20, textAlign: "center", color: "#666" },
  signupLink: { color: "#185FA5", fontWeight: "500" },
  errorText: {
    color: "#B00020",
    marginTop: -8,
    marginBottom: 10,
    fontSize: 12,
  },
});
