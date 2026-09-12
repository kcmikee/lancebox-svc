import { Button } from "@/components/Button";
import { InvoiceProgressStepper } from "@/components/InvoiceProgressStepper";
import { Text } from "@/components/Text";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
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

type InvoiceItem = {
  id: string;
  description: string;
  quantity: string;
  price: string;
};

type Currency = {
  code: string;
  symbol: string;
};

const CURRENCIES: Currency[] = [
  { code: "NGN", symbol: "N" },
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
];

function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
}

function formatAmount(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function parseNumber(value: string) {
  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function createEmptyItem(): InvoiceItem {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    description: "",
    quantity: "",
    price: "",
  };
}

export default function InvoiceDetails() {
  const [clientName, setClientName] = useState("");
  const [yourName, setYourName] = useState("");
  const [invoiceTitle, setInvoiceTitle] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([createEmptyItem()]);
  const [vat, setVat] = useState("");
  const [shipping, setShipping] = useState("");
  const [currency, setCurrency] = useState<Currency | null>(null);
  const [isCurrencyPickerVisible, setIsCurrencyPickerVisible] = useState(false);

  const issuanceDate = formatDate(new Date());
  const currencySymbol = currency?.symbol ?? "N";

  const updateItem = (id: string, changes: Partial<InvoiceItem>) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    );
  };

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const addItem = () => {
    setItems((current) => [...current, createEmptyItem()]);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + parseNumber(item.quantity) * parseNumber(item.price),
    0,
  );
  const vatAmount = subtotal * (parseNumber(vat) / 100);
  const shippingAmount = parseNumber(shipping);
  const total = subtotal + vatAmount + shippingAmount;

  const isFormValid =
    clientName.trim().length > 0 && yourName.trim().length > 0;

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

          <Text style={[styles.label, styles.labelSpaced]}>
            Client&apos;s Name
          </Text>
          <TextInput
            style={styles.textInput}
            value={clientName}
            onChangeText={setClientName}
            placeholder="Enter Client's Name"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={[styles.label, styles.labelSpaced]}>Your Name</Text>
          <TextInput
            style={styles.textInput}
            value={yourName}
            onChangeText={setYourName}
            placeholder="Enter Your Name"
            placeholderTextColor="#9CA3AF"
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
                ]}
                onPress={() => setIsCurrencyPickerVisible(true)}
              >
                <Text
                  style={currency ? styles.inputValue : styles.placeholderText}
                >
                  {currency ? currency.code : "Select"}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#6B7280" />
              </Pressable>
            </View>
          </View>

          <Text style={styles.sectionHeading}>Invoice Details</Text>

          <Text style={styles.label}>Invoice Title</Text>
          <TextInput
            style={styles.textInput}
            value={invoiceTitle}
            onChangeText={setInvoiceTitle}
            placeholder="Enter Invoice Title"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.itemSection}>
          {items.map((item, index) => {
            const itemAmount =
              parseNumber(item.quantity) * parseNumber(item.price);
            return (
              <View
                key={item.id}
                style={index > 0 ? styles.itemDivider : undefined}
              >
                <Text style={styles.label}>Item Description</Text>
                <TextInput
                  style={styles.textInput}
                  value={item.description}
                  onChangeText={(value) =>
                    updateItem(item.id, { description: value })
                  }
                  placeholder="Enter a description"
                  placeholderTextColor="#9CA3AF"
                />

                <View style={[styles.row, styles.labelSpaced]}>
                  <View style={styles.rowItem}>
                    <Text style={styles.label}>Quantity</Text>
                    <TextInput
                      style={[styles.textInput, styles.rowInputSpacing]}
                      value={item.quantity}
                      onChangeText={(value) =>
                        updateItem(item.id, { quantity: value })
                      }
                      placeholder="e.g 2.00"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.rowItem}>
                    <Text style={styles.label}>Price</Text>
                    <TextInput
                      style={[styles.textInput, styles.rowInputSpacing]}
                      value={item.price}
                      onChangeText={(value) =>
                        updateItem(item.id, { price: value })
                      }
                      placeholder="e.g 3,000,000.00"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                    />
                  </View>
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
                  <Pressable
                    style={styles.deleteButton}
                    onPress={() => removeItem(item.id)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#4B5563" />
                  </Pressable>
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
            <View style={styles.percentInputWrapper}>
              <TextInput
                style={styles.percentInput}
                value={vat}
                onChangeText={setVat}
                keyboardType="numeric"
              />
              <Text style={styles.percentSign}>%</Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <TextInput
              style={styles.shippingInput}
              value={shipping}
              onChangeText={setShipping}
              keyboardType="numeric"
            />
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
          disabled={!isFormValid}
          textColor="#FFFFFF"
          style={[styles.nextButton, isFormValid && styles.nextButtonActive]}
          onPress={() => router.push("/invoice/bank-details")}
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
                  setCurrency(option);
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
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "400",
    color: "#374151",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "400",
    color: "#9CA3AF",
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
