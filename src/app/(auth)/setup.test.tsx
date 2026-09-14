import Setup from "@/app/(auth)/setup";
import { useAuth } from "@/store/auth";
import { useProfile } from "@/store/profile";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

describe("Setup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useLocalSearchParams as jest.Mock).mockReturnValue({});
    useProfile.setState({ logoUri: null, role: null });
    useAuth.setState({ session: null, isLoading: false, hasHydrated: true });
  });

  it("renders both role options", () => {
    render(<Setup />);
    expect(screen.getByText("As a Business Owner")).toBeTruthy();
    expect(screen.getByText("As an Individual/Freelancer")).toBeTruthy();
  });

  it("disables Proceed until a role is selected", () => {
    render(<Setup />);
    const button = screen.getByRole("button", { name: "Proceed" });
    expect(button.props.accessibilityState.disabled).toBe(true);
  });

  it("enables Proceed once a role is selected", () => {
    render(<Setup />);
    fireEvent.press(screen.getByText("As a Business Owner"));
    const button = screen.getByRole("button", { name: "Proceed" });
    expect(button.props.accessibilityState.disabled).toBe(false);
  });

  it("uploads a logo and shows the success state", async () => {
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: "file:///logo.png", mimeType: "image/png" }],
    });

    render(<Setup />);
    fireEvent.press(screen.getByText("Drag or seclect a file"));

    await waitFor(() => {
      expect(screen.getByText("Upload successful")).toBeTruthy();
    });
  });

  it("rejects an unsupported file type", async () => {
    const alertSpy = jest.spyOn(Alert, "alert");
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: "file:///logo.pdf", mimeType: "application/pdf" }],
    });

    render(<Setup />);
    fireEvent.press(screen.getByText("Drag or seclect a file"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Unsupported file",
        "Please choose a PNG or JPG image.",
      );
    });
  });

  it("prompts for access when photo library permission is denied", async () => {
    const alertSpy = jest.spyOn(Alert, "alert");
    (
      ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock
    ).mockResolvedValueOnce({ granted: false });

    render(<Setup />);
    fireEvent.press(screen.getByText("Drag or seclect a file"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Photo access needed",
        "Allow photo library access to upload a logo.",
      );
    });
  });

  it("saves the selected role and logo to the profile store on Proceed", async () => {
    jest.useFakeTimers();
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: "file:///logo.png", mimeType: "image/png" }],
    });

    render(<Setup />);
    fireEvent.press(screen.getByText("Drag or seclect a file"));
    await waitFor(() => screen.getByText("Upload successful"));

    fireEvent.press(screen.getByText("As a Business Owner"));
    fireEvent.press(screen.getByRole("button", { name: "Proceed" }));

    expect(useProfile.getState().role).toBe("business");
    expect(useProfile.getState().logoUri).toBe("file:///logo.png");

    jest.useRealTimers();
  });

  it("signs in with the email carried over from sign-up once Proceed completes", async () => {
    jest.useFakeTimers();
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      email: "peter@gmail.com",
    });
    const signIn = jest.fn();
    useAuth.setState({ signIn });

    render(<Setup />);
    fireEvent.press(screen.getByText("As an Individual/Freelancer"));
    fireEvent.press(screen.getByRole("button", { name: "Proceed" }));

    await jest.advanceTimersByTimeAsync(1200);

    expect(signIn).toHaveBeenCalledWith({ userId: "peter@gmail.com" });
    jest.useRealTimers();
  });

  it("signs in immediately when Skip for now is tapped, without a role or logo", () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      email: "peter@gmail.com",
    });
    const signIn = jest.fn();
    useAuth.setState({ signIn });

    render(<Setup />);
    fireEvent.press(screen.getByLabelText("Skip for now"));

    expect(signIn).toHaveBeenCalledWith({ userId: "peter@gmail.com" });
    expect(useProfile.getState().role).toBeNull();
    expect(useProfile.getState().logoUri).toBeNull();
  });

  it("does not sign in twice if Skip is tapped repeatedly", () => {
    const signIn = jest.fn();
    useAuth.setState({ signIn });

    render(<Setup />);
    const skipButton = screen.getByLabelText("Skip for now");
    fireEvent.press(skipButton);
    fireEvent.press(skipButton);

    expect(signIn).toHaveBeenCalledTimes(1);
  });
});
