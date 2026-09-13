import PreviewInvoice from "@/app/(app)/invoice/preview";
import { downloadInvoicePdf } from "@/lib/invoicePdf";
import { useInvoiceDraft } from "@/store/invoiceDraft";
import { useInvoices } from "@/store/invoices";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";
import { Alert } from "react-native";

jest.mock("@/lib/invoicePdf", () => ({
  downloadInvoicePdf: jest.fn(async () => "file:///mock/invoice.pdf"),
}));

const FULL_DRAFT = {
  clientName: "Mr Peter Abu",
  yourName: "Miss Olasubomi Akin",
  invoiceTitle: "Website Design",
  items: [
    { id: "1", description: "Web Design", quantity: "2", price: "3,000,000" },
  ],
  vat: "10",
  shipping: "50000",
  currency: { code: "NGN", symbol: "N" },
  bankNumber: "0123456789",
  bankName: "Lance Bank",
  accountName: "Jane Doe",
  terms: "Net 30",
};

describe("PreviewInvoice", () => {
  beforeEach(() => {
    useInvoiceDraft.getState().reset();
    useInvoiceDraft.getState().setDraft(FULL_DRAFT);
    useInvoices.setState({ invoices: [], hasHydrated: true });
    jest.clearAllMocks();
  });

  it("renders the real client, issuer, and item data from the draft", () => {
    render(<PreviewInvoice />);
    expect(screen.getByText("Mr Peter Abu")).toBeTruthy();
    expect(screen.getByText("Miss Olasubomi Akin")).toBeTruthy();
    expect(screen.getByText("Web Design")).toBeTruthy();
  });

  it("computes and displays the real total", () => {
    render(<PreviewInvoice />);
    // subtotal 6,000,000 + 10% VAT (600,000) + 50,000 shipping = 6,650,000
    expect(screen.getByText("N6,650,000.00")).toBeTruthy();
  });

  it("shows the next invoice number based on how many are already saved", () => {
    useInvoices.getState().addInvoice({
      id: "existing",
      invoiceNumber: "0001",
      clientName: "",
      yourName: "",
      invoiceTitle: "",
      issuanceDate: "",
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
    });
    render(<PreviewInvoice />);
    expect(screen.getByText(/#0002/)).toBeTruthy();
  });

  it("navigates back when the close button is tapped", () => {
    render(<PreviewInvoice />);
    fireEvent.press(screen.getByLabelText("Close"));
    expect(router.back).toHaveBeenCalledTimes(1);
  });

  it("saves the invoice, downloads the PDF, and shows success when Yes is chosen", async () => {
    render(<PreviewInvoice />);
    fireEvent.press(screen.getByText("Download Pdf"));
    fireEvent.press(screen.getByText("Yes"));

    await waitFor(() => {
      expect(downloadInvoicePdf).toHaveBeenCalledTimes(1);
      expect(useInvoices.getState().invoices).toHaveLength(1);
      expect(screen.getByText("Success")).toBeTruthy();
    });
  });

  it("clears the draft once the invoice is saved", async () => {
    render(<PreviewInvoice />);
    fireEvent.press(screen.getByText("Download Pdf"));
    fireEvent.press(screen.getByText("Yes"));

    await waitFor(() => {
      expect(useInvoiceDraft.getState().clientName).toBe("");
    });
  });

  it("downloads without saving when No is chosen", async () => {
    render(<PreviewInvoice />);
    fireEvent.press(screen.getByText("Download Pdf"));
    fireEvent.press(screen.getByText("No"));

    await waitFor(() => {
      expect(downloadInvoicePdf).toHaveBeenCalledTimes(1);
      expect(screen.getByText("Download Successful")).toBeTruthy();
    });
    expect(useInvoices.getState().invoices).toHaveLength(0);
  });

  it("returns home after closing the download-only success modal", async () => {
    render(<PreviewInvoice />);
    fireEvent.press(screen.getByText("Download Pdf"));
    fireEvent.press(screen.getByText("No"));
    await waitFor(() => screen.getByText("Download Successful"));

    fireEvent.press(screen.getByText("Done"));

    expect(router.push).toHaveBeenCalledWith("/");
  });

  it("shows an alert and does not save when PDF generation fails", async () => {
    const alertSpy = jest.spyOn(Alert, "alert");
    (downloadInvoicePdf as jest.Mock).mockRejectedValueOnce(
      new Error("disk full"),
    );

    render(<PreviewInvoice />);
    fireEvent.press(screen.getByText("Download Pdf"));
    fireEvent.press(screen.getByText("Yes"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalled();
    });
    expect(useInvoices.getState().invoices).toHaveLength(0);
  });
});
