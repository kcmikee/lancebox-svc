import { useProfile } from "@/store/profile";

describe("useProfile", () => {
  beforeEach(() => {
    useProfile.setState({ logoUri: null, role: null });
  });

  it("starts with no logo or role", () => {
    expect(useProfile.getState().logoUri).toBeNull();
    expect(useProfile.getState().role).toBeNull();
  });

  it("stores the selected logo uri", () => {
    useProfile.getState().setLogoUri("file:///logo.png");
    expect(useProfile.getState().logoUri).toBe("file:///logo.png");
  });

  it("allows clearing the logo uri", () => {
    useProfile.getState().setLogoUri("file:///logo.png");
    useProfile.getState().setLogoUri(null);
    expect(useProfile.getState().logoUri).toBeNull();
  });

  it("stores the selected role", () => {
    useProfile.getState().setRole("business");
    expect(useProfile.getState().role).toBe("business");
  });

  it("allows switching roles", () => {
    useProfile.getState().setRole("business");
    useProfile.getState().setRole("individual");
    expect(useProfile.getState().role).toBe("individual");
  });
});
