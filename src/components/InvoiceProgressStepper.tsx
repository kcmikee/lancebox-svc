import { Text } from "@/components/Text";
import { Image, StyleSheet, View } from "react-native";

export type InvoiceStep =
  | "invoice-details"
  | "bank-details"
  | "preview-invoice"
  | "download-send";

const STEPS: { key: InvoiceStep; label: string; width: number }[] = [
  { key: "invoice-details", label: "Invoice Details", width: 54 },
  { key: "bank-details", label: "Bank Details", width: 54 },
  { key: "preview-invoice", label: "Preview Invoice", width: 54 },
  {
    key: "download-send",
    label: "Download Invoice/Send to client",
    width: 76,
  },
];

type InvoiceProgressStepperProps = {
  activeStep: InvoiceStep;
};

export function InvoiceProgressStepper({
  activeStep,
}: InvoiceProgressStepperProps) {
  const activeIndex = STEPS.findIndex((step) => step.key === activeStep);

  return (
    <View style={styles.row}>
      {STEPS.map((step, index) => {
        const isStepActive = index === activeIndex;
        const isChevronActive = index === activeIndex;
        return (
          <View key={step.key} style={styles.stepGroup}>
            <Text
              style={[
                styles.label,
                { width: step.width },
                isStepActive ? styles.labelActive : styles.labelInactive,
              ]}
            >
              {step.label}
            </Text>
            <Image
              source={require("@/assets/images/icons/chevron-right.png")}
              style={[
                styles.chevron,
                isChevronActive ? styles.chevronActive : styles.chevronInactive,
              ]}
              resizeMode="contain"
            />
          </View>
        );
      })}
      <Image
        source={require("@/assets/images/icons/check-circle.png")}
        style={styles.checkCircle}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
  },
  labelActive: {
    fontWeight: "700",
    color: "#1A1D1F",
  },
  labelInactive: {
    fontWeight: "400",
    color: "#9CA3AF",
  },
  chevron: {
    width: 18,
    height: 18,
    marginTop: 2,
  },
  chevronActive: {
    tintColor: "#333333",
  },
  chevronInactive: {
    tintColor: "#9CA3AF",
  },
  checkCircle: {
    width: 20,
    height: 20,
    marginLeft: 4,
  },
});
