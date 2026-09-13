import Home from "@/app/(app)/index";
import { downloadInvoicePdf } from "@/lib/invoicePdf";
import { useInvoices, type SavedInvoice } from "@/store/invoices";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";

jest.mock("@/lib/invoicePdf", () => ({
  downloadInvoicePdf: jest.fn(async () => "file:///mock/invoice.pdf"),
}));

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
    total: 6650000,
    bankNumber: "",
    bankName: "",
    accountName: "",
    terms: "",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("Home", () => {
  beforeEach(() => {
    useInvoices.setState({ invoices: [], hasHydrated: true });
    jest.clearAllMocks();
  });

  it("shows the empty state when there are no saved invoices", () => {
    render(<Home />);
    expect(
      screen.getByText(/don't have any Invoice history yet/i),
    ).toBeTruthy();
  });

  it("shows a zero invoice count when there are no saved invoices", () => {
    render(<Home />);
    expect(screen.getByText("0")).toBeTruthy();
  });

  it("navigates to the invoice flow when Create New Invoice is tapped", () => {
    render(<Home />);
    fireEvent.press(screen.getByText("Create New Invoice"));
    expect(router.push).toHaveBeenCalledWith("/invoice");
  });

  it("lists saved invoices instead of the empty state once one exists", () => {
    useInvoices.getState().addInvoice(makeInvoice());
    render(<Home />);

    expect(screen.queryByText(/don't have any Invoice history/i)).toBeNull();
    expect(screen.getByText("Mr Peter Abu")).toBeTruthy();
    expect(screen.getByText(/#0001/)).toBeTruthy();
  });

  it("reflects the real invoice count in the stats card", () => {
    useInvoices.getState().addInvoice(makeInvoice({ id: "1" }));
    useInvoices.getState().addInvoice(makeInvoice({ id: "2" }));
    render(<Home />);
    expect(screen.getByText("2")).toBeTruthy();
  });

  it("falls back to a placeholder name for an invoice with no client name", () => {
    useInvoices.getState().addInvoice(makeInvoice({ clientName: "" }));
    render(<Home />);
    expect(screen.getByText("Untitled invoice")).toBeTruthy();
  });

  it("re-downloads a saved invoice's PDF when its download button is tapped", async () => {
    const invoice = makeInvoice();
    useInvoices.getState().addInvoice(invoice);
    render(<Home />);

    fireEvent.press(screen.getByTestId(`redownload-${invoice.id}`));

    await waitFor(() => {
      expect(downloadInvoicePdf).toHaveBeenCalledWith(invoice);
    });
  });
});
