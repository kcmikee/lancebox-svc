import { Text } from "@/components/Text";
import { render, screen } from "@testing-library/react-native";

describe("Text", () => {
  it("renders its children", () => {
    render(<Text>Hello LanceBox</Text>);
    expect(screen.getByText("Hello LanceBox")).toBeTruthy();
  });

  it("defaults to the regular Pretendard weight", () => {
    render(<Text>Body copy</Text>);
    const node = screen.getByText("Body copy");
    expect(node.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fontFamily: "Pretendard-Regular" }),
      ]),
    );
  });

  it.each([
    ["300", "Pretendard-Light"],
    ["400", "Pretendard-Regular"],
    ["500", "Pretendard-Medium"],
    ["600", "Pretendard-SemiBold"],
    ["700", "Pretendard-Bold"],
    ["bold", "Pretendard-Bold"],
  ])("maps fontWeight %s to %s", (fontWeight, expectedFamily) => {
    render(<Text style={{ fontWeight: fontWeight as never }}>Weighted</Text>);
    const node = screen.getByText("Weighted");
    expect(node.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fontFamily: expectedFamily }),
      ]),
    );
  });

  it("falls back to regular for an unmapped weight", () => {
    render(<Text style={{ fontWeight: "900" }}>Heavy</Text>);
    const node = screen.getByText("Heavy");
    expect(node.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fontFamily: "Pretendard-Regular" }),
      ]),
    );
  });

  it("strips the numeric fontWeight so the OS does not fake-bold the custom font", () => {
    render(<Text style={{ fontWeight: "700" }}>Bold</Text>);
    const node = screen.getByText("Bold");
    expect(node.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fontWeight: undefined }),
      ]),
    );
  });
});
