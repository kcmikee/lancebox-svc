import { reportError } from "@/lib/errorReporting";
import { downloadInvoicePdf } from "@/lib/invoicePdf";
import type { SavedInvoice } from "@/store/invoices";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

jest.mock("@/lib/errorReporting", () => ({
  reportError: jest.fn(),
}));

const printMock = Print.printToFileAsync as jest.Mock;
const shareAvailableMock = Sharing.isAvailableAsync as jest.Mock;
const shareAsyncMock = Sharing.shareAsync as jest.Mock;

function makeInvoice(overrides: Partial<SavedInvoice> = {}): SavedInvoice {
  return {
    id: "1",
    invoiceNumber: "0001",
    clientName: "Mr Peter Abu",
    yourName: "Miss Olasubomi Akin",
    invoiceTitle: "Website Design",
    issuanceDate: "13/09/2026",
    currency: { code: "NGN", symbol: "N" },
    items: [
      { id: "1", description: "Web Design", quantity: "2", price: "3,000,000" },
    ],
    vat: "10",
    shipping: "50000",
    subtotal: 6000000,
    vatAmount: 600000,
    shippingAmount: 50000,
    total: 6650000,
    bankNumber: "0123456789",
    bankName: "Lance Bank",
    accountName: "Jane Doe",
    terms: "Net 30",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("downloadInvoicePdf", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    printMock.mockResolvedValue({ uri: "file:///mock/invoice.pdf" });
    shareAvailableMock.mockResolvedValue(true);
    shareAsyncMock.mockResolvedValue(undefined);
  });

  it("returns the generated file uri", async () => {
    const uri = await downloadInvoicePdf(makeInvoice());
    expect(uri).toBe("file:///mock/invoice.pdf");
  });

  it("includes the invoice's content in the generated HTML", async () => {
    await downloadInvoicePdf(makeInvoice());
    const html = printMock.mock.calls[0][0].html as string;
    expect(html).toContain("Mr Peter Abu");
    expect(html).toContain("Miss Olasubomi Akin");
    expect(html).toContain("Web Design");
    expect(html).toContain("0001");
  });

  it("escapes HTML-significant characters in user-entered fields", async () => {
    await downloadInvoicePdf(
      makeInvoice({ clientName: '<script>alert("x")</script>' }),
    );
    const html = printMock.mock.calls[0][0].html as string;
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("resolves as soon as the PDF is generated, without waiting for the share sheet", async () => {
    // Regression test: downloadInvoicePdf previously awaited Sharing.shareAsync
    // before resolving, so a share sheet that never completes hung the whole
    // download flow forever. It must resolve once printing is done.
    let resolveShare: () => void = () => {};
    shareAsyncMock.mockReturnValue(
      new Promise<void>((resolve) => {
        resolveShare = resolve;
      }),
    );

    const result = await downloadInvoicePdf(makeInvoice());

    expect(result).toBe("file:///mock/invoice.pdf");
    // The share promise is still pending at this point — proving the
    // function above did not wait on it.
    resolveShare();
  });

  it("calls Sharing.shareAsync with the generated uri and PDF metadata", async () => {
    await downloadInvoicePdf(makeInvoice({ invoiceNumber: "0007" }));
    await flushMicrotasks();

    expect(shareAsyncMock).toHaveBeenCalledWith(
      "file:///mock/invoice.pdf",
      expect.objectContaining({
        mimeType: "application/pdf",
        dialogTitle: "Invoice #0007",
        UTI: "com.adobe.pdf",
      }),
    );
  });

  it("does not attempt to share when sharing is unavailable on the device", async () => {
    shareAvailableMock.mockResolvedValue(false);
    await downloadInvoicePdf(makeInvoice());
    await flushMicrotasks();

    expect(shareAsyncMock).not.toHaveBeenCalled();
  });

  it("reports a background share failure without rejecting the caller", async () => {
    shareAsyncMock.mockRejectedValue(new Error("share failed"));

    await expect(downloadInvoicePdf(makeInvoice())).resolves.toBe(
      "file:///mock/invoice.pdf",
    );
    await flushMicrotasks();

    expect(reportError).toHaveBeenCalledWith(
      expect.any(Error),
      "invoicePdf:shareAsync",
    );
  });

  it("propagates a failure to generate the PDF itself", async () => {
    printMock.mockRejectedValue(new Error("disk full"));
    await expect(downloadInvoicePdf(makeInvoice())).rejects.toThrow(
      "disk full",
    );
  });
});

function flushMicrotasks() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}
