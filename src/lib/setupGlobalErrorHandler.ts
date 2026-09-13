import type { ErrorUtils as ErrorUtilsType } from "react-native";
import { reportError } from "@/lib/errorReporting";

let installed = false;

export function setupGlobalErrorHandler() {
  if (installed) {
    return;
  }
  installed = true;

  const errorUtils = (globalThis as unknown as { ErrorUtils: ErrorUtilsType })
    .ErrorUtils;
  const previousHandler = errorUtils.getGlobalHandler();

  errorUtils.setGlobalHandler((error, isFatal) => {
    reportError(error, isFatal ? "fatal" : "non-fatal");
    previousHandler(error, isFatal);
  });
}
