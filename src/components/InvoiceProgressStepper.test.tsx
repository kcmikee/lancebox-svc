import { InvoiceProgressStepper } from "@/components/InvoiceProgressStepper";
import { render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

describe("InvoiceProgressStepper", () => {
  it("renders all four step labels", () => {
    render(<InvoiceProgressStepper activeStep="invoice-details" />);
    expect(screen.getByText("Invoice Details")).toBeTruthy();
    expect(screen.getByText("Bank Details")).toBeTruthy();
    expect(screen.getByText("Preview Invoice")).toBeTruthy();
    expect(screen.getByText("Download Invoice/Send to client")).toBeTruthy();
  });

  it("bolds only the active step's label", () => {
    render(<InvoiceProgressStepper activeStep="bank-details" />);

    // The shared Text component maps fontWeight to a Pretendard font family,
    // so bold-ness shows up as fontFamily rather than a surviving fontWeight.
    const active = StyleSheet.flatten(screen.getByText("Bank Details").props.style);
    const inactive = StyleSheet.flatten(
      screen.getByText("Invoice Details").props.style,
    );

    expect(active.fontFamily).toBe("Pretendard-Bold");
    expect(inactive.fontFamily).toBe("Pretendard-Regular");
  });

  it("updates which step is active based on the activeStep prop", () => {
    render(<InvoiceProgressStepper activeStep="preview-invoice" />);
    const active = StyleSheet.flatten(
      screen.getByText("Preview Invoice").props.style,
    );
    expect(active.color).toBe("#1A1D1F");
  });
});
