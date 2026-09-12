import {
  Image,
  Pressable,
  StyleSheet,
  type ImageSourcePropType,
} from "react-native";

type SocialButtonProps = {
  source: ImageSourcePropType;
  iconSize?: number;
  accessibilityLabel: string;
  onPress?: () => void;
};

export function SocialButton({
  source,
  iconSize = 24,
  accessibilityLabel,
  onPress,
}: SocialButtonProps) {
  return (
    <Pressable
      style={styles.circle}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Image
        source={source}
        style={{ width: iconSize, height: iconSize }}
        resizeMode="contain"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 48,
    height: 48,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#E3E5E8",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
});
