import { Text } from "@/components/Text";
import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type TextInputProps,
} from "react-native";

type AuthTextFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  isValid: boolean;
  error?: string;
};

export function AuthTextField({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize = "none",
  isValid,
  error,
}: AuthTextFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[styles.inputWrapper, error ? styles.inputWrapperError : null]}
      >
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
        />
        {isValid ? (
          <Ionicons name="checkmark" size={20} color="#0B1E3F" />
        ) : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: "#1F2937",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
    borderWidth: 1,
    borderColor: "#E3E5E8",
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  inputWrapperError: {
    borderColor: "#DC2626",
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Pretendard-Regular",
    color: "#111827",
  },
  errorText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#DC2626",
  },
});
