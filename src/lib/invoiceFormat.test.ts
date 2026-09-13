import {
  computeInvoiceTotals,
  formatAmount,
  formatDate,
  parseNumber,
} from "@/lib/invoiceFormat";

describe("formatDate", () => {
  it("formats a date as DD/MM/YYYY", () => {
    expect(formatDate(new Date(2026, 0, 5))).toBe("05/01/2026");
  });

  it("pads single-digit day and month", () => {
    expect(formatDate(new Date(2025, 8, 9))).toBe("09/09/2025");
  });
});

describe("formatAmount", () => {
  it("formats with thousands separators and two decimals", () => {
    expect(formatAmount(1234567)).toBe("1,234,567.00");
  });

  it("formats zero", () => {
    expect(formatAmount(0)).toBe("0.00");
  });

  it("rounds to two decimal places", () => {
    expect(formatAmount(10.005)).toBe("10.01");
  });
});

describe("parseNumber", () => {
  it("parses a plain numeric string", () => {
    expect(parseNumber("2500")).toBe(2500);
  });

  it("strips comma separators before parsing", () => {
    expect(parseNumber("3,000,000")).toBe(3000000);
  });

  it("returns 0 for non-numeric input", () => {
    expect(parseNumber("abc")).toBe(0);
  });

  it("returns 0 for an empty string", () => {
    expect(parseNumber("")).toBe(0);
  });
});

describe("computeInvoiceTotals", () => {
  it("computes subtotal as the sum of quantity times price", () => {
    const items = [
      { quantity: "2", price: "3,000,000" },
      { quantity: "1", price: "500,000" },
    ];
    const { subtotal } = computeInvoiceTotals(items, "", "");
    expect(subtotal).toBe(6500000);
  });

  it("applies VAT as a percentage of the subtotal", () => {
    const items = [{ quantity: "1", price: "1000" }];
    const { vatAmount } = computeInvoiceTotals(items, "10", "");
    expect(vatAmount).toBe(100);
  });

  it("adds shipping as a flat amount", () => {
    const items = [{ quantity: "1", price: "1000" }];
    const { shippingAmount, total } = computeInvoiceTotals(items, "", "50");
    expect(shippingAmount).toBe(50);
    expect(total).toBe(1050);
  });

  it("combines subtotal, VAT, and shipping into the total", () => {
    const items = [{ quantity: "2", price: "100" }];
    const { total } = computeInvoiceTotals(items, "10", "20");
    expect(total).toBeCloseTo(240, 5);
  });

  it("treats an empty item list as zero", () => {
    const { subtotal, total } = computeInvoiceTotals([], "10", "10");
    expect(subtotal).toBe(0);
    expect(total).toBe(10);
  });
});
