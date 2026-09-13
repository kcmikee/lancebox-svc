import { Button } from "@/components/Button";
import { FlyingLogo } from "@/components/FlyingLogo";
import { Text } from "@/components/Text";
import { useAuth } from "@/store/auth";
import { Image as ExpoImage } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const MAX_LOGO_SIZE_BYTES = 20 * 1024 * 1024;
const ALLOWED_LOGO_MIME_TYPES = ["image/png", "image/jpeg"];

function isAllowedLogoType(asset: ImagePicker.ImagePickerAsset) {
  if (asset.mimeType) {
    return ALLOWED_LOGO_MIME_TYPES.includes(asset.mimeType.toLowerCase());
  }
  return /\.(png|jpe?g)$/i.test(asset.fileName ?? asset.uri);
}

export default function Setup() {
  const { email, fly } = useLocalSearchParams<{
    email?: string;
    fly?: string;
  }>();
  const insets = useSafeAreaInsets();
  const signIn = useAuth((state) => state.signIn);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [isProceeding, setIsProceeding] = useState(false);
  const [showFlyingLogo, setShowFlyingLogo] = useState(fly === "1");

  const handlePickLogo = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Photo access needed",
        "Allow photo library access to upload a logo.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 1,
    });

    if (result.canceled) {
      return;
    }

    const asset = result.assets[0];

    if (!isAllowedLogoType(asset)) {
      Alert.alert("Unsupported file", "Please choose a PNG or JPG image.");
      return;
    }

    if (asset.fileSize && asset.fileSize > MAX_LOGO_SIZE_BYTES) {
      Alert.alert("File too large", "Please choose an image under 20mb.");
      return;
    }

    setLogoUri(asset.uri);
  };

  const handleProceed = () => {
    if (!selectedRole || isProceeding) {
      return;
    }
    setIsProceeding(true);
    setTimeout(() => {
      signIn({ userId: email ?? "user" });
    }, 1200);
  };

  return (
    <>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ExpoImage
            source={require("@/assets/images/icons/logo.png")}
            style={[styles.topLogo, showFlyingLogo && styles.hiddenLogo]}
            contentFit="contain"
          />

          <Text style={styles.heading}>Let’s Get to Know you Better</Text>

          <View style={styles.breadcrumbContainer}>
            <Text style={styles.breadcrumbActive}>Set Up Profile</Text>
            <Image
              source={require("@/assets/images/icons/chevron-right.png")}
              style={styles.chevronActive}
              resizeMode="contain"
            />
            <Text style={styles.breadcrumbInactive}>Personal Details</Text>
            <Image
              source={require("@/assets/images/icons/chevron-right.png")}
              style={styles.chevronInactive}
              resizeMode="contain"
            />
            <Image
              source={require("@/assets/images/icons/check-circle.png")}
              style={styles.checkCircle}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.sectionLabel}>
            Upload your logo/personal branding
          </Text>

          <Pressable style={styles.uploadBox} onPress={handlePickLogo}>
            {logoUri ? (
              <>
                <Image
                  source={require("@/assets/images/icons/check-circle.png")}
                  style={styles.uploadSuccessIcon}
                  resizeMode="contain"
                />
                <Text style={styles.uploadSuccessText}>
                  Upload successful
                </Text>
              </>
            ) : (
              <>
                <Image
                  source={require("@/assets/images/icons/image-plus.png")}
                  style={styles.imagePlus}
                  resizeMode="contain"
                />
                <Text style={styles.uploadPlaceholderText}>
                  Drag or seclect a file
                </Text>
              </>
            )}
          </Pressable>

          <View style={styles.uploadMetaContainer}>
            <Text style={styles.uploadMetaTitle}>Upload a logo</Text>
            <Text style={styles.uploadMetaSubtitle}>
              PNG or JPG less than 20mb
            </Text>
          </View>

          <Text style={styles.roleSectionLabel}>
            How will you like to use your Lancebox?
          </Text>

          <Pressable
            style={[
              styles.roleOptionCard,
              selectedRole === "business" && styles.roleOptionCardSelected,
            ]}
            onPress={() => setSelectedRole("business")}
          >
            <Text
              style={[
                styles.roleOptionText,
                selectedRole === "business" && {
                  color: "#fff",
                },
              ]}
            >
              As a Business Owner
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.roleOptionCard,
              selectedRole === "individual" && styles.roleOptionCardSelected,
            ]}
            onPress={() => setSelectedRole("individual")}
          >
            <Text
              style={[
                styles.roleOptionText,
                selectedRole === "individual" && {
                  color: "#fff",
                },
              ]}
            >
              As an Individual/Freelancer
            </Text>
          </Pressable>

          <Button
            label="Proceed"
            isLoading={isProceeding}
            disabled={!selectedRole}
            onPress={handleProceed}
            textColor="#FFFFFF"
            style={[
              styles.proceedButton,
              selectedRole ? styles.proceedButtonActive : undefined,
            ]}
          />

          <Pressable style={styles.skipContainer}>
            <Text style={styles.skipText}>Skip for now</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
      {showFlyingLogo && (
        <FlyingLogo insets={insets} onDone={() => setShowFlyingLogo(false)} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  topLogo: {
    width: 40,
    height: 40,
    alignSelf: "center",
    marginTop: 8,
  },
  hiddenLogo: {
    opacity: 0,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E2022",
    textAlign: "center",
    marginTop: 24,
    letterSpacing: -0.2,
  },
  breadcrumbContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 26,
    marginBottom: 26,
    gap: 8,
  },
  breadcrumbActive: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E2022",
  },
  chevronActive: {
    width: 10,
    height: 12,
    tintColor: "#374151",
  },
  breadcrumbInactive: {
    fontSize: 12,
    fontWeight: "400",
    color: "#CBD5E1",
  },
  chevronInactive: {
    width: 10,
    height: 12,
    tintColor: "#CBD5E1",
  },
  checkCircle: {
    width: 18,
    height: 18,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "400",
    color: "#2D3748",
    marginBottom: 14,
  },
  uploadBox: {
    height: 138,
    borderWidth: 2,
    borderColor: "#4CA0FB",
    borderStyle: "dashed",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
  },
  imagePlus: {
    width: 32,
    height: 32,
  },
  uploadSuccessIcon: {
    width: 32,
    height: 32,
  },
  uploadSuccessText: {
    fontSize: 15,
    fontWeight: "400",
    color: "#1E2022",
  },
  uploadPlaceholderText: {
    fontSize: 14,
    color: "#A0AEC0",
    fontWeight: "400",
  },
  uploadMetaContainer: {
    alignItems: "center",
    marginTop: 10,
    gap: 3,
  },
  uploadMetaTitle: {
    fontSize: 13,
    fontWeight: "300",
    color: "#4A5568",
  },
  uploadMetaSubtitle: {
    fontSize: 12,
    fontWeight: "300",
    color: "#A0AEC0",
  },
  roleSectionLabel: {
    fontSize: 16,
    fontWeight: "400",
    color: "#2D3748",
    marginTop: 30,
    marginBottom: 24,
  },
  roleOptionCard: {
    height: 78,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  roleOptionCardSelected: {
    borderColor: "#0D3B66",
    backgroundColor: "#0D3B66",
    color: "#fff",
  },
  roleOptionText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#374151",
  },
  proceedButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: "#A8ACB4",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
  },
  proceedButtonActive: {
    backgroundColor: "#2FA2EE",
  },
  skipContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    paddingVertical: 4,
  },
  skipText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#3898EC",
    textDecorationLine: "underline",
  },
});
