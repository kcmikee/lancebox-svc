import InvoiceDetails from "@/app/(app)/invoice/index";
import { useInvoiceDraft } from "@/store/invoiceDraft";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";

describe("InvoiceDetails", () => {
  beforeEach(() => {
    useInvoiceDraft.getState().reset();
    jest.clearAllMocks();
  });

  it("starts with a single blank item row", () => {
    render(<InvoiceDetails />);
    expect(screen.getByText("Item Description")).toBeTruthy();
    expect(screen.queryAllByText("Item Description")).toHaveLength(1);
  });

  it("navigates back when the close button is tapped", () => {
    render(<InvoiceDetails />);
    fireEvent.press(screen.getByLabelText("Close"));
    expect(router.back).toHaveBeenCalledTimes(1);
  });

  it("adds another item row when Add New Item is tapped", () => {
    render(<InvoiceDetails />);
    fireEvent.press(screen.getByText("Add New Item"));
    expect(screen.queryAllByText("Item Description")).toHaveLength(2);
  });

  it("removes an item row when its delete button is tapped", () => {
    render(<InvoiceDetails />);
    fireEvent.press(screen.getByText("Add New Item"));
    expect(screen.queryAllByText("Item Description")).toHaveLength(2);

    const [firstDelete] = screen.getAllByLabelText(/delete item/i) as never[];
    fireEvent.press(firstDelete);
    expect(screen.queryAllByText("Item Description")).toHaveLength(1);
  });

  it("does not allow deleting the only remaining item", () => {
    render(<InvoiceDetails />);
    expect(screen.queryAllByLabelText(/delete item/i)).toHaveLength(0);
  });

  it("opens the currency picker and selects a currency", async () => {
    render(<InvoiceDetails />);
    fireEvent.press(screen.getByText("Select"));

    await waitFor(() => {
      expect(screen.getByText("$ USD")).toBeTruthy();
    });
    fireEvent.press(screen.getByText("$ USD"));

    await waitFor(() => {
      expect(screen.getByText("USD")).toBeTruthy();
    });
  });

  it("computes the subtotal, VAT, and total from the item and VAT fields", () => {
    render(<InvoiceDetails />);
    fireEvent.changeText(
      screen.getByPlaceholderText("e.g 2.00"),
      "2",
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("e.g 3,000,000.00"),
      "1000",
    );
    fireEvent.changeText(screen.getByTestId("vat-input"), "10");

    expect(screen.getByText("N 2,000.00")).toBeTruthy();
  });

  it("shows validation errors when submitting with empty required fields", async () => {
    render(<InvoiceDetails />);
    fireEvent.press(screen.getByRole("button", { name: "Next" }));

    await waitFor(() => {
      expect(screen.getByText("Client's name is required")).toBeTruthy();
      expect(screen.getByText("Your name is required")).toBeTruthy();
      expect(screen.getByText("Invoice title is required")).toBeTruthy();
      expect(screen.getByText("Select a currency")).toBeTruthy();
      expect(screen.getByText("Description is required")).toBeTruthy();
    });
    expect(router.push).not.toHaveBeenCalled();
  });

  it("autosaves field changes into the invoice draft store", () => {
    render(<InvoiceDetails />);
    fireEvent.changeText(
      screen.getByPlaceholderText("Enter Client's Name"),
      "Mr Peter Abu",
    );
    expect(useInvoiceDraft.getState().clientName).toBe("Mr Peter Abu");
  });

  it("proceeds to bank details once the form is fully valid", async () => {
    render(<InvoiceDetails />);

    fireEvent.changeText(
      screen.getByPlaceholderText("Enter Client's Name"),
      "Mr Peter Abu",
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Enter Your Name"),
      "Miss Olasubomi Akin",
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Enter Invoice Title"),
      "Website Design",
    );
    fireEvent.press(screen.getByText("Select"));
    await waitFor(() => screen.getByText("N NGN"));
    fireEvent.press(screen.getByText("N NGN"));

    fireEvent.changeText(
      screen.getByPlaceholderText("Enter a description"),
      "Web Design",
    );
    fireEvent.changeText(screen.getByPlaceholderText("e.g 2.00"), "1");
    fireEvent.changeText(
      screen.getByPlaceholderText("e.g 3,000,000.00"),
      "1000",
    );

    fireEvent.press(screen.getByRole("button", { name: "Next" }));

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith("/invoice/bank-details");
    });
  });
});
