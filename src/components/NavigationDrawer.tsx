import { Text } from "@/components/Text";
import { useAuth } from "@/store/auth";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type DrawerItemKey = "invoices" | "profile" | "receipts" | "settings";

type NavigationDrawerProps = {
  visible: boolean;
  onClose: () => void;
  activeItem?: DrawerItemKey;
};

const NAV_ITEMS: {
  key: DrawerItemKey;
  label: string;
  icon: number;
}[] = [
  {
    key: "invoices",
    label: "Invoices",
    icon: require("@/assets/images/icons/browser.png"),
  },
  {
    key: "profile",
    label: "Profile",
    icon: require("@/assets/images/icons/user-square.png"),
  },
  {
    key: "receipts",
    label: "Receipts",
    icon: require("@/assets/images/icons/receipt.png"),
  },
  {
    key: "settings",
    label: "Settings",
    icon: require("@/assets/images/icons/settings-02.png"),
  },
];

const PANEL_WIDTH = Math.min(Dimensions.get("window").width * 0.64, 255);
const ANIMATION_DURATION = 260;

export function NavigationDrawer({
  visible,
  onClose,
  activeItem = "invoices",
}: NavigationDrawerProps) {
  const signOut = useAuth((state) => state.signOut);
  const [isMounted, setIsMounted] = useState(visible);
  const [prevVisible, setPrevVisible] = useState(visible);
  const progress = useSharedValue(visible ? 1 : 0);

  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) {
      setIsMounted(true);
    }
  }

  useEffect(() => {
    if (visible) {
      progress.value = withTiming(1, { duration: ANIMATION_DURATION });
    } else if (isMounted) {
      progress.value = withTiming(
        0,
        { duration: ANIMATION_DURATION },
        (finished) => {
          if (finished) {
            runOnJS(setIsMounted)(false);
          }
        },
      );
    }
  }, [visible, isMounted, progress]);

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: (progress.value - 1) * PANEL_WIDTH }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  if (!isMounted) {
    return null;
  }

  return (
    <Modal visible animationType="none" transparent onRequestClose={onClose}>
      <SafeAreaProvider>
        <View style={styles.overlay}>
          <Animated.View style={[styles.backdrop, backdropStyle]}>
            <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
          </Animated.View>

          <Animated.View style={[styles.panel, panelStyle]}>
            <SafeAreaView style={styles.panelInner} edges={["top", "bottom"]}>
              <Pressable style={styles.closeButton} onPress={onClose}>
                <Image
                  source={require("@/assets/images/icons/x-close.png")}
                  style={styles.closeIcon}
                  resizeMode="contain"
                />
              </Pressable>

              <Image
                source={require("@/assets/images/icons/lancebox.png")}
                style={styles.logo}
                resizeMode="contain"
              />

              <View style={styles.navList}>
                {NAV_ITEMS.map((item) => {
                  const isActive = item.key === activeItem;
                  return (
                    <Pressable
                      key={item.key}
                      style={[styles.navItem, isActive && styles.navItemActive]}
                      onPress={onClose}
                    >
                      <Image
                        source={item.icon}
                        style={styles.navIcon}
                        resizeMode="contain"
                      />
                      <Text style={styles.navLabel}>{item.label}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.spacer} />

              <Pressable
                style={styles.logOutItem}
                onPress={() => {
                  onClose();
                  signOut();
                }}
              >
                <Image
                  source={require("@/assets/images/icons/log-out-01.png")}
                  style={styles.navIcon}
                  resizeMode="contain"
                />
                <Text style={styles.navLabel}>Log Out</Text>
              </Pressable>
            </SafeAreaView>
          </Animated.View>
        </View>
      </SafeAreaProvider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  panel: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: PANEL_WIDTH,
  },
  panelInner: {
    flex: 1,
    backgroundColor: "#0D3B66",
  },
  closeButton: {
    alignSelf: "flex-start",
    marginTop: 16,
    marginLeft: 24,
    padding: 4,
  },
  closeIcon: {
    width: 22,
    height: 22,
    tintColor: "#FFFFFF",
  },
  logo: {
    width: 150,
    height: 21,
    marginTop: 20,
    marginLeft: 24,
  },
  navList: {
    marginTop: 53,
  },
  spacer: {
    flex: 1,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  navItemActive: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderLeftWidth: 3,
    borderLeftColor: "#4A90F7",
  },
  navIcon: {
    width: 20,
    height: 20,
    tintColor: "#FFFFFF",
  },
  navLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  logOutItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginBottom: 12,
  },
});
