import { Button } from "@/components/Button";
import { InvoiceProgressStepper } from "@/components/InvoiceProgressStepper";
import { Text } from "@/components/Text";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BankDetails() {
  const [bankNumber, setBankNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [terms, setTerms] = useState("");

  const isFormValid =
    bankNumber.trim().length > 0 &&
    bankName.trim().length > 0 &&
    accountName.trim().length > 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <Image
            source={require("@/assets/images/icons/x-close.png")}
            style={styles.closeIcon}
            resizeMode="contain"
          />
        </Pressable>

        <View style={styles.header}>
          <Text style={styles.heading}>Bank Details</Text>

          <View style={styles.stepperWrapper}>
            <InvoiceProgressStepper activeStep="bank-details" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Bank Number</Text>
          <TextInput
            style={styles.textInput}
            value={bankNumber}
            onChangeText={setBankNumber}
            placeholder="Enter your Bank Number"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />

          <Text style={[styles.label, styles.labelSpaced]}>Name of Bank</Text>
          <TextInput
            style={styles.textInput}
            value={bankName}
            onChangeText={setBankName}
            placeholder="Enter your Bank Name"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={[styles.label, styles.labelSpaced]}>
            Name of Account
          </Text>
          <TextInput
            style={styles.textInput}
            value={accountName}
            onChangeText={setAccountName}
            placeholder="Enter the Name on Account"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={[styles.label, styles.labelSpaced]}>
            Terms of Payment
          </Text>
          <TextInput
            style={[styles.textInput, styles.termsInput]}
            value={terms}
            onChangeText={setTerms}
            placeholder="e,g Payment will be made in installments"
            placeholderTextColor="#9CA3AF"
            multiline
          />
        </View>

        <Button
          label="Preview Invoice"
          disabled={!isFormValid}
          textColor="#FFFFFF"
          style={[styles.nextButton, isFormValid && styles.nextButtonActive]}
          onPress={() => router.push("/invoice/preview")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 32,
  },
  closeButton: {
    alignSelf: "flex-start",
    marginTop: 16,
    marginLeft: 24,
    padding: 4,
  },
  closeIcon: {
    width: 20,
    height: 20,
  },
  header: {
    paddingHorizontal: 24,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1D1F",
    marginTop: 12,
  },
  stepperWrapper: {
    marginTop: 14,
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "400",
    color: "#374151",
    marginBottom: 8,
  },
  labelSpaced: {
    marginTop: 16,
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
  termsInput: {
    height: 56,
    paddingTop: 14,
    textAlignVertical: "top",
  },
  nextButton: {
    marginHorizontal: 24,
    marginTop: 28,
    backgroundColor: "#A8ACB4",
  },
  nextButtonActive: {
    backgroundColor: "#2FA2EE",
  },
});
