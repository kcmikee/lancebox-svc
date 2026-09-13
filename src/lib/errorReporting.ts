export function reportError(error: unknown, context?: string) {
  const normalized = error instanceof Error ? error : new Error(String(error));
  const label = context ? `[${context}]` : "[error]";

  if (__DEV__) {
    console.error(label, normalized);
  } else {
    console.error(label, normalized.message);
  }
}
