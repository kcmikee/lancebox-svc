import { NavigationDrawer } from "@/components/NavigationDrawer";
import { Text } from "@/components/Text";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <Pressable
          style={styles.menuButton}
          onPress={() => setIsDrawerVisible(true)}
        >
          <Image
            source={require("@/assets/images/icons/menu-01.png")}
            style={styles.menuIcon}
            resizeMode="contain"
          />
        </Pressable>

        <NavigationDrawer
          visible={isDrawerVisible}
          onClose={() => setIsDrawerVisible(false)}
          activeItem="invoices"
        />

        <Text style={styles.heading}>Welcome Subomi!</Text>
        <Text style={styles.subheading}>What will you like to do now?</Text>

        <View style={styles.cardsRow}>
          <Pressable
            style={[styles.card, styles.createCard]}
            onPress={() => router.push("/invoice")}
          >
            <Image
              source={require("@/assets/images/icons/plus.png")}
              style={styles.plusIcon}
              resizeMode="contain"
            />
            <Text style={styles.createCardTitle}>Create New Invoice</Text>
            <Text style={styles.createCardSubtitle}>
              Create a quick Invoice to send
            </Text>
          </Pressable>

          <View style={[styles.card, styles.statsCard]}>
            <Text style={styles.statsCardLabel}>Invoices created</Text>
            <Text style={styles.statsCardValue}>0</Text>
            <View style={styles.viewAllRow}>
              <Text style={styles.viewAllText}>View All</Text>
              <Image
                source={require("@/assets/images/icons/chevron-right.png")}
                style={styles.viewAllChevron}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        <Text style={styles.pastInvoicesHeading}>Past Invoices</Text>

        <View style={styles.illustrationContainer}>
          <View style={styles.circleBox}>
            <View style={styles.circle} />

            <View style={[styles.skeletonCard, styles.skeletonCardTop]}>
              <View style={styles.skeletonIconCircle}>
                <Image
                  source={require("@/assets/images/icons/bx-search.png")}
                  style={styles.skeletonIcon}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.skeletonLines}>
                <View style={[styles.skeletonBar, styles.skeletonBarDark]} />
                <View style={[styles.skeletonBar, styles.skeletonBarLight]} />
              </View>
            </View>

            <View style={[styles.skeletonCard, styles.skeletonCardBottom]}>
              <View style={styles.skeletonIconCircle}>
                <Image
                  source={require("@/assets/images/icons/bx-search.png")}
                  style={styles.skeletonIcon}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.skeletonLines}>
                <View style={[styles.skeletonBar, styles.skeletonBarDark]} />
                <View style={[styles.skeletonBar, styles.skeletonBarLight]} />
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.emptyStateText}>
          You don&apos;t have any Invoice history yet. Click the button below to
          Create your first invoice
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  menuButton: {
    alignSelf: "flex-start",
    paddingVertical: 6,
  },
  menuIcon: {
    width: 22,
    height: 16,
  },
  heading: {
    fontSize: 21,
    fontWeight: "700",
    color: "#1A1D1F",
    marginTop: 18,
  },
  subheading: {
    fontSize: 14,
    fontWeight: "400",
    color: "#6B7280",
    marginTop: 4,
  },
  cardsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
  },
  createCard: {
    backgroundColor: "#0D3B66",
    height: 124,
    justifyContent: "flex-end",
  },
  plusIcon: {
    position: "absolute",
    top: 14,
    left: 14,
    width: 18,
    height: 18,
  },
  createCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  createCardSubtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#C9D9E8",
    marginTop: 4,
    lineHeight: 16,
  },
  statsCard: {
    backgroundColor: "#E3EEFB",
    height: 124,
    justifyContent: "flex-start",
  },
  statsCardLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#0D3B66",
  },
  statsCardValue: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0D3B66",
    marginTop: 16,
  },
  viewAllRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 10,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0D3B66",
    textDecorationLine: "underline",
  },
  viewAllChevron: {
    width: 16,
    height: 16,
    tintColor: "#0D3B66",
  },
  pastInvoicesHeading: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1D1F",
    marginTop: 28,
  },
  illustrationContainer: {
    height: 260,
    alignItems: "center",
    marginTop: 4,
  },
  circleBox: {
    width: 222,
    height: 222,
    marginTop: 17,
  },
  circle: {
    width: 222,
    height: 222,
    borderRadius: 111,
    backgroundColor: "#DCEAFB",
  },
  skeletonCard: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 9,
    gap: 8,
    width: 196,
    shadowColor: "#0D3B66",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  skeletonCardTop: {
    top: 53,
    left: 67,
  },
  skeletonCardBottom: {
    top: 115,
    left: 30,
  },
  skeletonIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#1477E6",
    alignItems: "center",
    justifyContent: "center",
  },
  skeletonIcon: {
    width: 15,
    height: 15,
  },
  skeletonLines: {
    flex: 1,
    gap: 7,
  },
  skeletonBar: {
    height: 6,
    borderRadius: 3,
  },
  skeletonBarDark: {
    width: "55%",
    backgroundColor: "#AFC9EF",
  },
  skeletonBarLight: {
    width: "75%",
    backgroundColor: "#E2E8F0",
  },
  emptyStateText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 21,
    marginTop: 8,
  },
});
