import {
  StyleSheet,
  Text as RNText,
  type TextProps,
  type TextStyle,
} from "react-native";

const WEIGHT_TO_FAMILY: Record<string, string> = {
  "300": "Pretendard-Light",
  light: "Pretendard-Light",
  "400": "Pretendard-Regular",
  normal: "Pretendard-Regular",
  "500": "Pretendard-Medium",
  "600": "Pretendard-SemiBold",
  "700": "Pretendard-Bold",
  bold: "Pretendard-Bold",
};

export function Text({ style, ...props }: TextProps) {
  const flattened = StyleSheet.flatten(style) as TextStyle | undefined;
  const weightKey = String(flattened?.fontWeight ?? "400");
  const fontFamily = WEIGHT_TO_FAMILY[weightKey] ?? "Pretendard-Regular";

  return (
    <RNText
      {...props}
      style={[style, { fontFamily, fontWeight: undefined }]}
    />
  );
}
