import { Button } from "@/components/Button";
import { fireEvent, render, screen } from "@testing-library/react-native";

describe("Button", () => {
  it("renders its label", () => {
    render(<Button label="Sign Up" />);
    expect(screen.getByText("Sign Up")).toBeTruthy();
  });

  it("calls onPress when tapped", () => {
    const onPress = jest.fn();
    render(<Button label="Sign Up" onPress={onPress} />);
    fireEvent.press(screen.getByText("Sign Up"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("does not call onPress when disabled", () => {
    const onPress = jest.fn();
    render(<Button label="Sign Up" onPress={onPress} disabled />);
    fireEvent.press(screen.getByRole("button"));
    expect(onPress).not.toHaveBeenCalled();
  });

  it("shows the loading label and spinner instead of the normal label while loading", () => {
    render(
      <Button label="Sign Up" loadingLabel="Signing Up" isLoading />,
    );
    expect(screen.getByText("Signing Up")).toBeTruthy();
    expect(screen.queryByText("Sign Up")).toBeNull();
  });

  it("falls back to the normal label while loading if no loadingLabel is given", () => {
    render(<Button label="Sign Up" isLoading />);
    expect(screen.getByText("Sign Up")).toBeTruthy();
  });

  it("does not call onPress while loading", () => {
    const onPress = jest.fn();
    render(<Button label="Sign Up" onPress={onPress} isLoading />);
    fireEvent.press(screen.getByRole("button"));
    expect(onPress).not.toHaveBeenCalled();
  });

  it("exposes disabled and busy accessibility state while loading", () => {
    render(<Button label="Sign Up" isLoading />);
    const button = screen.getByRole("button");
    expect(button.props.accessibilityState).toEqual(
      expect.objectContaining({ disabled: true, busy: true }),
    );
  });
});
