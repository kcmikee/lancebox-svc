import { Text } from "@/components/Text";
import {
  StyleSheet,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type StyleProp,
  type ViewStyle,
} from "react-native";

type FormFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  error?: string;
  style?: StyleProp<ViewStyle>;
};

export function FormField({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  keyboardType,
  multiline,
  error,
  style,
}: FormFieldProps) {
  return (
    <View style={style}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.textInput,
          multiline && styles.multiline,
          error ? styles.textInputError : undefined,
        ]}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType}
        multiline={multiline}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: "400",
    color: "#374151",
    marginBottom: 8,
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    color: "#1A1D1F",
    backgroundColor: "#FFFFFF",
  },
  textInputError: {
    borderColor: "#DC2626",
  },
  multiline: {
    height: 56,
    paddingTop: 14,
    textAlignVertical: "top",
  },
  errorText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#DC2626",
    marginTop: 6,
  },
});
