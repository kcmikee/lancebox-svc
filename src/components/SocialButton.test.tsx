import { SocialButton } from "@/components/SocialButton";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Image } from "react-native";

describe("SocialButton", () => {
  it("exposes the given accessibility label", () => {
    render(
      <SocialButton
        source={{ uri: "google.png" }}
        accessibilityLabel="Sign up with Google"
      />,
    );
    expect(screen.getByLabelText("Sign up with Google")).toBeTruthy();
  });

  it("calls onPress when tapped", () => {
    const onPress = jest.fn();
    render(
      <SocialButton
        source={{ uri: "google.png" }}
        accessibilityLabel="Sign up with Google"
        onPress={onPress}
      />,
    );
    fireEvent.press(screen.getByLabelText("Sign up with Google"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("defaults the icon to 24px", () => {
    render(
      <SocialButton
        source={{ uri: "google.png" }}
        accessibilityLabel="Sign up with Google"
      />,
    );
    const image = screen
      .getByLabelText("Sign up with Google")
      .findByType(Image);
    expect(image.props.style).toEqual({ width: 24, height: 24 });
  });

  it("uses a custom icon size when given", () => {
    render(
      <SocialButton
        source={{ uri: "facebook.png" }}
        accessibilityLabel="Sign up with Facebook"
        iconSize={32}
      />,
    );
    const image = screen
      .getByLabelText("Sign up with Facebook")
      .findByType(Image);
    expect(image.props.style).toEqual({ width: 32, height: 32 });
  });
});
