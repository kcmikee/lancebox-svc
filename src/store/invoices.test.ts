import { useInvoices, type SavedInvoice } from "@/store/invoices";

function makeInvoice(overrides: Partial<SavedInvoice> = {}): SavedInvoice {
  return {
    id: "1",
    invoiceNumber: "0001",
    clientName: "Mr Peter Abu",
    yourName: "Miss Olasubomi Akin",
    invoiceTitle: "Website Design",
    issuanceDate: "13/09/2026",
    currency: { code: "NGN", symbol: "N" },
    items: [],
    vat: "",
    shipping: "",
    subtotal: 0,
    vatAmount: 0,
    shippingAmount: 0,
    total: 0,
    bankNumber: "",
    bankName: "",
    accountName: "",
    terms: "",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("useInvoices", () => {
  beforeEach(() => {
    useInvoices.setState({ invoices: [], hasHydrated: true });
  });

  it("starts with no saved invoices", () => {
    expect(useInvoices.getState().invoices).toHaveLength(0);
  });

  it("adds an invoice to the list", () => {
    useInvoices.getState().addInvoice(makeInvoice());
    expect(useInvoices.getState().invoices).toHaveLength(1);
  });

  it("prepends new invoices so the most recent is first", () => {
    useInvoices.getState().addInvoice(makeInvoice({ id: "1" }));
    useInvoices.getState().addInvoice(makeInvoice({ id: "2" }));

    const invoices = useInvoices.getState().invoices;
    expect(invoices[0].id).toBe("2");
    expect(invoices[1].id).toBe("1");
  });

  it("keeps every previously saved invoice", () => {
    useInvoices.getState().addInvoice(makeInvoice({ id: "1" }));
    useInvoices.getState().addInvoice(makeInvoice({ id: "2" }));
    useInvoices.getState().addInvoice(makeInvoice({ id: "3" }));

    expect(useInvoices.getState().invoices.map((i) => i.id)).toEqual([
      "3",
      "2",
      "1",
    ]);
  });
});
