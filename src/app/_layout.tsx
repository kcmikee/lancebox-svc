import { Stack } from "expo-router";
import { useAuth } from "@/store/auth";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function RootLayout() {
  const session = useAuth((state) => state.session);
  const isLoading = useAuth((state) => state.isLoading);

  if (isLoading) {
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
