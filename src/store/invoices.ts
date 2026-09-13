import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Currency, InvoiceItem } from "@/store/invoiceDraft";

export type SavedInvoice = {
  id: string;
  invoiceNumber: string;
  clientName: string;
  yourName: string;
  invoiceTitle: string;
  issuanceDate: string;
  currency: Currency;
  items: InvoiceItem[];
  vat: string;
  shipping: string;
  subtotal: number;
  vatAmount: number;
  shippingAmount: number;
  total: number;
  bankNumber: string;
  bankName: string;
  accountName: string;
  terms: string;
  createdAt: string;
};

type InvoicesState = {
  invoices: SavedInvoice[];
  hasHydrated: boolean;
  addInvoice: (invoice: SavedInvoice) => void;
};

export const useInvoices = create<InvoicesState>()(
  persist(
    (set) => ({
      invoices: [],
      hasHydrated: false,
      addInvoice: (invoice) =>
        set((state) => ({ invoices: [invoice, ...state.invoices] })),
    }),
    {
      name: "lancebox-invoices",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ invoices: state.invoices }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },
    },
  ),
);
