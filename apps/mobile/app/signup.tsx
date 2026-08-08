import { router } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useAuth } from "../context/AuthContext";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [shopName, setShopName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [touchedFullName, setTouchedFullName] = useState(false);
  const [touchedShopName, setTouchedShopName] = useState(false);
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);

  const fullNameValid = fullName.trim().length >= 2;
  const shopNameValid = shopName.trim().length >= 2;
  const emailValid = EMAIL_REGEX.test(email.trim());
  const passwordValid = password.length >= 6;

  const fullNameError =
    touchedFullName && !fullNameValid ? "Enter your full name." : "";
  const shopNameError =
    touchedShopName && !shopNameValid ? "Enter your shop name." : "";
  const emailError =
    touchedEmail && !emailValid ? "Enter a valid email address." : "";
  const passwordError =
    touchedPassword && !passwordValid
      ? "Password should be at least 6 characters."
      : "";

  const canSubmit =
    fullNameValid && shopNameValid && emailValid && passwordValid && !loading;

  const handleSignUp = async () => {
    setTouchedFullName(true);
    setTouchedShopName(true);
    setTouchedEmail(true);
    setTouchedPassword(true);

    if (!fullName.trim()) {
      alert("Enter your full name.");
      return;
    }
    if (!shopName.trim()) {
      alert("Enter your shop name.");
      return;
    }
    if (!email.trim() || !emailValid) {
      alert("Enter a valid email address.");
      return;
    }
    if (!passwordValid) {
      alert("Password should be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await signUp(fullName, shopName, email, password);
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
      <ScrollView contentContainerStyle={styles.container}>
        <Text variant="headlineSmall" style={styles.title}>
          Create account
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Set up access for your shop
        </Text>

        <TextInput
          label="Full name"
          value={fullName}
          onChangeText={setFullName}
          onBlur={() => setTouchedFullName(true)}
          mode="outlined"
          style={styles.input}
          error={!!fullNameError}
        />
        {fullNameError ? (
          <Text style={styles.errorText}>{fullNameError}</Text>
        ) : null}

        <TextInput
          label="Shop name"
          value={shopName}
          onChangeText={setShopName}
          onBlur={() => setTouchedShopName(true)}
          mode="outlined"
          style={styles.input}
          error={!!shopNameError}
        />
        {shopNameError ? (
          <Text style={styles.errorText}>{shopNameError}</Text>
        ) : null}

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
          onPress={handleSignUp}
          loading={loading}
          disabled={!canSubmit}
          style={styles.button}
        >
          Create account
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 60 },
  title: { fontWeight: "500", marginBottom: 4 },
  subtitle: { color: "#666", marginBottom: 24 },
  input: { marginBottom: 14 },
  button: { marginTop: 8, paddingVertical: 4 },
  errorText: {
    color: "#B00020",
    marginTop: -8,
    marginBottom: 10,
    fontSize: 12,
  },
});
