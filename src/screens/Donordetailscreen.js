import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SHADOW, RADIUS } from "../components/theme";

const { width, height } = Dimensions.get("window");

const DONOR_FULL_DATA = {
  id: "1",
  name: "Arif Rahman",
  blood: "A+",
  location: "Dhaka",
  district: "Mirpur",
  lastDonated: "20 Jan 2026",
  available: true,
  donations: 12,
  distance: "2.3 km",
  age: 28,
  weight: "72 kg",
  phone: "+880 1712-345678",
  email: "arif@email.com",
  smoker: false,
  hepatitisB: false,
  hepatitisC: false,
  hiv: false,
  diabetic: false,
  heartDisease: false,
  malaria: false,
  tattoo: false,
  bloodPressure: "Normal",
  hemoglobin: "14.2 g/dL",
  bio: "Proud blood donor since 2018. I believe every drop counts and I'm committed to saving lives in my community.",
  badges: ["Veteran Donor", "10+ Donations", "O- Hero"],
};

export default function DonorDetailScreen({ navigation, route }) {
  const donor = { ...DONOR_FULL_DATA, ...(route?.params?.donor || {}) };

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const StatusBadge = ({ label, isSafe, icon }) => (
    <View
      style={[
        styles.statusBadge,
        { backgroundColor: isSafe ? COLORS.successBg : COLORS.dangerBg },
      ]}
    >
      <Ionicons
        name={isSafe ? "checkmark-circle" : "close-circle"}
        size={15}
        color={isSafe ? COLORS.success : COLORS.danger}
      />
      <Text
        style={[
          styles.statusBadgeText,
          { color: isSafe ? COLORS.success : COLORS.danger },
        ]}
      >
        {label}
      </Text>
    </View>
  );

  const InfoRow = ({ icon, label, value, accent }) => (
    <View style={styles.infoRow}>
      <View
        style={[
          styles.infoIconBox,
          { backgroundColor: accent ? COLORS.primaryBg : COLORS.gray100 },
        ]}
      >
        <Ionicons
          name={icon}
          size={17}
          color={accent ? COLORS.primary : COLORS.gray500}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[styles.infoValue, accent && { color: COLORS.primary }]}>
          {value}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.gray100 }}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero Header */}
        <View style={styles.heroSection}>
          <View style={styles.heroBg} />
          <View style={styles.heroBg2} />

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>

          <Animated.View
            style={[
              styles.heroContent,
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
            ]}
          >
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{donor.name[0]}</Text>
              </View>
              {donor.available && (
                <View style={styles.availablePill}>
                  <View style={styles.availableDot} />
                  <Text style={styles.availableText}>Available</Text>
                </View>
              )}
            </View>
            <Text style={styles.donorName}>{donor.name}</Text>
            <View style={styles.bloodBig}>
              <Text style={styles.bloodBigText}>{donor.blood}</Text>
            </View>
            <Text style={styles.heroLocation}>
              <Ionicons
                name="location"
                size={13}
                color="rgba(255,255,255,0.8)"
              />{" "}
              {donor.location}, {donor.district}
            </Text>
          </Animated.View>

          {/* Stats Strip */}
          <Animated.View style={[styles.statsStrip, { opacity: fadeAnim }]}>
            {[
              { num: donor.donations, label: "Donations" },
              { num: donor.age, label: "Age" },
              { num: donor.weight, label: "Weight" },
              { num: donor.distance, label: "Distance" },
            ].map((s) => (
              <View key={s.label} style={styles.statItem}>
                <Text style={styles.statNum}>{s.num}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </Animated.View>
        </View>

        {/* Content */}
        <Animated.View
          style={{ transform: [{ translateY: slideAnim }], opacity: fadeAnim }}
        >
          {/* Badges */}
          {donor.badges && (
            <View style={styles.section}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 4 }}
              >
                {donor.badges.map((badge) => (
                  <View key={badge} style={styles.badge}>
                    <Text style={styles.badgeText}>🏅 {badge}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Bio */}
          <View style={[styles.card, { marginTop: 12 }]}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bioText}>{donor.bio}</Text>
          </View>

          {/* Blood Safety — KEY SECTION */}
          <View style={[styles.card, { marginTop: 12 }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Blood Safety Profile</Text>
              <View style={styles.safeIndicator}>
                <Ionicons
                  name="shield-checkmark"
                  size={14}
                  color={COLORS.success}
                />
                <Text style={styles.safeIndicatorText}>Verified</Text>
              </View>
            </View>
            <Text style={styles.sectionSub}>
              Medical conditions that affect blood donation eligibility
            </Text>

            <View style={styles.statusGrid}>
              <StatusBadge label="Non-Smoker" isSafe={!donor.smoker} />
              <StatusBadge label="Hepatitis B" isSafe={!donor.hepatitisB} />
              <StatusBadge label="Hepatitis C" isSafe={!donor.hepatitisC} />
              <StatusBadge label="HIV Free" isSafe={!donor.hiv} />
              <StatusBadge label="Diabetes" isSafe={!donor.diabetic} />
              <StatusBadge label="Heart Disease" isSafe={!donor.heartDisease} />
              <StatusBadge label="Malaria Free" isSafe={!donor.malaria} />
              <StatusBadge label="No Tattoo" isSafe={!donor.tattoo} />
            </View>

            {/* Vitals */}
            <View style={styles.vitalRow}>
              <View style={styles.vitalBox}>
                <Ionicons
                  name="pulse-outline"
                  size={18}
                  color={COLORS.primary}
                />
                <Text style={styles.vitalLabel}>Blood Pressure</Text>
                <Text style={styles.vitalValue}>{donor.bloodPressure}</Text>
              </View>
              <View style={styles.vitalBox}>
                <Ionicons name="water-outline" size={18} color={COLORS.info} />
                <Text style={styles.vitalLabel}>Hemoglobin</Text>
                <Text style={styles.vitalValue}>{donor.hemoglobin}</Text>
              </View>
            </View>
          </View>

          {/* Contact & Donation Info */}
          <View style={[styles.card, { marginTop: 12 }]}>
            <Text style={styles.sectionTitle}>Contact & Donation</Text>
            <InfoRow
              icon="call-outline"
              label="Phone"
              value={donor.phone}
              accent
            />
            <InfoRow icon="mail-outline" label="Email" value={donor.email} />
            <InfoRow
              icon="water-outline"
              label="Last Donated"
              value={donor.lastDonated}
              accent
            />
            <InfoRow
              icon="calendar-outline"
              label="Next Eligible"
              value="20 Apr 2026"
            />
          </View>

          {/* Donor Eligibility Info */}
          <View style={[styles.card, { marginTop: 12, marginBottom: 20 }]}>
            <Text style={styles.sectionTitle}>Donation Eligibility</Text>
            {[
              {
                icon: "time-outline",
                text: "Must wait 3 months between whole blood donations",
              },
              { icon: "scale-outline", text: "Minimum weight: 50 kg required" },
              {
                icon: "fitness-outline",
                text: "Hemoglobin ≥ 12.5 g/dL for women, 13.5 g/dL for men",
              },
              {
                icon: "thermometer-outline",
                text: "No fever or illness in the last 2 weeks",
              },
              {
                icon: "airplane-outline",
                text: "No travel to malaria zone in last 6 months",
              },
            ].map((item, i) => (
              <View key={i} style={styles.eligibilityRow}>
                <Ionicons name={item.icon} size={16} color={COLORS.primary} />
                <Text style={styles.eligibilityText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomCTA}>
        <TouchableOpacity style={styles.messageBtn}>
          <Ionicons
            name="chatbubble-outline"
            size={20}
            color={COLORS.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.callBigBtn}>
          <Ionicons name="call" size={18} color="#fff" />
          <Text style={styles.callBigText}>Request Donation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    backgroundColor: COLORS.primary,
    paddingTop: 55,
    paddingBottom: 70,
    overflow: "hidden",
    position: "relative",
  },
  heroBg: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: COLORS.primaryDark,
    top: -100,
    right: -80,
    opacity: 0.4,
  },
  heroBg2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.primaryLight,
    bottom: -80,
    left: -50,
    opacity: 0.25,
  },
  backBtn: {
    position: "absolute",
    top: 55,
    left: 20,
    zIndex: 10,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroContent: { alignItems: "center", marginTop: 20 },
  avatarWrap: { position: "relative", marginBottom: 12 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.5)",
  },
  avatarText: { fontSize: 38, fontWeight: "800", color: "#fff" },
  availablePill: {
    position: "absolute",
    bottom: 0,
    right: -10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.success,
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  availableDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fff",
  },
  availableText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  donorName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.3,
  },
  bloodBig: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    marginVertical: 6,
  },
  bloodBigText: { color: "#fff", fontWeight: "900", fontSize: 18 },
  heroLocation: { fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 2 },
  statsStrip: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: RADIUS.lg,
    padding: 14,
  },
  statItem: { alignItems: "center" },
  statNum: { fontSize: 16, fontWeight: "800", color: "#fff" },
  statLabel: { fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2 },
  section: { paddingHorizontal: 20, marginTop: 12 },
  card: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: RADIUS.lg,
    padding: 18,
    ...SHADOW.small,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.black,
    marginBottom: 4,
  },
  sectionSub: { fontSize: 12, color: COLORS.gray400, marginBottom: 14 },
  safeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  safeIndicatorText: { color: COLORS.success, fontSize: 11, fontWeight: "700" },
  bioText: { fontSize: 14, color: COLORS.gray600, lineHeight: 22 },
  statusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  statusBadgeText: { fontSize: 12, fontWeight: "600" },
  vitalRow: { flexDirection: "row", gap: 12 },
  vitalBox: {
    flex: 1,
    backgroundColor: COLORS.gray100,
    borderRadius: RADIUS.md,
    padding: 12,
    alignItems: "center",
  },
  vitalLabel: { fontSize: 11, color: COLORS.gray400, marginTop: 5 },
  vitalValue: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.black,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  infoIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  infoLabel: { fontSize: 11, color: COLORS.gray400 },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.black,
    marginTop: 1,
  },
  eligibilityRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 12,
  },
  eligibilityText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.gray600,
    lineHeight: 20,
  },
  badge: {
    backgroundColor: COLORS.primaryBg,
    borderRadius: RADIUS.full,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 8,
  },
  badgeText: { color: COLORS.primary, fontSize: 12, fontWeight: "700" },
  bottomCTA: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    paddingBottom: 32,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
    ...SHADOW.medium,
  },
  messageBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primaryBg,
    alignItems: "center",
    justifyContent: "center",
  },
  callBigBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    ...SHADOW.large,
  },
  callBigText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
