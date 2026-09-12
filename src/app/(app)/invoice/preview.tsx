import { ConfirmModal } from "@/components/ConfirmModal";
import { InvoiceProgressStepper } from "@/components/InvoiceProgressStepper";
import { SuccessModal } from "@/components/SuccessModal";
import { Text } from "@/components/Text";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ITEMS = [
  {
    description: "Web Design",
    qty: "2.00",
    unitPrice: "3,000,000",
    amount: "6,000,000",
  },
  {
    description: "Logo Design",
    qty: "2.00",
    unitPrice: "3,000,000",
    amount: "6,000,000",
  },
  {
    description: "Web Design",
    qty: "2.00",
    unitPrice: "3,000,000",
    amount: "6,000,000",
  },
  {
    description: "Logo Design",
    qty: "2.00",
    unitPrice: "3,000,000",
    amount: "6,000,000",
  },
];

export default function PreviewInvoice() {
  const [isSaveInvoiceVisible, setIsSaveInvoiceVisible] = useState(false);
  const [isDownloadSuccessVisible, setIsDownloadSuccessVisible] =
    useState(false);
  const [isSaveSuccessVisible, setIsSaveSuccessVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={[styles.topRow, styles.paddingX]}>
        <Pressable onPress={() => router.back()}>
          <Image
            source={require("@/assets/images/icons/x-close.png")}
            style={styles.closeIcon}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header]}>
          <View style={styles.top}>
            <Text style={styles.heading}>Preview</Text>
            <Pressable onPress={() => router.push("/invoice")}>
              <Text style={styles.editInvoice}>Edit Invoice</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.stepperWrapper}>
          <InvoiceProgressStepper activeStep="preview-invoice" />
        </View>
        <View style={styles.card}>
          <View style={styles.invoiceNoRow}>
            <View style={styles.avatar} />
            <Text style={styles.invoiceNoLabel}>
              Invoice No. <Text style={styles.invoiceNoValue}>#0001</Text>
            </Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Bill To:</Text>
              <Text style={styles.infoValue}>Mr Peter Abu</Text>
            </View>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>From:</Text>
              <Text style={styles.infoValue}>Miss Olasubomi Akin</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Issuance date</Text>
              <Text style={styles.infoValue}>Website Design For Lancebox</Text>
            </View>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Issuance date</Text>
              <Text style={styles.infoValue}>25/01/2023</Text>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeaderCell, styles.colDescription]}>
                Description
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colQty]}>Qty</Text>
              <Text style={[styles.tableHeaderCell, styles.colUnitPrice]}>
                Unit Price(N)
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colAmount]}>
                Amount(N)
              </Text>
            </View>

            {ITEMS.map((item, index) => (
              <View
                key={`${item.description}-${index}`}
                style={[
                  styles.tableRow,
                  index % 2 === 0 && styles.tableRowStriped,
                ]}
              >
                <Text style={[styles.tableCell, styles.colDescription]}>
                  {item.description}
                </Text>
                <Text style={[styles.tableCell, styles.colQty]}>
                  {item.qty}
                </Text>
                <Text style={[styles.tableCell, styles.colUnitPrice]}>
                  {item.unitPrice}
                </Text>
                <Text style={[styles.tableCell, styles.colAmount]}>
                  {item.amount}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>N12,000,000.00</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax:</Text>
              <Text style={styles.summaryValue}>N1,440,000.00</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping:</Text>
              <Text style={styles.summaryValue}>N500,000.00</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Total:</Text>
              <Text style={styles.summaryTotalValue}>N14,900,000.00</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Terms of Payment</Text>
              <Text style={styles.infoValue}>
                Payment will be made in installments
              </Text>
            </View>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Payment Details</Text>
              <Text style={styles.infoValue}>
                Bank Number:{" "}
                <Text style={styles.infoValueRegular}>0123456789</Text>
              </Text>
              <Text style={styles.infoValue}>
                Bank Name:{" "}
                <Text style={styles.infoValueRegular}>Lance Bank</Text>
              </Text>
              <Text style={styles.infoValue}>
                Account Name:{" "}
                <Text style={styles.infoValueRegular}>Jane Doe</Text>
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          style={styles.downloadButton}
          onPress={() => setIsSaveInvoiceVisible(true)}
        >
          <Text style={styles.downloadButtonText}>Download Pdf</Text>
        </Pressable>

        <Pressable
          style={styles.sendButton}
          onPress={() => router.push("/invoice/send")}
        >
          <Text style={styles.sendButtonText}>Send To Client Email</Text>
        </Pressable>
      </ScrollView>

      <ConfirmModal
        visible={isSaveInvoiceVisible}
        onClose={() => setIsSaveInvoiceVisible(false)}
        title="Save Invoice"
        message="Would you like to save your invoice to be able to edit it later?"
        primaryLabel="Yes"
        secondaryLabel="No"
        onPrimaryPress={() => {
          setIsSaveInvoiceVisible(false);
          setIsSaveSuccessVisible(true);
        }}
        onSecondaryPress={() => {
          setIsSaveInvoiceVisible(false);
          setIsDownloadSuccessVisible(true);
        }}
      />

      <SuccessModal
        visible={isDownloadSuccessVisible}
        onClose={() => setIsDownloadSuccessVisible(false)}
        title="Download Successful"
        message="Your Invoice was downloaded successfully"
        buttonLabel="Done"
        onButtonPress={() => setIsDownloadSuccessVisible(false)}
      />

      <SuccessModal
        visible={isSaveSuccessVisible}
        onClose={() => setIsSaveSuccessVisible(false)}
        title="Success"
        message="Your Invoice was saved successfully. Go to Dashboard to view"
        buttonLabel="Go to Dashboard"
        onButtonPress={() => {
          setIsSaveSuccessVisible(false);
          router.push("/");
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  paddingX: {
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  closeIcon: {
    width: 20,
    height: 20,
  },
  editInvoice: {
    fontSize: 15,
    fontWeight: "600",
    color: "#3898EC",
    textDecorationLine: "underline",
  },
  header: {
    marginTop: 12,
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1D1F",
  },
  stepperWrapper: {
    marginTop: 14,
  },
  card: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 4,
    paddingHorizontal: 13,
    paddingVertical: 25.31,
    marginTop: 20,
  },
  invoiceNoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#D9D9D9",
  },
  invoiceNoLabel: {
    fontSize: 13,
    fontWeight: "400",
    color: "#6B7280",
  },
  invoiceNoValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0D3B66",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  infoColumn: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "400",
    color: "#9CA3AF",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0D3B66",
  },
  infoValueRegular: {
    fontSize: 12,
    fontWeight: "400",
    color: "#0D3B66",
  },
  table: {
    marginTop: 20,
  },
  tableHeaderRow: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  tableHeaderCell: {
    fontSize: 11,
    fontWeight: "400",
    color: "#9CA3AF",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderRadius: 6,
  },
  tableRowStriped: {
    backgroundColor: "#EEF4FC",
  },
  tableCell: {
    fontSize: 12,
    fontWeight: "400",
    color: "#1A1D1F",
  },
  colDescription: {
    flex: 1.3,
  },
  colQty: {
    flex: 0.7,
  },
  colUnitPrice: {
    flex: 1,
  },
  colAmount: {
    flex: 1,
    textAlign: "right",
  },
  summary: {
    marginTop: 12,
    gap: 6,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "400",
    color: "#6B7280",
    width: 70,
    textAlign: "left",
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: "400",
    color: "#1A1D1F",
    width: 120,
    textAlign: "right",
  },
  summaryDivider: {
    alignSelf: "flex-end",
    width: 206,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  summaryTotalLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A1D1F",
    width: 70,
    textAlign: "left",
  },
  summaryTotalValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0D3B66",
    width: 120,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginTop: 16,
    marginBottom: 16,
  },
  downloadButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4A90F7",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0B1E3F",
  },
  sendButton: {
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: "#4A90F7",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A90F7",
  },
});
