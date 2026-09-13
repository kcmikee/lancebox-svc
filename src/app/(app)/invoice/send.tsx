import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { router } from "expo-router";
import { Text } from "@/components/Text";
import { buildSavedInvoice, nextInvoiceNumber } from "@/lib/buildInvoice";
import { reportError } from "@/lib/errorReporting";
import { downloadInvoicePdf } from "@/lib/invoicePdf";
import { useInvoiceDraft } from "@/store/invoiceDraft";
import { useInvoices } from "@/store/invoices";
import { useState } from "react";

export default function SendInvoice() {
  const addInvoice = useInvoices((state) => state.addInvoice);
  const resetDraft = useInvoiceDraft((state) => state.reset);
  const [isProcessing, setIsProcessing] = useState(false);

  const finalize = async () => {
    if (isProcessing) {
      return;
    }
    setIsProcessing(true);
    try {
      const draft = useInvoiceDraft.getState();
      const invoicesCount = useInvoices.getState().invoices.length;
      const invoice = buildSavedInvoice(draft, nextInvoiceNumber(invoicesCount));
      await downloadInvoicePdf(invoice);
      addInvoice(invoice);
      resetDraft();
      router.replace("/");
    } catch (error) {
      reportError(error, "send:downloadInvoicePdf");
      Alert.alert(
        "Something went wrong",
        "We couldn't generate the invoice PDF. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Download or send invoice</Text>
      <Pressable
        style={styles.button}
        onPress={finalize}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Download invoice</Text>
        )}
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={finalize}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send to client</Text>
        )}
      </Pressable>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>Back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#208AEF",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  back: {
    textAlign: "center",
    color: "#208AEF",
  },
});
