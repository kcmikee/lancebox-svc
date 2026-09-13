import { useAuth } from "@/store/auth";

describe("useAuth", () => {
  beforeEach(() => {
    useAuth.setState({ session: null, isLoading: false, hasHydrated: true });
  });

  it("starts signed out", () => {
    expect(useAuth.getState().session).toBeNull();
  });

  it("enters a loading state immediately when signing in", () => {
    useAuth.getState().signIn({ userId: "peter@gmail.com" });
    expect(useAuth.getState().isLoading).toBe(true);
    expect(useAuth.getState().session).toBeNull();
  });

  it("sets the session and clears loading after the sign-in transition", () => {
    jest.useFakeTimers();
    useAuth.getState().signIn({ userId: "peter@gmail.com" });

    jest.advanceTimersByTime(900);

    expect(useAuth.getState().session).toEqual({ userId: "peter@gmail.com" });
    expect(useAuth.getState().isLoading).toBe(false);
    jest.useRealTimers();
  });

  it("does not sign in early, before the transition completes", () => {
    jest.useFakeTimers();
    useAuth.getState().signIn({ userId: "peter@gmail.com" });

    jest.advanceTimersByTime(899);

    expect(useAuth.getState().session).toBeNull();
    jest.useRealTimers();
  });

  it("clears the session on sign out", () => {
    useAuth.setState({ session: { userId: "peter@gmail.com" } });
    useAuth.getState().signOut();
    expect(useAuth.getState().session).toBeNull();
  });
});
