import { LoadingScreen } from "@/components/LoadingScreen";
import { useAuth } from "@/store/auth";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";

export default function RootLayout() {
  const session = useAuth((state) => state.session);
  const isLoading = useAuth((state) => state.isLoading);
  const [fontsLoaded] = useFonts({
    "Pretendard-Light": require("@/assets/font/Pretendard-Light.ttf"),
    "Pretendard-Regular": require("@/assets/font/Pretendard-Regular.ttf"),
    "Pretendard-Medium": require("@/assets/font/Pretendard-Medium.ttf"),
    "Pretendard-SemiBold": require("@/assets/font/Pretendard-SemiBold.ttf"),
    "Pretendard-Bold": require("@/assets/font/Pretendard-Bold.ttf"),
  });

  if (!fontsLoaded || isLoading) {
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
