import { StyleSheet, View } from "react-native";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export function LoadingScreen() {
  return (
    <View style={styles.container}>
      <LoadingSpinner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});
