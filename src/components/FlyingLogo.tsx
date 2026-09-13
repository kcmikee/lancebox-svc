import { useEffect } from "react";
import { Image } from "expo-image";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import type { EdgeInsets } from "react-native-safe-area-context";

const START_LOGO_SIZE = 60;
const END_LOGO_SIZE = 40;
const END_TOP_OFFSET = 24;
const FLY_DURATION_MS = 420;

type FlyingLogoProps = {
  insets: EdgeInsets;
  onDone: () => void;
};

export function FlyingLogo({ insets, onDone }: FlyingLogoProps) {
  const { height } = Dimensions.get("window");
  const startCenterY = height / 2;
  const endCenterY = insets.top + END_TOP_OFFSET + END_LOGO_SIZE / 2;

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(
      1,
      { duration: FLY_DURATION_MS, easing: Easing.inOut(Easing.cubic) },
      (finished) => {
        if (finished) {
          runOnJS(onDone)();
        }
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => {
    const centerY =
      startCenterY + progress.value * (endCenterY - startCenterY);
    return {
      transform: [
        { translateY: centerY - START_LOGO_SIZE / 2 },
        { scale: 1 - progress.value * (1 - END_LOGO_SIZE / START_LOGO_SIZE) },
      ],
    };
  });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View style={[styles.logoWrap, style]}>
        <Image
          source={require("@/assets/images/icons/logo.png")}
          style={styles.logo}
          contentFit="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  logoWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  logo: {
    width: START_LOGO_SIZE,
    height: START_LOGO_SIZE,
  },
});
