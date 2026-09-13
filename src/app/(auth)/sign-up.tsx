import { AuthTextField } from "@/components/AuthTextField";
import { Button } from "@/components/Button";
import { LoadingScreen } from "@/components/LoadingScreen";
import { SocialButton } from "@/components/SocialButton";
import { Text } from "@/components/Text";
import { signUpSchema } from "@/lib/validation";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HOLD_DURATION_MS = 1500;

export default function SignUp() {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "", confirmPassword: "" },
    validationSchema: signUpSchema,
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setIsTransitioning(true);
    },
  });

  useEffect(() => {
    if (!isTransitioning) {
      return;
    }
    const timeout = setTimeout(() => {
      router.replace({
        pathname: "/setup",
        params: { email: formik.values.email, fly: "1" },
      });
    }, HOLD_DURATION_MS);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTransitioning]);

  if (isTransitioning) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <Pressable style={styles.backRow} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#171717" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <Image
          source={require("@/assets/images/icons/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Looks like you&apos;re new here!</Text>
        <Text style={styles.subtitle}>Let&apos;s create your account</Text>

        <View style={styles.form}>
          <AuthTextField
            label="Email Address"
            value={formik.values.email}
            onChangeText={(value) => formik.setFieldValue("email", value)}
            onBlur={() => formik.setFieldTouched("email", true)}
            placeholder="Peter@gmail.com"
            keyboardType="email-address"
            isValid={!formik.errors.email && formik.values.email.length > 0}
            error={formik.touched.email ? formik.errors.email : undefined}
          />
          <AuthTextField
            label="Password"
            value={formik.values.password}
            onChangeText={(value) => formik.setFieldValue("password", value)}
            onBlur={() => formik.setFieldTouched("password", true)}
            placeholder="Password"
            secureTextEntry
            isValid={
              !formik.errors.password && formik.values.password.length > 0
            }
            error={
              formik.touched.password ? formik.errors.password : undefined
            }
          />
          <AuthTextField
            label="Confirm Password"
            value={formik.values.confirmPassword}
            onChangeText={(value) =>
              formik.setFieldValue("confirmPassword", value)
            }
            onBlur={() => formik.setFieldTouched("confirmPassword", true)}
            placeholder="Confirm password"
            secureTextEntry
            isValid={
              !formik.errors.confirmPassword &&
              formik.values.confirmPassword.length > 0
            }
            error={
              formik.touched.confirmPassword
                ? formik.errors.confirmPassword
                : undefined
            }
          />
        </View>

        <Button
          label="Sign Up"
          loadingLabel="Signing Up"
          isLoading={formik.isSubmitting}
          onPress={formik.submitForm}
          style={styles.signUpButton}
        />

        <Text style={styles.orText}>Or</Text>

        <View style={styles.socialRow}>
          <SocialButton
            source={require("@/assets/images/icons/google.png")}
            accessibilityLabel="Sign up with Google"
          />
          <SocialButton
            source={require("@/assets/images/icons/facebook.png")}
            iconSize={32}
            accessibilityLabel="Sign up with Facebook"
          />
        </View>

        <View style={styles.footerSpacer} />

        <Text style={styles.footerText}>
          By signing up you agree to our{" "}
          <Text style={styles.footerLink}>Terms and Conditions</Text> and{" "}
          <Text style={styles.footerLink}>Policy</Text>
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
    paddingTop: 8,
    paddingBottom: 24,
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    paddingVertical: 8,
  },
  backText: {
    fontSize: 16,
    color: "#171717",
  },
  logo: {
    width: 40,
    height: 40,
    alignSelf: "center",
    marginTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#14181F",
    textAlign: "center",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 2,
  },
  form: {
    gap: 20,
    marginTop: 32,
  },
  signUpButton: {
    marginTop: 32,
  },
  orText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginTop: 8,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 8,
  },
  footerSpacer: {
    flex: 1,
    minHeight: 24,
  },
  footerText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
    textAlign: "center",
    width: "80%",
    alignSelf: "center",
  },
  footerLink: {
    color: "#0D3B66",
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});
