import { ErrorFallback } from "@/components/ErrorFallback";
import { LoadingScreen } from "@/components/LoadingScreen";
import { reportError } from "@/lib/errorReporting";
import { setupGlobalErrorHandler } from "@/lib/setupGlobalErrorHandler";
import { useAuth } from "@/store/auth";
import { useFonts } from "expo-font";
import { Stack, type ErrorBoundaryProps } from "expo-router";
import { useEffect } from "react";

setupGlobalErrorHandler();

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  useEffect(() => {
    reportError(error, "root:ErrorBoundary");
  }, [error]);

  return <ErrorFallback error={error} onRetry={retry} />;
}

export default function RootLayout() {
  const session = useAuth((state) => state.session);
  const isLoading = useAuth((state) => state.isLoading);
  const hasHydrated = useAuth((state) => state.hasHydrated);
  const [fontsLoaded] = useFonts({
    "Pretendard-Light": require("@/assets/font/Pretendard-Light.ttf"),
    "Pretendard-Regular": require("@/assets/font/Pretendard-Regular.ttf"),
    "Pretendard-Medium": require("@/assets/font/Pretendard-Medium.ttf"),
    "Pretendard-SemiBold": require("@/assets/font/Pretendard-SemiBold.ttf"),
    "Pretendard-Bold": require("@/assets/font/Pretendard-Bold.ttf"),
  });

  if (!fontsLoaded || !hasHydrated || isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}
