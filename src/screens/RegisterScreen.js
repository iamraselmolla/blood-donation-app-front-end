import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SHADOW, RADIUS } from "../components/theme";

// ─── CONFIG ────────────────────────────────────────────────────────────────────
const API_BASE_URL = "https://your-api.com"; // 🔁 Replace with your backend URL

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const DISTRICTS = [
  "Bagerhat",
  "Bandarban",
  "Barguna",
  "Barisal",
  "Bhola",
  "Bogura",
  "Brahmanbaria",
  "Chandpur",
  "Chattogram",
  "Chuadanga",
  "Comilla",
  "Cox's Bazar",
  "Dhaka",
  "Dinajpur",
  "Faridpur",
  "Feni",
  "Gaibandha",
  "Gazipur",
  "Gopalganj",
  "Habiganj",
  "Jamalpur",
  "Jashore",
  "Jhalokati",
  "Jhenaidah",
  "Joypurhat",
  "Khagrachhari",
  "Khulna",
  "Kishoreganj",
  "Kurigram",
  "Kushtia",
  "Lakshmipur",
  "Lalmonirhat",
  "Madaripur",
  "Magura",
  "Manikganj",
  "Meherpur",
  "Moulvibazar",
  "Munshiganj",
  "Mymensingh",
  "Naogaon",
  "Narail",
  "Narayanganj",
  "Narsingdi",
  "Natore",
  "Netrokona",
  "Nilphamari",
  "Noakhali",
  "Pabna",
  "Panchagarh",
  "Patuakhali",
  "Pirojpur",
  "Rajbari",
  "Rajshahi",
  "Rangamati",
  "Rangpur",
  "Satkhira",
  "Shariatpur",
  "Sherpur",
  "Sirajganj",
  "Sunamganj",
  "Sylhet",
  "Tangail",
  "Thakurgaon",
];
const STEPS = ["Personal", "Medical", "Account"];

// ─── VALIDATION ────────────────────────────────────────────────────────────────
function validateStep(step, form) {
  if (step === 0) {
    if (!form.name.trim()) return "Full name is required.";
    if (form.name.trim().length < 3)
      return "Name must be at least 3 characters.";
    if (!form.phone.trim()) return "Phone number is required.";
    const cleanPhone = form.phone.replace(/[\s\-()]/g, "");
    if (!/^(\+8801|01)\d{9}$/.test(cleanPhone))
      return "Enter a valid Bangladeshi phone (+8801XXXXXXXXX).";
    if (!form.age.trim()) return "Age is required.";
    const age = parseInt(form.age, 10);
    if (isNaN(age) || age < 18 || age > 65)
      return "Donor age must be between 18 and 65.";
    if (!form.district) return "Please select your district.";
  }
  if (step === 1) {
    if (!form.bloodGroup) return "Blood group is required.";
    if (!form.weight.trim()) return "Weight is required.";
    const w = parseFloat(form.weight);
    if (isNaN(w) || w < 45) return "Minimum donor weight is 45 kg.";
  }
  if (step === 2) {
    if (!form.email.trim()) return "Email address is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      return "Enter a valid email address.";
    if (!form.password) return "Password is required.";
    if (form.password.length < 8)
      return "Password must be at least 8 characters.";
  }
  return null;
}

// ─── API SUBMISSION ────────────────────────────────────────────────────────────
async function registerUser(form) {
  const nameParts = form.name.trim().split(" ");
  const payload = {
    // ── Personal
    display_name: form.name.trim(),
    first_name: nameParts[0],
    last_name: nameParts.slice(1).join(" ") || "",
    phone: form.phone.replace(/[\s\-()]/g, ""),
    age: parseInt(form.age, 10),
    district: form.district,
    division: form.division || "",
    // ── Medical
    blood_group: form.bloodGroup,
    weight_kg: parseFloat(form.weight),
    last_donated_at: form.lastDonation.trim() || null,
    // ── Medical flags
    is_smoker: form.smoker,
    has_hepatitis_b: form.hepatitisB,
    has_hepatitis_c: form.hepatitisC,
    has_hiv: form.hiv,
    has_diabetes: form.diabetic,
    has_heart_disease: form.heartDisease,
    has_malaria_recent: form.malaria,
    // ── Account
    email: form.email.trim().toLowerCase(),
    password: form.password,
  };
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || data.error || "Registration failed. Please try again.",
    );
  }
  return data; // { user: {...}, token: "jwt-token" }
}

// ─── COMPONENT ─────────────────────────────────────────────────────────────────
export default function RegisterScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [focused, setFocused] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    district: "",
    division: "",
    bloodGroup: "O+",
    weight: "",
    age: "",
    lastDonation: "",
    email: "",
    password: "",
    smoker: false,
    hepatitisB: false,
    hepatitisC: false,
    hiv: false,
    diabetic: false,
    heartDisease: false,
    malaria: false,
  });

  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: (step + 1) / STEPS.length,
      useNativeDriver: false,
      tension: 50,
    }).start();
  }, [step]);

  const update = (key, val) => {
    setError("");
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const handleBack = () => {
    setError("");
    step > 0 ? setStep((s) => s - 1) : navigation.goBack();
  };

  const handleNext = async () => {
    const err = validateStep(step, form);
    if (err) {
      setError(err);
      return;
    }
    setError("");

    if (step < STEPS.length - 1) {
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: -20,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
      setStep((s) => s + 1);
    } else {
      await submitForm();
    }
  };

  const submitForm = async () => {
    setLoading(true);
    try {
      console.log("Submitting registration with data:", form);
      return;
      const result = await registerUser(form);
      // Store token here if needed:
      // await AsyncStorage.setItem("auth_token", result.token);
      Alert.alert(
        "🎉 Welcome to LifeDrop!",
        "Your donor account has been created successfully.",
        [{ text: "Let's Go!", onPress: () => navigation.replace("Main") }],
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const passwordStrength =
    form.password.length === 0
      ? null
      : form.password.length < 6
        ? { label: "Weak", color: "#E53935" }
        : form.password.length < 10
          ? { label: "Fair", color: COLORS.warning }
          : { label: "Strong", color: COLORS.success };

  // ── Reusable text input ─────────────────────────────────────────────────────
  const InputField = ({
    fieldId,
    icon,
    label,
    placeholder,
    value,
    onChangeText,
    keyboardType,
    secure,
    multiline,
    maxLength,
    returnKeyType,
    onSubmitEditing,
  }) => (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View
        style={[styles.inputWrap, focused === fieldId && styles.inputFocused]}
      >
        <Ionicons
          name={icon}
          size={17}
          color={focused === fieldId ? COLORS.primary : COLORS.gray400}
          style={styles.inputIcon}
        />
        <TextInput
          style={[
            styles.input,
            multiline && {
              height: 70,
              textAlignVertical: "top",
              paddingTop: 10,
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray400}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType || "default"}
          secureTextEntry={!!(secure && !showPass)}
          autoCapitalize={
            keyboardType === "email-address" || secure ? "none" : "words"
          }
          autoCorrect={false}
          autoComplete={
            fieldId === "email"
              ? "email"
              : fieldId === "phone"
                ? "tel"
                : fieldId === "pass"
                  ? "password"
                  : "off"
          }
          textContentType={
            fieldId === "email"
              ? "emailAddress"
              : fieldId === "pass"
                ? "newPassword"
                : fieldId === "phone"
                  ? "telephoneNumber"
                  : "none"
          }
          maxLength={maxLength}
          returnKeyType={returnKeyType || "done"}
          onSubmitEditing={onSubmitEditing}
          onFocus={() => setFocused(fieldId)}
          onBlur={() => setFocused(null)}
          multiline={multiline}
          blurOnSubmit={!multiline}
          editable={!loading}
        />
        {secure && (
          <TouchableOpacity
            onPress={() => setShowPass((p) => !p)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={showPass ? "eye-outline" : "eye-off-outline"}
              size={17}
              color={COLORS.gray400}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const ToggleField = ({ label, field, icon, subtitle }) => (
    <TouchableOpacity
      style={styles.toggleRow}
      onPress={() => update(field, !form[field])}
      activeOpacity={0.8}
    >
      <View style={styles.toggleLeft}>
        <View
          style={[
            styles.toggleIcon,
            { backgroundColor: form[field] ? COLORS.dangerBg : COLORS.gray100 },
          ]}
        >
          <Ionicons
            name={icon}
            size={18}
            color={form[field] ? COLORS.primary : COLORS.gray400}
          />
        </View>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.toggleLabel}>{label}</Text>
          {subtitle && <Text style={styles.toggleSub}>{subtitle}</Text>}
        </View>
      </View>
      <View style={[styles.toggleSwitch, form[field] && styles.toggleSwitchOn]}>
        <View style={[styles.toggleKnob, form[field] && styles.toggleKnobOn]} />
      </View>
    </TouchableOpacity>
  );

  const renderStep0 = () => (
    <>
      <InputField
        fieldId="name"
        icon="person-outline"
        label="Full Name *"
        placeholder="e.g. Rasel Ahmed"
        value={form.name}
        onChangeText={(v) => update("name", v)}
        maxLength={100}
        returnKeyType="next"
      />
      <InputField
        fieldId="phone"
        icon="call-outline"
        label="Phone Number *"
        placeholder="+8801712345678"
        value={form.phone}
        onChangeText={(v) => update("phone", v)}
        keyboardType="phone-pad"
        maxLength={14}
        returnKeyType="next"
      />
      <InputField
        fieldId="age"
        icon="calendar-outline"
        label="Age *"
        placeholder="e.g. 25"
        value={form.age}
        onChangeText={(v) => update("age", v.replace(/[^0-9]/g, ""))}
        keyboardType="number-pad"
        maxLength={3}
      />

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>District *</Text>
        <View style={styles.chipGrid}>
          {DISTRICTS.map((d) => (
            <TouchableOpacity
              key={d}
              style={[styles.chip, form.district === d && styles.chipActive]}
              onPress={() => update("district", d)}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.chipText,
                  form.district === d && styles.chipTextActive,
                ]}
              >
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );

  const renderStep1 = () => (
    <>
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Blood Group *</Text>
        <View style={styles.bloodGrid}>
          {BLOOD_GROUPS.map((g) => (
            <TouchableOpacity
              key={g}
              style={[
                styles.bloodChip,
                form.bloodGroup === g && styles.bloodChipActive,
              ]}
              onPress={() => update("bloodGroup", g)}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.bloodChipText,
                  form.bloodGroup === g && styles.bloodChipTextActive,
                ]}
              >
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <InputField
        fieldId="weight"
        icon="barbell-outline"
        label="Weight (kg) *"
        placeholder="e.g. 65"
        value={form.weight}
        onChangeText={(v) => update("weight", v.replace(/[^0-9.]/g, ""))}
        keyboardType="decimal-pad"
        maxLength={5}
      />
      <InputField
        fieldId="lastDonation"
        icon="water-outline"
        label="Last Donation Date"
        placeholder="YYYY-MM-DD or blank"
        value={form.lastDonation}
        onChangeText={(v) => update("lastDonation", v)}
        maxLength={10}
      />

      <View style={styles.sectionDivider}>
        <Text style={styles.sectionDividerText}>Medical Conditions</Text>
        <Text style={styles.sectionDividerSub}>
          Required for eligibility — strictly confidential
        </Text>
      </View>
      <ToggleField
        label="Smoker"
        field="smoker"
        icon="flame-outline"
        subtitle="Currently smoking or quit < 1 yr"
      />
      <ToggleField
        label="Hepatitis B"
        field="hepatitisB"
        icon="medical-outline"
        subtitle="HBsAg positive"
      />
      <ToggleField
        label="Hepatitis C"
        field="hepatitisC"
        icon="medical-outline"
        subtitle="HCV positive"
      />
      <ToggleField
        label="HIV / AIDS"
        field="hiv"
        icon="shield-outline"
        subtitle="Any immunodeficiency condition"
      />
      <ToggleField
        label="Diabetes"
        field="diabetic"
        icon="nutrition-outline"
        subtitle="Insulin-dependent or uncontrolled"
      />
      <ToggleField
        label="Heart Disease"
        field="heartDisease"
        icon="heart-outline"
        subtitle="Cardiac or hypertension history"
      />
      <ToggleField
        label="Malaria (recent)"
        field="malaria"
        icon="bug-outline"
        subtitle="Within last 3 months"
      />
    </>
  );

  const renderStep2 = () => (
    <>
      <View style={styles.eligibilityBanner}>
        <Ionicons name="checkmark-circle" size={22} color={COLORS.success} />
        <Text style={styles.eligibilityText}>
          You're almost a registered donor!
        </Text>
      </View>
      <InputField
        fieldId="email"
        icon="mail-outline"
        label="Email Address *"
        placeholder="your@email.com"
        value={form.email}
        onChangeText={(v) => update("email", v)}
        keyboardType="email-address"
        maxLength={150}
        returnKeyType="next"
      />
      <InputField
        fieldId="pass"
        icon="lock-closed-outline"
        label="Create Password *"
        placeholder="Min. 8 characters"
        value={form.password}
        onChangeText={(v) => update("password", v)}
        secure
        maxLength={72}
        returnKeyType="done"
        onSubmitEditing={handleNext}
      />

      {passwordStrength && (
        <View style={styles.strengthRow}>
          {[1, 2, 3].map((n) => (
            <View
              key={n}
              style={[
                styles.strengthBar,
                {
                  backgroundColor:
                    n === 1
                      ? passwordStrength.color
                      : n === 2 && form.password.length >= 6
                        ? passwordStrength.color
                        : n === 3 && form.password.length >= 10
                          ? passwordStrength.color
                          : COLORS.gray200,
                },
              ]}
            />
          ))}
          <Text
            style={[styles.strengthLabel, { color: passwordStrength.color }]}
          >
            {passwordStrength.label}
          </Text>
        </View>
      )}

      <View style={styles.terms}>
        <Ionicons
          name="information-circle-outline"
          size={16}
          color={COLORS.gray500}
        />
        <Text style={styles.termsText}>
          By registering, you confirm your information is accurate and agree to
          our{" "}
          <Text style={{ color: COLORS.primary, fontWeight: "700" }}>
            Donor Guidelines
          </Text>{" "}
          and{" "}
          <Text style={{ color: COLORS.primary, fontWeight: "700" }}>
            Privacy Policy
          </Text>
          .
        </Text>
      </View>
    </>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: COLORS.primary }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.headerTitle}>Donor Registration</Text>
          <Text style={styles.headerSub}>
            Step {step + 1} of {STEPS.length} — {STEPS[step]}
          </Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <Animated.View
          style={[styles.progressFill, { width: progressWidth }]}
        />
      </View>

      {/* Step indicators */}
      <View style={styles.stepDots}>
        {STEPS.map((s, i) => (
          <View key={s} style={styles.stepDotWrap}>
            <View
              style={[
                styles.stepDot,
                i < step && styles.stepDotDone,
                i === step && styles.stepDotActive,
              ]}
            >
              {i < step ? (
                <Ionicons name="checkmark" size={12} color="#fff" />
              ) : (
                <Text
                  style={[
                    styles.stepDotNum,
                    i === step && { color: COLORS.primary },
                  ]}
                >
                  {i + 1}
                </Text>
              )}
            </View>
            <Text
              style={[
                styles.stepDotLabel,
                i === step && { color: "#fff", fontWeight: "700" },
              ]}
            >
              {s}
            </Text>
          </View>
        ))}
      </View>

      {/* Scrollable form body */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
          {step === 0 && renderStep0()}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
        </Animated.View>

        {/* Error banner */}
        {!!error && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={16} color={COLORS.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* CTA button */}
        <TouchableOpacity
          style={[styles.nextBtn, loading && { opacity: 0.7 }]}
          onPress={handleNext}
          activeOpacity={0.85}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Text style={styles.nextBtnText}>
                {step === STEPS.length - 1
                  ? "Complete Registration"
                  : "Continue"}
              </Text>
              <Ionicons
                name={step === STEPS.length - 1 ? "checkmark" : "arrow-forward"}
                size={18}
                color="#fff"
              />
            </>
          )}
        </TouchableOpacity>

        <View style={{ height: 50 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 55,
    paddingBottom: 12,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { color: "#fff", fontSize: 17, fontWeight: "700" },
  headerSub: { color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 2 },
  progressTrack: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.25)",
    marginHorizontal: 20,
    borderRadius: 2,
  },
  progressFill: { height: 4, backgroundColor: "#fff", borderRadius: 2 },
  stepDots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
  },
  stepDotWrap: { alignItems: "center", gap: 5 },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotActive: { backgroundColor: "#fff" },
  stepDotDone: { backgroundColor: COLORS.success },
  stepDotNum: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontWeight: "700",
  },
  stepDotLabel: { color: "rgba(255,255,255,0.6)", fontSize: 11 },
  scrollArea: { flex: 1, backgroundColor: COLORS.gray100 },
  scrollContent: { padding: 20 },
  fieldGroup: { marginBottom: 16 },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.gray700,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: COLORS.gray200,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    minHeight: 52,
  },
  inputFocused: { borderColor: COLORS.primary, backgroundColor: "#FFF5F5" },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: COLORS.black, paddingVertical: 13 },
  bloodGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  bloodChip: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: RADIUS.full,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: COLORS.gray200,
  },
  bloodChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  bloodChipText: { color: COLORS.gray700, fontWeight: "700", fontSize: 13 },
  bloodChipTextActive: { color: "#fff" },
  chipGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: RADIUS.full,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: COLORS.gray200,
  },
  chipActive: {
    backgroundColor: COLORS.primaryBg,
    borderColor: COLORS.primary,
  },
  chipText: { color: COLORS.gray600, fontSize: 13, fontWeight: "500" },
  chipTextActive: { color: COLORS.primary, fontWeight: "700" },
  sectionDivider: {
    marginVertical: 14,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.gray200,
  },
  sectionDividerText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
  },
  sectionDividerSub: { fontSize: 12, color: COLORS.gray500, marginTop: 3 },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: RADIUS.md,
    padding: 14,
    marginBottom: 10,
    ...SHADOW.small,
  },
  toggleLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  toggleIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  toggleLabel: { fontSize: 14, fontWeight: "600", color: COLORS.gray800 },
  toggleSub: { fontSize: 11, color: COLORS.gray400, marginTop: 2 },
  toggleSwitch: {
    width: 46,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.gray200,
    justifyContent: "center",
    padding: 3,
    flexShrink: 0,
  },
  toggleSwitchOn: { backgroundColor: COLORS.primary },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    ...SHADOW.small,
  },
  toggleKnobOn: { alignSelf: "flex-end" },
  eligibilityBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: COLORS.successBg,
    borderRadius: RADIUS.md,
    padding: 14,
    marginBottom: 20,
  },
  eligibilityText: { color: COLORS.success, fontWeight: "600", fontSize: 14 },
  strengthRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: -8,
    marginBottom: 14,
  },
  strengthBar: { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel: { fontSize: 12, fontWeight: "700", marginLeft: 4 },
  terms: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    padding: 14,
    backgroundColor: COLORS.gray100,
    borderRadius: RADIUS.md,
  },
  termsText: { flex: 1, fontSize: 12, color: COLORS.gray500, lineHeight: 19 },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.dangerBg,
    borderRadius: RADIUS.md,
    padding: 13,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5393540",
  },
  errorText: { flex: 1, fontSize: 13, color: COLORS.danger, fontWeight: "500" },
  nextBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 8,
    ...SHADOW.large,
  },
  nextBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
