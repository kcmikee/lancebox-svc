import { computeInvoiceTotals, formatDate } from "@/lib/invoiceFormat";
import type { Currency, InvoiceItem } from "@/store/invoiceDraft";
import type { SavedInvoice } from "@/store/invoices";

type DraftFields = {
  clientName: string;
  yourName: string;
  invoiceTitle: string;
  items: InvoiceItem[];
  vat: string;
  shipping: string;
  currency: Currency | null;
  bankNumber: string;
  bankName: string;
  accountName: string;
  terms: string;
};

export function nextInvoiceNumber(existingCount: number) {
  return String(existingCount + 1).padStart(4, "0");
}

export function buildSavedInvoice(
  draft: DraftFields,
  invoiceNumber: string,
): SavedInvoice {
  const { subtotal, vatAmount, shippingAmount, total } = computeInvoiceTotals(
    draft.items,
    draft.vat,
    draft.shipping,
  );

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    invoiceNumber,
    clientName: draft.clientName.trim(),
    yourName: draft.yourName.trim(),
    invoiceTitle: draft.invoiceTitle.trim(),
    issuanceDate: formatDate(new Date()),
    currency: draft.currency ?? { code: "NGN", symbol: "N" },
    items: draft.items,
    vat: draft.vat,
    shipping: draft.shipping,
    subtotal,
    vatAmount,
    shippingAmount,
    total,
    bankNumber: draft.bankNumber.trim(),
    bankName: draft.bankName.trim(),
    accountName: draft.accountName.trim(),
    terms: draft.terms.trim(),
    createdAt: new Date().toISOString(),
  };
}
