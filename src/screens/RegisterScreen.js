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
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SHADOW, RADIUS } from "../components/theme";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const DISTRICTS = [
  "Dhaka",
  "Chittagong",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barisal",
  "Rangpur",
  "Mymensingh",
];

const STEPS = ["Personal", "Medical", "Account"];

export default function RegisterScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [focused, setFocused] = useState(null);
  const [showPass, setShowPass] = useState(false);
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

  const update = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const nextStep = () => {
    if (step < STEPS.length - 1) {
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: -30,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      setStep((s) => s + 1);
    } else {
      navigation.replace("Main");
    }
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const InputField = ({
    icon,
    label,
    placeholder,
    value,
    onChangeText,
    keyboardType,
    secure,
    id,
    multiline,
  }) => (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.inputWrap, focused === id && styles.inputFocused]}>
        <Ionicons
          name={icon}
          size={17}
          color={focused === id ? COLORS.primary : COLORS.gray400}
          style={styles.inputIcon}
        />
        <TextInput
          style={[
            styles.input,
            multiline && { height: 60, textAlignVertical: "top" },
          ]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray400}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType || "default"}
          secureTextEntry={secure && !showPass}
          onFocus={() => setFocused(id)}
          onBlur={() => setFocused(null)}
          multiline={multiline}
        />
        {secure && (
          <TouchableOpacity onPress={() => setShowPass(!showPass)}>
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

  const BloodGroupSelector = () => (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>Blood Group</Text>
      <View style={styles.bloodGrid}>
        {BLOOD_GROUPS.map((g) => (
          <TouchableOpacity
            key={g}
            style={[
              styles.bloodChip,
              form.bloodGroup === g && styles.bloodChipActive,
            ]}
            onPress={() => update("bloodGroup", g)}
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
  );

  const ToggleField = ({ label, field, icon, subtitle }) => (
    <TouchableOpacity
      style={styles.toggleRow}
      onPress={() => update(field, !form[field])}
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
        <View>
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
        id="name"
        icon="person-outline"
        label="Full Name"
        placeholder="Your full name"
        value={form.name}
        onChangeText={(v) => update("name", v)}
      />
      <InputField
        id="phone"
        icon="call-outline"
        label="Phone Number"
        placeholder="+880 17XX-XXXXXX"
        value={form.phone}
        onChangeText={(v) => update("phone", v)}
        keyboardType="phone-pad"
      />
      <InputField
        id="age"
        icon="calendar-outline"
        label="Age"
        placeholder="e.g. 25"
        value={form.age}
        onChangeText={(v) => update("age", v)}
        keyboardType="numeric"
      />

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>District</Text>
        <View style={styles.districtGrid}>
          {DISTRICTS.map((d) => (
            <TouchableOpacity
              key={d}
              style={[
                styles.districtChip,
                form.district === d && styles.districtChipActive,
              ]}
              onPress={() => update("district", d)}
            >
              <Text
                style={[
                  styles.districtChipText,
                  form.district === d && styles.districtChipTextActive,
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
      <BloodGroupSelector />
      <InputField
        id="weight"
        icon="barbell-outline"
        label="Weight (kg)"
        placeholder="e.g. 65"
        value={form.weight}
        onChangeText={(v) => update("weight", v)}
        keyboardType="numeric"
      />
      <InputField
        id="lastDonation"
        icon="water-outline"
        label="Last Donation Date"
        placeholder="YYYY-MM-DD (or 'Never')"
        value={form.lastDonation}
        onChangeText={(v) => update("lastDonation", v)}
      />

      <View style={styles.sectionDivider}>
        <Text style={styles.sectionDividerText}>Medical Conditions</Text>
        <Text style={styles.sectionDividerSub}>
          Required for donor eligibility — all info is confidential
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
        id="email"
        icon="mail-outline"
        label="Email Address"
        placeholder="your@email.com"
        value={form.email}
        onChangeText={(v) => update("email", v)}
        keyboardType="email-address"
      />
      <InputField
        id="pass"
        icon="lock-closed-outline"
        label="Create Password"
        placeholder="Min. 8 characters"
        value={form.password}
        onChangeText={(v) => update("password", v)}
        secure
        id="pass"
      />

      <View style={styles.terms}>
        <Ionicons
          name="information-circle-outline"
          size={16}
          color={COLORS.gray500}
        />
        <Text style={styles.termsText}>
          By registering, you confirm your information is accurate and agree to
          our donor guidelines.
        </Text>
      </View>
    </>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: COLORS.primary }}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            step > 0 ? setStep((s) => s - 1) : navigation.goBack()
          }
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Donor Registration</Text>
          <Text style={styles.headerSub}>
            Step {step + 1} of {STEPS.length} — {STEPS[step]}
          </Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressTrack}>
        <Animated.View
          style={[styles.progressFill, { width: progressWidth }]}
        />
      </View>

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

        <TouchableOpacity
          style={styles.nextBtn}
          onPress={nextStep}
          activeOpacity={0.85}
        >
          <Text style={styles.nextBtnText}>
            {step === STEPS.length - 1 ? "Complete Registration" : "Continue"}
          </Text>
          <Ionicons
            name={step === STEPS.length - 1 ? "checkmark" : "arrow-forward"}
            size={18}
            color="#fff"
          />
        </TouchableOpacity>

        <View style={{ height: 40 }} />
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
    paddingBottom: 16,
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
  headerTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
  headerSub: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    textAlign: "center",
  },
  progressTrack: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.25)",
    marginHorizontal: 20,
    borderRadius: 2,
  },
  progressFill: { height: 4, backgroundColor: "#fff", borderRadius: 2 },
  scrollArea: { flex: 1, backgroundColor: COLORS.gray100 },
  scrollContent: { padding: 20 },
  fieldGroup: { marginBottom: 18 },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.gray700,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: COLORS.gray200,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
  },
  inputFocused: { borderColor: COLORS.primary, backgroundColor: "#FFF5F5" },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: COLORS.black, paddingVertical: 13 },
  bloodGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  bloodChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
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
  districtGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  districtChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: COLORS.gray200,
  },
  districtChipActive: {
    backgroundColor: COLORS.primaryBg,
    borderColor: COLORS.primary,
  },
  districtChipText: { color: COLORS.gray600, fontSize: 13, fontWeight: "500" },
  districtChipTextActive: { color: COLORS.primary, fontWeight: "700" },
  sectionDivider: {
    marginVertical: 16,
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
  sectionDividerSub: { fontSize: 12, color: COLORS.gray500, marginTop: 2 },
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
  toggleLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  toggleIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleLabel: { fontSize: 14, fontWeight: "600", color: COLORS.gray800 },
  toggleSub: { fontSize: 11, color: COLORS.gray400, marginTop: 1 },
  toggleSwitch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.gray200,
    justifyContent: "center",
    padding: 2,
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
  terms: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    padding: 14,
    backgroundColor: COLORS.gray100,
    borderRadius: RADIUS.md,
  },
  termsText: { flex: 1, fontSize: 12, color: COLORS.gray500, lineHeight: 18 },
  nextBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 10,
    ...SHADOW.large,
  },
  nextBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
