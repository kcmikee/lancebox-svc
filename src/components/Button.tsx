import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";

type ButtonProps = {
  label: string;
  loadingLabel?: string;
  isLoading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  loadingLabel,
  isLoading = false,
  disabled = false,
  onPress,
  style,
}: ButtonProps) {
  return (
    <Pressable
      style={[styles.button, style]}
      onPress={onPress}
      disabled={disabled || isLoading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || isLoading, busy: isLoading }}
    >
      {isLoading ? (
        <>
          <ActivityIndicator size="small" color="#0B1E3F" />
          <Text style={styles.text}>{loadingLabel ?? label}</Text>
        </>
      ) : (
        <Text style={styles.text}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#6AA6F2",
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0B1E3F",
  },
});
