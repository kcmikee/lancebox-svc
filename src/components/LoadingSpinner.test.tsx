import { LoadingSpinner } from "@/components/LoadingSpinner";
import { render } from "@testing-library/react-native";

describe("LoadingSpinner", () => {
  it("renders without crashing", () => {
    const result = render(<LoadingSpinner />);
    expect(result.toJSON()).toBeTruthy();
  });
});
