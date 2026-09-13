import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type InvoiceItem = {
  id: string;
  description: string;
  quantity: string;
  price: string;
};

export type Currency = {
  code: string;
  symbol: string;
};

export const CURRENCIES: Currency[] = [
  { code: "NGN", symbol: "N" },
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
];

export function createEmptyItem(): InvoiceItem {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    description: "",
    quantity: "",
    price: "",
  };
}

export type InvoiceDraftFields = {
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

function createInitialDraft(): InvoiceDraftFields {
  return {
    clientName: "",
    yourName: "",
    invoiceTitle: "",
    items: [createEmptyItem()],
    vat: "",
    shipping: "",
    currency: null,
    bankNumber: "",
    bankName: "",
    accountName: "",
    terms: "",
  };
}

type InvoiceDraftState = InvoiceDraftFields & {
  setDraft: (fields: Partial<InvoiceDraftFields>) => void;
  reset: () => void;
};

export const useInvoiceDraft = create<InvoiceDraftState>()(
  persist(
    (set) => ({
      ...createInitialDraft(),
      setDraft: (fields) => set(fields),
      reset: () => set(createInitialDraft()),
    }),
    {
      name: "lancebox-invoice-draft",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
