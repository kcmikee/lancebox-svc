import BankDetails from "@/app/(app)/invoice/bank-details";
import { useInvoiceDraft } from "@/store/invoiceDraft";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";

describe("BankDetails", () => {
  beforeEach(() => {
    useInvoiceDraft.getState().reset();
    jest.clearAllMocks();
  });

  it("renders every bank details field", () => {
    render(<BankDetails />);
    expect(screen.getByText("Bank Number")).toBeTruthy();
    expect(screen.getByText("Name of Bank")).toBeTruthy();
    expect(screen.getByText("Name of Account")).toBeTruthy();
    expect(screen.getByText("Terms of Payment")).toBeTruthy();
  });

  it("navigates back when the close button is tapped", () => {
    render(<BankDetails />);
    fireEvent.press(screen.getByLabelText("Close"));
    expect(router.back).toHaveBeenCalledTimes(1);
  });

  it("pre-fills fields from a previously saved draft", () => {
    useInvoiceDraft.getState().setDraft({ bankName: "Lance Bank" });
    render(<BankDetails />);
    expect(screen.getByDisplayValue("Lance Bank")).toBeTruthy();
  });

  it("shows validation errors when trying to proceed with empty fields", async () => {
    render(<BankDetails />);
    fireEvent.press(screen.getByRole("button", { name: "Preview Invoice" }));

    await waitFor(() => {
      expect(screen.getByText("Bank number is required")).toBeTruthy();
      expect(screen.getByText("Bank name is required")).toBeTruthy();
      expect(screen.getByText("Account name is required")).toBeTruthy();
    });
  });

  it("rejects a bank number containing letters", async () => {
    render(<BankDetails />);
    fireEvent.changeText(
      screen.getByPlaceholderText("Enter your Bank Number"),
      "12ab56789",
    );
    fireEvent(screen.getByPlaceholderText("Enter your Bank Number"), "blur");

    await waitFor(() => {
      expect(
        screen.getByText("Enter a valid bank number (digits only)"),
      ).toBeTruthy();
    });
  });

  it("does not navigate while the form is invalid", () => {
    render(<BankDetails />);
    fireEvent.press(screen.getByRole("button", { name: "Preview Invoice" }));
    expect(router.push).not.toHaveBeenCalled();
  });

  it("autosaves every keystroke into the invoice draft store", () => {
    render(<BankDetails />);
    fireEvent.changeText(
      screen.getByPlaceholderText("Enter your Bank Name"),
      "Lance Bank",
    );
    expect(useInvoiceDraft.getState().bankName).toBe("Lance Bank");
  });

  it("proceeds to preview once every required field is valid", async () => {
    render(<BankDetails />);
    fireEvent.changeText(
      screen.getByPlaceholderText("Enter your Bank Number"),
      "0123456789",
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Enter your Bank Name"),
      "Lance Bank",
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Enter the Name on Account"),
      "Jane Doe",
    );

    fireEvent.press(screen.getByRole("button", { name: "Preview Invoice" }));

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith("/invoice/preview");
    });
  });
});
