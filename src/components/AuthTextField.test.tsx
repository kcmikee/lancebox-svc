import { AuthTextField } from "@/components/AuthTextField";
import { fireEvent, render, screen } from "@testing-library/react-native";

describe("AuthTextField", () => {
  it("renders the label and placeholder", () => {
    render(
      <AuthTextField
        label="Email Address"
        value=""
        onChangeText={jest.fn()}
        placeholder="Peter@gmail.com"
        isValid={false}
      />,
    );
    expect(screen.getByText("Email Address")).toBeTruthy();
    expect(screen.getByPlaceholderText("Peter@gmail.com")).toBeTruthy();
  });

  it("calls onChangeText as the user types", () => {
    const onChangeText = jest.fn();
    render(
      <AuthTextField
        label="Email Address"
        value=""
        onChangeText={onChangeText}
        isValid={false}
      />,
    );
    fireEvent.changeText(screen.getByDisplayValue(""), "peter@gmail.com");
    expect(onChangeText).toHaveBeenCalledWith("peter@gmail.com");
  });

  it("shows no checkmark when invalid", () => {
    render(
      <AuthTextField
        label="Email Address"
        value="not-an-email"
        onChangeText={jest.fn()}
        isValid={false}
      />,
    );
    expect(screen.queryByTestId("checkmark")).toBeNull();
  });

  it("shows an error message when given one", () => {
    render(
      <AuthTextField
        label="Email Address"
        value=""
        onChangeText={jest.fn()}
        isValid={false}
        error="Email is required"
      />,
    );
    expect(screen.getByText("Email is required")).toBeTruthy();
  });

  it("does not show an error message when valid", () => {
    render(
      <AuthTextField
        label="Email Address"
        value="peter@gmail.com"
        onChangeText={jest.fn()}
        isValid
      />,
    );
    expect(screen.queryByText(/required/i)).toBeNull();
  });

  it("masks the input when secureTextEntry is set", () => {
    render(
      <AuthTextField
        label="Password"
        value="password123"
        onChangeText={jest.fn()}
        isValid
        secureTextEntry
      />,
    );
    expect(screen.getByDisplayValue("password123").props.secureTextEntry).toBe(
      true,
    );
  });
});
