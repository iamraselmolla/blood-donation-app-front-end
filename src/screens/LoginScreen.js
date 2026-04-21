import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS, SHADOW, RADIUS } from "../components/theme";

const { height } = Dimensions.get("window");

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState(null);

  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(60)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const dropletAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dropletAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(dropletAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.spring(slideUp, {
        toValue: 0,
        tension: 50,
        friction: 9,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const dropletY = dropletAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });
  const dropletScale = dropletAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.08, 1],
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.root}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroBg} />
          <View style={styles.heroBg2} />

          <Animated.View
            style={[styles.logoWrap, { transform: [{ scale: logoScale }] }]}
          >
            <Animated.View
              style={[
                styles.droplet,
                {
                  transform: [
                    { translateY: dropletY },
                    { scale: dropletScale },
                  ],
                },
              ]}
            >
              <Text style={styles.dropletEmoji}>🩸</Text>
            </Animated.View>
            <View style={styles.logoRing} />
            <View style={styles.logoRingOuter} />
          </Animated.View>

          <Animated.View
            style={{ opacity: fadeIn, transform: [{ translateY: slideUp }] }}
          >
            <Text style={styles.appName}>LifeDrop</Text>
            <Text style={styles.tagline}>Every drop saves a life</Text>
          </Animated.View>
        </View>

        {/* Form Card */}
        <Animated.View
          style={[
            styles.card,
            { opacity: fadeIn, transform: [{ translateY: slideUp }] },
          ]}
        >
          <Text style={styles.welcomeTitle}>Welcome back</Text>
          <Text style={styles.welcomeSub}>Sign in to continue</Text>

          {/* Email */}
          <View
            style={[
              styles.inputWrap,
              focused === "email" && styles.inputFocused,
            ]}
          >
            <Ionicons
              name="mail-outline"
              size={18}
              color={focused === "email" ? COLORS.primary : COLORS.gray400}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor={COLORS.gray400}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
            />
          </View>

          {/* Password */}
          <View
            style={[
              styles.inputWrap,
              focused === "pass" && styles.inputFocused,
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color={focused === "pass" ? COLORS.primary : COLORS.gray400}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Password"
              placeholderTextColor={COLORS.gray400}
              secureTextEntry={!showPass}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocused("pass")}
              onBlur={() => setFocused(null)}
            />
            <TouchableOpacity
              onPress={() => setShowPass(!showPass)}
              style={{ padding: 4 }}
            >
              <Ionicons
                name={showPass ? "eye-outline" : "eye-off-outline"}
                size={18}
                color={COLORS.gray400}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => navigation.replace("Main")}
            activeOpacity={0.85}
          >
            <Text style={styles.loginBtnText}>Sign In</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.registerBtn}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.registerBtnText}>Create a new account</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.primary },
  scroll: { flexGrow: 1 },
  hero: {
    height: height * 0.38,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  heroBg: {
    position: "absolute",
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: COLORS.primaryDark,
    top: -120,
    right: -80,
    opacity: 0.5,
  },
  heroBg2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.primaryLight,
    bottom: -50,
    left: -50,
    opacity: 0.3,
  },
  logoWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    position: "relative",
  },
  droplet: { zIndex: 2 },
  dropletEmoji: { fontSize: 54 },
  logoRing: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.25)",
  },
  logoRingOuter: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  appName: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  tagline: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 14,
    textAlign: "center",
    marginTop: 4,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 28,
    paddingTop: 32,
    ...SHADOW.large,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.black,
    marginBottom: 4,
  },
  welcomeSub: { fontSize: 14, color: COLORS.gray500, marginBottom: 28 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: COLORS.gray300,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 14,
    backgroundColor: COLORS.gray100,
  },
  inputFocused: { borderColor: COLORS.primary, backgroundColor: "#FFF5F5" },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: COLORS.black, paddingVertical: 12 },
  forgotBtn: { alignSelf: "flex-end", marginBottom: 24 },
  forgotText: { color: COLORS.primary, fontSize: 13, fontWeight: "600" },
  loginBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    ...SHADOW.large,
  },
  loginBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  divider: { flexDirection: "row", alignItems: "center", marginVertical: 22 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.gray200 },
  dividerText: { marginHorizontal: 14, color: COLORS.gray400, fontSize: 13 },
  registerBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 15,
    alignItems: "center",
  },
  registerBtnText: { color: COLORS.primary, fontSize: 15, fontWeight: "700" },
});
