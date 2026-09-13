import { ConfirmModal } from "@/components/ConfirmModal";
import { InvoiceProgressStepper } from "@/components/InvoiceProgressStepper";
import { SuccessModal } from "@/components/SuccessModal";
import { Text } from "@/components/Text";
import { buildSavedInvoice, nextInvoiceNumber } from "@/lib/buildInvoice";
import { reportError } from "@/lib/errorReporting";
import { formatAmount, formatDate, parseNumber } from "@/lib/invoiceFormat";
import { downloadInvoicePdf } from "@/lib/invoicePdf";
import { useInvoiceDraft } from "@/store/invoiceDraft";
import { useInvoices } from "@/store/invoices";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PreviewInvoice() {
  const draft = useInvoiceDraft.getState();
  const resetDraft = useInvoiceDraft((state) => state.reset);
  const invoicesCount = useInvoices((state) => state.invoices.length);
  const addInvoice = useInvoices((state) => state.addInvoice);

  const [isSaveInvoiceVisible, setIsSaveInvoiceVisible] = useState(false);
  const [isDownloadSuccessVisible, setIsDownloadSuccessVisible] =
    useState(false);
  const [isSaveSuccessVisible, setIsSaveSuccessVisible] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const invoiceNumber = nextInvoiceNumber(invoicesCount);
  const previewInvoice = buildSavedInvoice(draft, invoiceNumber);
  const currencySymbol = previewInvoice.currency.symbol;
  const { subtotal, vatAmount, shippingAmount, total } = previewInvoice;

  const handleSaveAndDownload = async () => {
    setIsSaveInvoiceVisible(false);
    setIsDownloading(true);
    try {
      await downloadInvoicePdf(previewInvoice);
      addInvoice(previewInvoice);
      resetDraft();
      setIsSaveSuccessVisible(true);
    } catch (error) {
      reportError(error, "preview:downloadInvoicePdf:save");
      Alert.alert(
        "Something went wrong",
        "We couldn't generate the invoice PDF. Please try again.",
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadOnly = async () => {
    setIsSaveInvoiceVisible(false);
    setIsDownloading(true);
    try {
      await downloadInvoicePdf(previewInvoice);
      setIsDownloadSuccessVisible(true);
    } catch (error) {
      reportError(error, "preview:downloadInvoicePdf:skipSave");
      Alert.alert(
        "Something went wrong",
        "We couldn't generate the invoice PDF. Please try again.",
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={[styles.topRow, styles.paddingX]}>
        <Pressable
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
              Invoice No. <Text style={styles.invoiceNoValue}>#{invoiceNumber}</Text>
            </Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Bill To:</Text>
              <Text style={styles.infoValue}>{draft.clientName}</Text>
            </View>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>From:</Text>
              <Text style={styles.infoValue}>{draft.yourName}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Invoice Title</Text>
              <Text style={styles.infoValue}>{draft.invoiceTitle}</Text>
            </View>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Issuance date</Text>
              <Text style={styles.infoValue}>
                {formatDate(new Date())}
              </Text>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeaderCell, styles.colDescription]}>
                Description
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colQty]}>Qty</Text>
              <Text style={[styles.tableHeaderCell, styles.colUnitPrice]}>
                Unit Price({currencySymbol})
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colAmount]}>
                Amount({currencySymbol})
              </Text>
            </View>

            {draft.items.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.tableRow,
                  index % 2 === 0 && styles.tableRowStriped,
                ]}
              >
                <Text style={[styles.tableCell, styles.colDescription]}>
                  {item.description}
                </Text>
                <Text style={[styles.tableCell, styles.colQty]}>
                  {item.quantity}
                </Text>
                <Text style={[styles.tableCell, styles.colUnitPrice]}>
                  {formatAmount(parseNumber(item.price))}
                </Text>
                <Text style={[styles.tableCell, styles.colAmount]}>
                  {formatAmount(
                    parseNumber(item.quantity) * parseNumber(item.price),
                  )}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>
                {currencySymbol}
                {formatAmount(subtotal)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax:</Text>
              <Text style={styles.summaryValue}>
                {currencySymbol}
                {formatAmount(vatAmount)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping:</Text>
              <Text style={styles.summaryValue}>
                {currencySymbol}
                {formatAmount(shippingAmount)}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Total:</Text>
              <Text style={styles.summaryTotalValue}>
                {currencySymbol}
                {formatAmount(total)}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Terms of Payment</Text>
              <Text style={styles.infoValue}>
                {draft.terms || "—"}
              </Text>
            </View>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Payment Details</Text>
              <Text style={styles.infoValue}>
                Bank Number:{" "}
                <Text style={styles.infoValueRegular}>
                  {draft.bankNumber}
                </Text>
              </Text>
              <Text style={styles.infoValue}>
                Bank Name:{" "}
                <Text style={styles.infoValueRegular}>{draft.bankName}</Text>
              </Text>
              <Text style={styles.infoValue}>
                Account Name:{" "}
                <Text style={styles.infoValueRegular}>
                  {draft.accountName}
                </Text>
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          style={styles.downloadButton}
          onPress={() => setIsSaveInvoiceVisible(true)}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <ActivityIndicator size="small" color="#0B1E3F" />
              <Text style={styles.downloadButtonText}>Preparing PDF…</Text>
            </>
          ) : (
            <Text style={styles.downloadButtonText}>Download Pdf</Text>
          )}
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
        onPrimaryPress={handleSaveAndDownload}
        onSecondaryPress={handleDownloadOnly}
      />

      <SuccessModal
        visible={isDownloadSuccessVisible}
        onClose={() => setIsDownloadSuccessVisible(false)}
        title="Download Successful"
        message="Your Invoice was downloaded successfully"
        buttonLabel="Done"
        onButtonPress={() => {
          resetDraft();
          setIsDownloadSuccessVisible(false);
          router.push("/");
        }}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
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
