import { FlyingLogo } from "@/components/FlyingLogo";
import { render } from "@testing-library/react-native";

const insets = { top: 44, bottom: 34, left: 0, right: 0 };

describe("FlyingLogo", () => {
  it("renders without crashing", () => {
    const result = render(<FlyingLogo insets={insets} onDone={jest.fn()} />);
    expect(result.toJSON()).toBeTruthy();
  });

  it("calls onDone once the fly-up animation finishes", async () => {
    const onDone = jest.fn();
    render(<FlyingLogo insets={insets} onDone={onDone} />);

    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("does not block touches on the screen behind it", () => {
    const result = render(<FlyingLogo insets={insets} onDone={jest.fn()} />);
    const root = result.toJSON();
    expect(Array.isArray(root) ? root[0].props : root?.props).toEqual(
      expect.objectContaining({ pointerEvents: "none" }),
    );
  });
});
