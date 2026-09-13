import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

const RING_SIZE = 141;
const LOGO_SIZE = 60;

export function LoadingSpinner() {
  return (
    <View style={styles.container}>
      <View style={styles.ring}>
        <Image
          source={require("@/assets/animations/loading-spinner.gif")}
          style={StyleSheet.absoluteFill}
          autoplay
          contentFit="contain"
        />
      </View>
      <Image
        source={require("@/assets/images/icons/logo.png")}
        style={styles.logo}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    width: RING_SIZE,
    height: RING_SIZE,
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
});
