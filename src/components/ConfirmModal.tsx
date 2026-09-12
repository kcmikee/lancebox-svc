import { Image, Modal, Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/components/Text";

type ConfirmModalProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimaryPress: () => void;
  onSecondaryPress: () => void;
};

export function ConfirmModal({
  visible,
  onClose,
  title,
  message,
  primaryLabel,
  secondaryLabel,
  onPrimaryPress,
  onSecondaryPress,
}: ConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Image
              source={require("@/assets/images/icons/x-close.png")}
              style={styles.closeIcon}
              resizeMode="contain"
            />
          </Pressable>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonRow}>
            <Pressable style={styles.primaryButton} onPress={onPrimaryPress}>
              <Text style={styles.primaryButtonText}>{primaryLabel}</Text>
            </Pressable>
            <Pressable
              style={styles.secondaryButton}
              onPress={onSecondaryPress}
            >
              <Text style={styles.secondaryButtonText}>{secondaryLabel}</Text>
            </Pressable>
          </View>
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
  title: {
    fontSize: 19,
    fontWeight: "700",
    color: "#1A1D1F",
    textAlign: "center",
    marginTop: 4,
  },
  message: {
    fontSize: 15,
    fontWeight: "400",
    color: "#4B5563",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 21,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 24,
  },
  primaryButton: {
    height: 52,
    minWidth: 130,
    paddingHorizontal: 24,
    borderRadius: 26,
    backgroundColor: "#6AA6F2",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0B1E3F",
  },
  secondaryButton: {
    height: 52,
    minWidth: 130,
    paddingHorizontal: 24,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: "#6AA6F2",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4A90F7",
  },
});
