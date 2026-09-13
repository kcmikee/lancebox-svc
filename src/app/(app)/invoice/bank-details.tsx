import { Button } from "@/components/Button";
import { FormField } from "@/components/FormField";
import { InvoiceProgressStepper } from "@/components/InvoiceProgressStepper";
import { Text } from "@/components/Text";
import { bankDetailsSchema } from "@/lib/validation";
import { useInvoiceDraft } from "@/store/invoiceDraft";
import { router } from "expo-router";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BankDetails() {
  const setDraft = useInvoiceDraft((state) => state.setDraft);
  const [initialDraft] = useState(() => useInvoiceDraft.getState());

  const formik = useFormik({
    initialValues: {
      bankNumber: initialDraft.bankNumber,
      bankName: initialDraft.bankName,
      accountName: initialDraft.accountName,
      terms: initialDraft.terms,
    },
    validationSchema: bankDetailsSchema,
    validateOnMount: true,
    onSubmit: () => {
      router.push("/invoice/preview");
    },
  });

  useEffect(() => {
    setDraft(formik.values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values]);

  const handleNext = () => {
    formik.setTouched({
      bankNumber: true,
      bankName: true,
      accountName: true,
    });
    formik.submitForm();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            style={styles.closeButton}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
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
            <FormField
              label="Bank Number"
              value={formik.values.bankNumber}
              onChangeText={(value) =>
                formik.setFieldValue("bankNumber", value)
              }
              onBlur={() => formik.setFieldTouched("bankNumber", true)}
              placeholder="Enter your Bank Number"
              keyboardType="numeric"
              error={
                formik.touched.bankNumber
                  ? formik.errors.bankNumber
                  : undefined
              }
            />

            <FormField
              label="Name of Bank"
              value={formik.values.bankName}
              onChangeText={(value) =>
                formik.setFieldValue("bankName", value)
              }
              onBlur={() => formik.setFieldTouched("bankName", true)}
              placeholder="Enter your Bank Name"
              error={
                formik.touched.bankName ? formik.errors.bankName : undefined
              }
              style={styles.labelSpaced}
            />

            <FormField
              label="Name of Account"
              value={formik.values.accountName}
              onChangeText={(value) =>
                formik.setFieldValue("accountName", value)
              }
              onBlur={() => formik.setFieldTouched("accountName", true)}
              placeholder="Enter the Name on Account"
              error={
                formik.touched.accountName
                  ? formik.errors.accountName
                  : undefined
              }
              style={styles.labelSpaced}
            />

            <FormField
              label="Terms of Payment"
              value={formik.values.terms}
              onChangeText={(value) => formik.setFieldValue("terms", value)}
              placeholder="e,g Payment will be made in installments"
              multiline
              style={styles.labelSpaced}
            />
          </View>

          <Button
            label="Preview Invoice"
            textColor="#FFFFFF"
            style={[
              styles.nextButton,
              formik.isValid && styles.nextButtonActive,
            ]}
            onPress={handleNext}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  flex: {
    flex: 1,
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
  labelSpaced: {
    marginTop: 16,
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
