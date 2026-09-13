import SignUp from "@/app/(auth)/sign-up";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { router } from "expo-router";

describe("SignUp", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the email, password, and confirm password fields", () => {
    render(<SignUp />);
    expect(screen.getByText("Email Address")).toBeTruthy();
    expect(screen.getByText("Password")).toBeTruthy();
    expect(screen.getByText("Confirm Password")).toBeTruthy();
  });

  it("navigates back when Back is tapped", () => {
    render(<SignUp />);
    fireEvent.press(screen.getByText("Back"));
    expect(router.back).toHaveBeenCalledTimes(1);
  });

  it("shows every field's validation error when submitting empty", async () => {
    render(<SignUp />);
    fireEvent.press(screen.getByText("Sign Up"));

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeTruthy();
      expect(screen.getByText("Password is required")).toBeTruthy();
      expect(screen.getByText("Please confirm your password")).toBeTruthy();
    });
  });

  it("shows a mismatch error when the passwords differ", async () => {
    render(<SignUp />);
    fireEvent.changeText(
      screen.getByPlaceholderText("Peter@gmail.com"),
      "peter@gmail.com",
    );
    fireEvent.changeText(screen.getByPlaceholderText("Password"), "password123");
    fireEvent.changeText(
      screen.getByPlaceholderText("Confirm password"),
      "different123",
    );

    fireEvent.press(screen.getByText("Sign Up"));

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeTruthy();
    });
  });

  it("does not attempt to navigate while the form is invalid", async () => {
    render(<SignUp />);
    fireEvent.press(screen.getByText("Sign Up"));

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeTruthy();
    });
    expect(router.replace).not.toHaveBeenCalled();
  });

  it("submits and navigates to setup once the form is valid", async () => {
    jest.useFakeTimers();
    render(<SignUp />);

    fireEvent.changeText(
      screen.getByPlaceholderText("Peter@gmail.com"),
      "peter@gmail.com",
    );
    fireEvent.changeText(screen.getByPlaceholderText("Password"), "password123");
    fireEvent.changeText(
      screen.getByPlaceholderText("Confirm password"),
      "password123",
    );

    fireEvent.press(screen.getByText("Sign Up"));

    // Formik's onSubmit awaits a 1200ms fake "API call" before flipping to
    // the loading screen, which then holds for HOLD_DURATION_MS (1500ms)
    // before navigating.
    await act(() => jest.advanceTimersByTimeAsync(1200));
    await act(() => jest.advanceTimersByTimeAsync(1500));

    expect(router.replace).toHaveBeenCalledWith({
      pathname: "/setup",
      params: { email: "peter@gmail.com", fly: "1" },
    });

    jest.useRealTimers();
  });
});
