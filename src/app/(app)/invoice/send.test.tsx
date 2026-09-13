import SendInvoice from "@/app/(app)/invoice/send";
import { downloadInvoicePdf } from "@/lib/invoicePdf";
import { useInvoiceDraft } from "@/store/invoiceDraft";
import { useInvoices } from "@/store/invoices";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";
import { Alert } from "react-native";

jest.mock("@/lib/invoicePdf", () => ({
  downloadInvoicePdf: jest.fn(async () => "file:///mock/invoice.pdf"),
}));

describe("SendInvoice", () => {
  beforeEach(() => {
    useInvoiceDraft.getState().reset();
    useInvoiceDraft.getState().setDraft({ clientName: "Mr Peter Abu" });
    useInvoices.setState({ invoices: [], hasHydrated: true });
    jest.clearAllMocks();
  });

  it("renders both the download and send options", () => {
    render(<SendInvoice />);
    expect(screen.getByText("Download invoice")).toBeTruthy();
    expect(screen.getByText("Send to client")).toBeTruthy();
  });

  it("navigates back when Back is tapped", () => {
    render(<SendInvoice />);
    fireEvent.press(screen.getByText("Back"));
    expect(router.back).toHaveBeenCalledTimes(1);
  });

  it("generates the PDF, saves the invoice, and returns home when Download invoice is tapped", async () => {
    render(<SendInvoice />);
    fireEvent.press(screen.getByText("Download invoice"));

    await waitFor(() => {
      expect(downloadInvoicePdf).toHaveBeenCalledTimes(1);
      expect(useInvoices.getState().invoices).toHaveLength(1);
      expect(router.replace).toHaveBeenCalledWith("/");
    });
  });

  it("generates the PDF, saves the invoice, and returns home when Send to client is tapped", async () => {
    render(<SendInvoice />);
    fireEvent.press(screen.getByText("Send to client"));

    await waitFor(() => {
      expect(downloadInvoicePdf).toHaveBeenCalledTimes(1);
      expect(useInvoices.getState().invoices).toHaveLength(1);
      expect(router.replace).toHaveBeenCalledWith("/");
    });
  });

  it("clears the draft once the invoice is finalized", async () => {
    render(<SendInvoice />);
    fireEvent.press(screen.getByText("Download invoice"));

    await waitFor(() => {
      expect(useInvoiceDraft.getState().clientName).toBe("");
    });
  });

  it("shows an alert and does not save when PDF generation fails", async () => {
    const alertSpy = jest.spyOn(Alert, "alert");
    (downloadInvoicePdf as jest.Mock).mockRejectedValueOnce(
      new Error("disk full"),
    );

    render(<SendInvoice />);
    fireEvent.press(screen.getByText("Download invoice"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalled();
    });
    expect(useInvoices.getState().invoices).toHaveLength(0);
    expect(router.replace).not.toHaveBeenCalled();
  });
});
