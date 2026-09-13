import { ConfirmModal } from "@/components/ConfirmModal";
import { fireEvent, render, screen } from "@testing-library/react-native";

describe("ConfirmModal", () => {
  const baseProps = {
    visible: true,
    onClose: jest.fn(),
    title: "Save Invoice",
    message: "Would you like to save your invoice to be able to edit it later?",
    primaryLabel: "Yes",
    secondaryLabel: "No",
    onPrimaryPress: jest.fn(),
    onSecondaryPress: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing to interact with when not visible", () => {
    render(<ConfirmModal {...baseProps} visible={false} />);
    expect(screen.queryByText("Save Invoice")).toBeNull();
  });

  it("shows the title and message when visible", () => {
    render(<ConfirmModal {...baseProps} />);
    expect(screen.getByText("Save Invoice")).toBeTruthy();
    expect(
      screen.getByText(
        "Would you like to save your invoice to be able to edit it later?",
      ),
    ).toBeTruthy();
  });

  it("calls onPrimaryPress when the primary button is tapped", () => {
    render(<ConfirmModal {...baseProps} />);
    fireEvent.press(screen.getByText("Yes"));
    expect(baseProps.onPrimaryPress).toHaveBeenCalledTimes(1);
    expect(baseProps.onSecondaryPress).not.toHaveBeenCalled();
  });

  it("calls onSecondaryPress when the secondary button is tapped", () => {
    render(<ConfirmModal {...baseProps} />);
    fireEvent.press(screen.getByText("No"));
    expect(baseProps.onSecondaryPress).toHaveBeenCalledTimes(1);
    expect(baseProps.onPrimaryPress).not.toHaveBeenCalled();
  });

  it("calls onClose when the close button is tapped", () => {
    render(<ConfirmModal {...baseProps} />);
    fireEvent.press(screen.getByLabelText("Close"));
    expect(baseProps.onClose).toHaveBeenCalledTimes(1);
  });
});
