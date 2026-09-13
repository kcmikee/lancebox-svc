import { LoadingScreen } from "@/components/LoadingScreen";
import { render } from "@testing-library/react-native";

describe("LoadingScreen", () => {
  it("renders without crashing", () => {
    const result = render(<LoadingScreen />);
    expect(result.toJSON()).toBeTruthy();
  });
});
