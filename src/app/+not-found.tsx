import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotFound() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <Text style={styles.title}>Page not found</Text>
        <Text style={styles.message}>
          The screen you&apos;re looking for doesn&apos;t exist.
        </Text>
        <Button
          label="Go to Home"
          onPress={() => router.replace("/")}
          textColor="#FFFFFF"
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1D1F",
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  button: {
    alignSelf: "stretch",
    marginTop: 20,
    backgroundColor: "#2FA2EE",
  },
});
