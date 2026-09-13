import { SuccessModal } from "@/components/SuccessModal";
import { fireEvent, render, screen } from "@testing-library/react-native";

describe("SuccessModal", () => {
  const baseProps = {
    visible: true,
    onClose: jest.fn(),
    title: "Download Successful",
    message: "Your Invoice was downloaded successfully",
    buttonLabel: "Done",
    onButtonPress: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing to interact with when not visible", () => {
    render(<SuccessModal {...baseProps} visible={false} />);
    expect(screen.queryByText("Download Successful")).toBeNull();
  });

  it("shows the title, message, and button label when visible", () => {
    render(<SuccessModal {...baseProps} />);
    expect(screen.getByText("Download Successful")).toBeTruthy();
    expect(
      screen.getByText("Your Invoice was downloaded successfully"),
    ).toBeTruthy();
    expect(screen.getByText("Done")).toBeTruthy();
  });

  it("calls onButtonPress when the action button is tapped", () => {
    render(<SuccessModal {...baseProps} />);
    fireEvent.press(screen.getByText("Done"));
    expect(baseProps.onButtonPress).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the close button is tapped", () => {
    render(<SuccessModal {...baseProps} />);
    fireEvent.press(screen.getByLabelText("Close"));
    expect(baseProps.onClose).toHaveBeenCalledTimes(1);
  });
});
