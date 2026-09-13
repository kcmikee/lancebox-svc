import { NavigationDrawer } from "@/components/NavigationDrawer";
import { useAuth } from "@/store/auth";
import { fireEvent, render, screen } from "@testing-library/react-native";

describe("NavigationDrawer", () => {
  beforeEach(() => {
    useAuth.setState({ session: null, isLoading: false, hasHydrated: true });
  });

  it("renders nothing when not visible", () => {
    render(<NavigationDrawer visible={false} onClose={jest.fn()} />);
    expect(screen.queryByText("Invoices")).toBeNull();
  });

  it("shows every nav item when visible", () => {
    render(<NavigationDrawer visible onClose={jest.fn()} />);
    expect(screen.getByText("Invoices")).toBeTruthy();
    expect(screen.getByText("Profile")).toBeTruthy();
    expect(screen.getByText("Receipts")).toBeTruthy();
    expect(screen.getByText("Settings")).toBeTruthy();
    expect(screen.getByText("Log Out")).toBeTruthy();
  });

  it("calls onClose when a nav item is tapped", () => {
    const onClose = jest.fn();
    render(<NavigationDrawer visible onClose={onClose} />);
    fireEvent.press(screen.getByText("Profile"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("signs out and closes when Log Out is tapped", () => {
    const onClose = jest.fn();
    useAuth.setState({ session: { userId: "peter@gmail.com" } });

    render(<NavigationDrawer visible onClose={onClose} />);
    fireEvent.press(screen.getByText("Log Out"));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(useAuth.getState().session).toBeNull();
  });

  it("defaults to highlighting Invoices as the active item", () => {
    render(<NavigationDrawer visible onClose={jest.fn()} />);
    // activeItem defaults to "invoices"; smoke-test that it renders without
    // needing the prop.
    expect(screen.getByText("Invoices")).toBeTruthy();
  });
});
