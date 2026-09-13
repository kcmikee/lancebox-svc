import { Button } from "@/components/Button";
import { FormField } from "@/components/FormField";
import { InvoiceProgressStepper } from "@/components/InvoiceProgressStepper";
import { Text } from "@/components/Text";
import { formatAmount, formatDate, parseNumber } from "@/lib/invoiceFormat";
import { invoiceDetailsSchema } from "@/lib/validation";
import {
  CURRENCIES,
  createEmptyItem,
  useInvoiceDraft,
  type InvoiceItem,
} from "@/store/invoiceDraft";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function InvoiceDetails() {
  const setDraft = useInvoiceDraft((state) => state.setDraft);
  const [initialDraft] = useState(() => useInvoiceDraft.getState());
  const [isCurrencyPickerVisible, setIsCurrencyPickerVisible] =
    useState(false);

  const formik = useFormik({
    initialValues: {
      clientName: initialDraft.clientName,
      yourName: initialDraft.yourName,
      invoiceTitle: initialDraft.invoiceTitle,
      items: initialDraft.items,
      vat: initialDraft.vat,
      shipping: initialDraft.shipping,
      currency: initialDraft.currency,
    },
    validationSchema: invoiceDetailsSchema,
    validateOnMount: true,
    onSubmit: () => {
      router.push("/invoice/bank-details");
    },
  });

  useEffect(() => {
    setDraft(formik.values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values]);

  const issuanceDate = formatDate(new Date());
  const currencySymbol = formik.values.currency?.symbol ?? "N";

  const items = formik.values.items;
  const itemsTouched = formik.touched.items as
    | { description?: boolean; quantity?: boolean; price?: boolean }[]
    | undefined;
  const itemsErrors = formik.errors.items as
    | { description?: string; quantity?: string; price?: string }[]
    | string
    | undefined;

  const setItems = (nextItems: InvoiceItem[]) =>
    formik.setFieldValue("items", nextItems);

  const updateItem = (id: string, changes: Partial<InvoiceItem>) =>
    setItems(
      items.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    );

  const addItem = () => setItems([...items, createEmptyItem()]);

  const removeItem = (id: string) =>
    setItems(items.filter((item) => item.id !== id));

  const subtotal = items.reduce(
    (sum, item) => sum + parseNumber(item.quantity) * parseNumber(item.price),
    0,
  );
  const vatAmount = subtotal * (parseNumber(formik.values.vat) / 100);
  const shippingAmount = parseNumber(formik.values.shipping);
  const total = subtotal + vatAmount + shippingAmount;

  const currencyError =
    formik.touched.currency && !formik.values.currency
      ? "Select a currency"
      : undefined;

  const handleNext = () => {
    formik.setTouched({
      clientName: true,
      yourName: true,
      invoiceTitle: true,
      currency: true,
      vat: true,
      shipping: true,
      items: items.map(() => ({
        description: true,
        quantity: true,
        price: true,
      })),
    });
    formik.submitForm();
  };

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
          <Text style={styles.heading}>New Invoice</Text>

          <View style={styles.stepperWrapper}>
            <InvoiceProgressStepper activeStep="invoice-details" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Invoice Number</Text>
          <View style={styles.input}>
            <Text style={styles.inputValue}>01</Text>
          </View>

          <FormField
            label="Client's Name"
            value={formik.values.clientName}
            onChangeText={(value) => formik.setFieldValue("clientName", value)}
            onBlur={() => formik.setFieldTouched("clientName", true)}
            placeholder="Enter Client's Name"
            error={
              formik.touched.clientName ? formik.errors.clientName : undefined
            }
            style={styles.labelSpaced}
          />

          <FormField
            label="Your Name"
            value={formik.values.yourName}
            onChangeText={(value) => formik.setFieldValue("yourName", value)}
            onBlur={() => formik.setFieldTouched("yourName", true)}
            placeholder="Enter Your Name"
            error={
              formik.touched.yourName ? formik.errors.yourName : undefined
            }
            style={styles.labelSpaced}
          />

          <View style={[styles.row, styles.labelSpaced]}>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Issuance Date</Text>
              <View style={[styles.input, styles.rowInputSpacing]}>
                <Text style={styles.inputValue}>{issuanceDate}</Text>
              </View>
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Currency</Text>
              <Pressable
                style={[
                  styles.input,
                  styles.selectInput,
                  styles.rowInputSpacing,
                  currencyError && styles.inputError,
                ]}
                onPress={() => {
                  formik.setFieldTouched("currency", true);
                  setIsCurrencyPickerVisible(true);
                }}
              >
                <Text
                  style={
                    formik.values.currency
                      ? styles.inputValue
                      : styles.placeholderText
                  }
                >
                  {formik.values.currency
                    ? formik.values.currency.code
                    : "Select"}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#6B7280" />
              </Pressable>
              {currencyError ? (
                <Text style={styles.errorText}>{currencyError}</Text>
              ) : null}
            </View>
          </View>

          <Text style={styles.sectionHeading}>Invoice Details</Text>

          <FormField
            label="Invoice Title"
            value={formik.values.invoiceTitle}
            onChangeText={(value) =>
              formik.setFieldValue("invoiceTitle", value)
            }
            onBlur={() => formik.setFieldTouched("invoiceTitle", true)}
            placeholder="Enter Invoice Title"
            error={
              formik.touched.invoiceTitle
                ? formik.errors.invoiceTitle
                : undefined
            }
          />
        </View>

        <View style={styles.itemSection}>
          {items.map((item, index) => {
            const itemAmount =
              parseNumber(item.quantity) * parseNumber(item.price);
            const touchedEntry = itemsTouched?.[index];
            const errorEntry =
              typeof itemsErrors === "object" ? itemsErrors?.[index] : undefined;
            return (
              <View
                key={item.id}
                style={index > 0 ? styles.itemDivider : undefined}
              >
                <FormField
                  label="Item Description"
                  value={item.description}
                  onChangeText={(value) =>
                    updateItem(item.id, { description: value })
                  }
                  onBlur={() =>
                    formik.setFieldTouched(`items[${index}].description`, true)
                  }
                  placeholder="Enter a description"
                  error={
                    touchedEntry?.description
                      ? errorEntry?.description
                      : undefined
                  }
                />

                <View style={[styles.row, styles.labelSpaced]}>
                  <FormField
                    label="Quantity"
                    value={item.quantity}
                    onChangeText={(value) =>
                      updateItem(item.id, { quantity: value })
                    }
                    onBlur={() =>
                      formik.setFieldTouched(`items[${index}].quantity`, true)
                    }
                    placeholder="e.g 2.00"
                    keyboardType="numeric"
                    error={
                      touchedEntry?.quantity ? errorEntry?.quantity : undefined
                    }
                    style={styles.rowItem}
                  />
                  <FormField
                    label="Price"
                    value={item.price}
                    onChangeText={(value) =>
                      updateItem(item.id, { price: value })
                    }
                    onBlur={() =>
                      formik.setFieldTouched(`items[${index}].price`, true)
                    }
                    placeholder="e.g 3,000,000.00"
                    keyboardType="numeric"
                    error={touchedEntry?.price ? errorEntry?.price : undefined}
                    style={styles.rowItem}
                  />
                </View>

                <View style={[styles.amountRow, styles.labelSpaced]}>
                  <View style={styles.amountField}>
                    <Text style={styles.label}>Amount</Text>
                    <View style={[styles.input, styles.rowInputSpacing]}>
                      <Text
                        style={
                          itemAmount > 0
                            ? styles.inputValue
                            : styles.placeholderText
                        }
                      >
                        {formatAmount(itemAmount)}
                      </Text>
                    </View>
                  </View>
                  {items.length > 1 ? (
                    <Pressable
                      style={styles.deleteButton}
                      onPress={() => removeItem(item.id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color="#4B5563"
                      />
                    </Pressable>
                  ) : null}
                </View>
              </View>
            );
          })}

          <Pressable style={styles.addItemButton} onPress={addItem}>
            <Text style={styles.addItemText}>Add New Item</Text>
          </Pressable>
        </View>

        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>SubTotal</Text>
            <Text style={styles.summaryValue}>
              {currencySymbol} {formatAmount(subtotal)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>VAT</Text>
            <View style={styles.percentColumn}>
              <View style={styles.percentInputWrapper}>
                <TextInput
                  style={[
                    styles.percentInput,
                    formik.touched.vat && formik.errors.vat
                      ? styles.inputError
                      : undefined,
                  ]}
                  value={formik.values.vat}
                  onChangeText={(value) => formik.setFieldValue("vat", value)}
                  onBlur={() => formik.setFieldTouched("vat", true)}
                  keyboardType="numeric"
                />
                <Text style={styles.percentSign}>%</Text>
              </View>
              {formik.touched.vat && formik.errors.vat ? (
                <Text style={styles.errorText}>{formik.errors.vat}</Text>
              ) : null}
            </View>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <View style={styles.shippingColumn}>
              <TextInput
                style={[
                  styles.shippingInput,
                  formik.touched.shipping && formik.errors.shipping
                    ? styles.inputError
                    : undefined,
                ]}
                value={formik.values.shipping}
                onChangeText={(value) =>
                  formik.setFieldValue("shipping", value)
                }
                onBlur={() => formik.setFieldTouched("shipping", true)}
                keyboardType="numeric"
              />
              {formik.touched.shipping && formik.errors.shipping ? (
                <Text style={styles.errorText}>{formik.errors.shipping}</Text>
              ) : null}
            </View>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              {currencySymbol} {formatAmount(total)}
            </Text>
          </View>
        </View>

        <Button
          label="Next"
          textColor="#FFFFFF"
          style={[styles.nextButton, formik.isValid && styles.nextButtonActive]}
          onPress={handleNext}
        />
      </ScrollView>

      <Modal
        visible={isCurrencyPickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCurrencyPickerVisible(false)}
      >
        <Pressable
          style={styles.currencyBackdrop}
          onPress={() => setIsCurrencyPickerVisible(false)}
        >
          <View style={styles.currencySheet}>
            {CURRENCIES.map((option) => (
              <Pressable
                key={option.code}
                style={styles.currencyOption}
                onPress={() => {
                  formik.setFieldValue("currency", option);
                  setIsCurrencyPickerVisible(false);
                }}
              >
                <Text style={styles.currencyOptionText}>
                  {option.symbol} {option.code}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
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
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 14,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  inputError: {
    borderColor: "#DC2626",
  },
  inputValue: {
    fontSize: 14,
    fontWeight: "400",
    color: "#1A1D1F",
  },
  placeholderText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#9CA3AF",
  },
  errorText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#DC2626",
    marginTop: 6,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  rowItem: {
    flex: 1,
  },
  rowInputSpacing: {
    marginTop: 0,
  },
  selectInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1D1F",
    marginTop: 28,
    marginBottom: 16,
  },
  itemSection: {
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: 20,
  },
  itemDivider: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
  },
  amountField: {
    flex: 1,
  },
  deleteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E6E6E6",
    alignItems: "center",
    justifyContent: "center",
  },
  addItemButton: {
    marginTop: 16,
    alignSelf: "flex-start",
  },
  addItemText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3898EC",
    textDecorationLine: "underline",
  },
  summarySection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    gap: 16,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "400",
    color: "#374151",
    marginTop: 10,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "400",
    color: "#9CA3AF",
    marginTop: 10,
  },
  percentColumn: {
    alignItems: "flex-end",
  },
  percentInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  percentInput: {
    width: 72,
    height: 40,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    color: "#1A1D1F",
  },
  percentSign: {
    fontSize: 14,
    fontWeight: "400",
    color: "#1A1D1F",
  },
  shippingColumn: {
    alignItems: "flex-end",
  },
  shippingInput: {
    width: 120,
    height: 40,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    color: "#1A1D1F",
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1D1F",
  },
  totalValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#9CA3AF",
  },
  nextButton: {
    marginHorizontal: 24,
    marginTop: 28,
    backgroundColor: "#A8ACB4",
  },
  nextButtonActive: {
    backgroundColor: "#2FA2EE",
  },
  currencyBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  currencySheet: {
    width: "100%",
    maxWidth: 280,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 8,
    overflow: "hidden",
  },
  currencyOption: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  currencyOptionText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1A1D1F",
  },
});
