import { buildSavedInvoice, nextInvoiceNumber } from "@/lib/buildInvoice";

describe("nextInvoiceNumber", () => {
  it("starts at 0001 when there are no existing invoices", () => {
    expect(nextInvoiceNumber(0)).toBe("0001");
  });

  it("pads to four digits", () => {
    expect(nextInvoiceNumber(4)).toBe("0005");
  });

  it("does not pad beyond four digits once the count is large", () => {
    expect(nextInvoiceNumber(9999)).toBe("10000");
  });
});

describe("buildSavedInvoice", () => {
  const draft = {
    clientName: "  Mr Peter Abu  ",
    yourName: "  Miss Olasubomi Akin  ",
    invoiceTitle: "  Website Design  ",
    items: [{ id: "1", description: "Web Design", quantity: "2", price: "500" }],
    vat: "10",
    shipping: "50",
    currency: { code: "NGN", symbol: "N" },
    bankNumber: "  0123456789  ",
    bankName: "  Lance Bank  ",
    accountName: "  Jane Doe  ",
    terms: "  Net 30  ",
  };

  it("trims every text field", () => {
    const invoice = buildSavedInvoice(draft, "0001");
    expect(invoice.clientName).toBe("Mr Peter Abu");
    expect(invoice.yourName).toBe("Miss Olasubomi Akin");
    expect(invoice.invoiceTitle).toBe("Website Design");
    expect(invoice.bankNumber).toBe("0123456789");
    expect(invoice.bankName).toBe("Lance Bank");
    expect(invoice.accountName).toBe("Jane Doe");
    expect(invoice.terms).toBe("Net 30");
  });

  it("carries through the given invoice number", () => {
    const invoice = buildSavedInvoice(draft, "0042");
    expect(invoice.invoiceNumber).toBe("0042");
  });

  it("computes totals from the items, VAT, and shipping", () => {
    const invoice = buildSavedInvoice(draft, "0001");
    expect(invoice.subtotal).toBe(1000);
    expect(invoice.vatAmount).toBe(100);
    expect(invoice.shippingAmount).toBe(50);
    expect(invoice.total).toBe(1150);
  });

  it("falls back to NGN when no currency was selected", () => {
    const invoice = buildSavedInvoice({ ...draft, currency: null }, "0001");
    expect(invoice.currency).toEqual({ code: "NGN", symbol: "N" });
  });

  it("uses the selected currency when one is set", () => {
    const invoice = buildSavedInvoice(
      { ...draft, currency: { code: "USD", symbol: "$" } },
      "0001",
    );
    expect(invoice.currency).toEqual({ code: "USD", symbol: "$" });
  });

  it("generates a unique id per invoice", () => {
    const first = buildSavedInvoice(draft, "0001");
    const second = buildSavedInvoice(draft, "0002");
    expect(first.id).not.toBe(second.id);
  });

  it("stamps createdAt as a valid ISO timestamp", () => {
    const invoice = buildSavedInvoice(draft, "0001");
    expect(() => new Date(invoice.createdAt).toISOString()).not.toThrow();
  });

  it("preserves the raw items array for later editing", () => {
    const invoice = buildSavedInvoice(draft, "0001");
    expect(invoice.items).toEqual(draft.items);
  });
});
