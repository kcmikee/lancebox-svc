import { reportError } from "@/lib/errorReporting";

function setDev(value: boolean) {
  (globalThis as unknown as { __DEV__: boolean }).__DEV__ = value;
}

describe("reportError", () => {
  let consoleErrorSpy: jest.SpyInstance;
  const originalDev = __DEV__;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    setDev(originalDev);
  });

  it("logs an Error instance as-is in dev", () => {
    setDev(true);
    const error = new Error("boom");
    reportError(error, "test:context");
    expect(consoleErrorSpy).toHaveBeenCalledWith("[test:context]", error);
  });

  it("normalizes a non-Error value into an Error", () => {
    setDev(true);
    reportError("just a string");
    const [, loggedValue] = consoleErrorSpy.mock.calls[0];
    expect(loggedValue).toBeInstanceOf(Error);
    expect(loggedValue.message).toBe("just a string");
  });

  it("uses a generic label when no context is given", () => {
    setDev(true);
    reportError(new Error("boom"));
    expect(consoleErrorSpy.mock.calls[0][0]).toBe("[error]");
  });

  it("logs only the message (not the full Error object) outside dev", () => {
    setDev(false);
    const error = new Error("boom");
    reportError(error, "prod:context");
    expect(consoleErrorSpy).toHaveBeenCalledWith("[prod:context]", "boom");
  });
});
