import { ErrorFallback } from "@/components/ErrorFallback";
import { fireEvent, render, screen } from "@testing-library/react-native";

describe("ErrorFallback", () => {
  it("shows the error's message", () => {
    render(<ErrorFallback error={new Error("Network request failed")} onRetry={jest.fn()} />);
    expect(screen.getByText("Network request failed")).toBeTruthy();
  });

  it("falls back to a generic message when the error has none", () => {
    render(<ErrorFallback error={new Error()} onRetry={jest.fn()} />);
    expect(screen.getByText("An unexpected error occurred.")).toBeTruthy();
  });

  it("calls onRetry when Try Again is tapped", () => {
    const onRetry = jest.fn();
    render(<ErrorFallback error={new Error("boom")} onRetry={onRetry} />);
    fireEvent.press(screen.getByText("Try Again"));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
