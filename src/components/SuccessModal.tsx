import { Text } from "@/components/Text";
import { Image, Modal, Pressable, StyleSheet, View } from "react-native";

type SuccessModalProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonLabel: string;
  onButtonPress: () => void;
};

export function SuccessModal({
  visible,
  onClose,
  title,
  message,
  buttonLabel,
  onButtonPress,
}: SuccessModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Pressable
            style={styles.closeButton}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <Image
              source={require("@/assets/images/icons/x-close.png")}
              style={styles.closeIcon}
              resizeMode="contain"
            />
          </Pressable>

          <Image
            source={require("@/assets/images/icons/check-circle.png")}
            style={styles.checkIcon}
            resizeMode="contain"
          />

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <Pressable style={styles.button} onPress={onButtonPress}>
            <Text style={styles.buttonText}>{buttonLabel}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  closeButton: {
    alignSelf: "flex-start",
    padding: 4,
  },
  closeIcon: {
    width: 20,
    height: 20,
  },
  checkIcon: {
    width: 48,
    height: 48,
    alignSelf: "center",
    marginTop: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1D1F",
    textAlign: "center",
    marginTop: 20,
  },
  message: {
    fontSize: 15,
    fontWeight: "400",
    color: "#4B5563",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 21,
    alignSelf: "center",
    width: "80%",
  },
  button: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "#6AA6F2",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0B1E3F",
  },
});
