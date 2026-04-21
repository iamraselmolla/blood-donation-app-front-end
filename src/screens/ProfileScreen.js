import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SHADOW, RADIUS } from "../components/theme";

const USER = {
  name: "Rasel Ahmed",
  bloodGroup: "B+",
  phone: "+880 1712-345678",
  email: "rasel@email.com",
  location: "Khulna, Bangladesh",
  totalDonations: 5,
  lastDonated: "20 Jan 2026",
  nextEligible: "20 Apr 2026",
  age: 26,
  weight: "72 kg",
  hemoglobin: "14.2 g/dL",
  bloodPressure: "120/80",
  diseases: [],
  smoker: false,
  hepatitisB: false,
  hepatitisC: false,
  hiv: false,
  diabetic: false,
  heartDisease: false,
  bio: "Passionate blood donor. On a mission to complete 10 donations and earn the Gold Badge.",
};

const DONATION_HISTORY = [
  { date: "20 Jan 2026", hospital: "Khulna Medical", units: 1, badge: "🏅" },
  {
    date: "10 Oct 2025",
    hospital: "Shaheed Ziaur Rahman",
    units: 1,
    badge: "",
  },
  { date: "12 Jul 2025", hospital: "Khulna Medical", units: 1, badge: "" },
];

const BEFORE_DONATING = [
  {
    icon: "restaurant-outline",
    title: "Eat a healthy meal",
    desc: "Avoid fatty foods. Iron-rich meals are ideal before donation.",
    color: COLORS.success,
  },
  {
    icon: "water-outline",
    title: "Stay hydrated",
    desc: "Drink extra 500ml of water before your appointment.",
    color: COLORS.info,
  },
  {
    icon: "moon-outline",
    title: "Sleep well",
    desc: "Get at least 7–8 hours of sleep the night before.",
    color: "#7B1FA2",
  },
  {
    icon: "ban-outline",
    title: "Avoid alcohol",
    desc: "No alcohol for at least 24 hours before donation.",
    color: COLORS.warning,
  },
  {
    icon: "fitness-outline",
    title: "Light exercise only",
    desc: "Avoid intense workouts 12 hours before donating.",
    color: COLORS.accent,
  },
  {
    icon: "medical-outline",
    title: "Check medications",
    desc: "Inform staff about any medications you're currently taking.",
    color: COLORS.primary,
  },
];

export default function ProfileScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [showAllHistory, setShowAllHistory] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 9,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const progressPct = (USER.totalDonations / 10) * 100;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBg} />
        <Animated.View style={[styles.heroContent, { opacity: fadeAnim }]}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarLetter}>{USER.name[0]}</Text>
            </View>
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Ionicons name="camera" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{USER.name}</Text>
          <View style={styles.bloodBadge}>
            <Text style={styles.bloodBadgeText}>{USER.bloodGroup}</Text>
          </View>
          <Text style={styles.bioText}>{USER.bio}</Text>
        </Animated.View>

        {/* Donation Progress */}
        <Animated.View
          style={[
            styles.progressCard,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>🏆 Donation Goal</Text>
            <Text style={styles.progressCount}>{USER.totalDonations}/10</Text>
          </View>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[styles.progressFill, { width: `${progressPct}%` }]}
            />
          </View>
          <Text style={styles.progressSub}>
            {10 - USER.totalDonations} more donations to reach Gold Donor
          </Text>
        </Animated.View>
      </View>

      {/* Stats */}
      <Animated.View
        style={[
          styles.statsRow,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {[
          {
            icon: "water",
            num: USER.totalDonations,
            label: "Donations",
            color: COLORS.primary,
          },
          {
            icon: "people",
            num: "5",
            label: "Lives Saved",
            color: COLORS.success,
          },
          {
            icon: "calendar",
            num: "3",
            label: "Yrs Active",
            color: COLORS.info,
          },
        ].map((s) => (
          <View key={s.label} style={styles.statBox}>
            <View
              style={[styles.statIcon, { backgroundColor: s.color + "18" }]}
            >
              <Ionicons name={s.icon} size={18} color={s.color} />
            </View>
            <Text style={[styles.statNum, { color: s.color }]}>{s.num}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </Animated.View>

      {/* Quick Info */}
      <Animated.View
        style={[
          styles.card,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Text style={styles.cardTitle}>Personal Info</Text>
        {[
          { icon: "call-outline", label: "Phone", value: USER.phone },
          { icon: "mail-outline", label: "Email", value: USER.email },
          { icon: "location-outline", label: "Location", value: USER.location },
          {
            icon: "calendar-outline",
            label: "Age",
            value: `${USER.age} years`,
          },
          { icon: "barbell-outline", label: "Weight", value: USER.weight },
        ].map((item) => (
          <View key={item.label} style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Ionicons name={item.icon} size={16} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
          </View>
        ))}
      </Animated.View>

      {/* Donation Schedule */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Donation Schedule</Text>
        <View style={styles.scheduleRow}>
          <View style={styles.scheduleBox}>
            <Text style={styles.scheduleLabel}>Last Donated</Text>
            <Text style={styles.scheduleValue}>{USER.lastDonated}</Text>
          </View>
          <View
            style={[styles.scheduleBox, { backgroundColor: COLORS.successBg }]}
          >
            <Text style={[styles.scheduleLabel, { color: COLORS.success }]}>
              Next Eligible
            </Text>
            <Text style={[styles.scheduleValue, { color: COLORS.success }]}>
              {USER.nextEligible}
            </Text>
          </View>
        </View>
        <View style={styles.vitalRow}>
          <View style={styles.vitalBox}>
            <Ionicons name="pulse" size={16} color={COLORS.primary} />
            <Text style={styles.vitalLabel}>Blood Pressure</Text>
            <Text style={styles.vitalVal}>{USER.bloodPressure}</Text>
          </View>
          <View style={styles.vitalBox}>
            <Ionicons name="water" size={16} color={COLORS.info} />
            <Text style={styles.vitalLabel}>Hemoglobin</Text>
            <Text style={styles.vitalVal}>{USER.hemoglobin}</Text>
          </View>
        </View>
      </View>

      {/* Medical Profile */}
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle}>Medical Profile</Text>
          <View style={styles.safeBadge}>
            <Ionicons
              name="shield-checkmark"
              size={13}
              color={COLORS.success}
            />
            <Text style={styles.safeBadgeText}>All Clear</Text>
          </View>
        </View>
        <View style={styles.medGrid}>
          {[
            { label: "Smoker", val: USER.smoker },
            { label: "Hepatitis B", val: USER.hepatitisB },
            { label: "Hepatitis C", val: USER.hepatitisC },
            { label: "HIV", val: USER.hiv },
            { label: "Diabetes", val: USER.diabetic },
            { label: "Heart Disease", val: USER.heartDisease },
          ].map((item) => (
            <View
              key={item.label}
              style={[
                styles.medBadge,
                {
                  backgroundColor: item.val
                    ? COLORS.dangerBg
                    : COLORS.successBg,
                },
              ]}
            >
              <Ionicons
                name={item.val ? "close-circle" : "checkmark-circle"}
                size={14}
                color={item.val ? COLORS.danger : COLORS.success}
              />
              <Text
                style={[
                  styles.medBadgeText,
                  { color: item.val ? COLORS.danger : COLORS.success },
                ]}
              >
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Before Donating Guide */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Before You Donate 💡</Text>
        <Text style={styles.cardSub}>Important things to know and prepare</Text>
        {BEFORE_DONATING.map((item, i) => (
          <View key={i} style={styles.tipRow}>
            <View
              style={[
                styles.tipIconBox,
                { backgroundColor: item.color + "18" },
              ]}
            >
              <Ionicons name={item.icon} size={18} color={item.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.tipTitle}>{item.title}</Text>
              <Text style={styles.tipDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Donation History */}
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle}>Donation History</Text>
          <TouchableOpacity onPress={() => setShowAllHistory(!showAllHistory)}>
            <Text style={styles.seeAll}>
              {showAllHistory ? "Collapse" : "See all"}
            </Text>
          </TouchableOpacity>
        </View>
        {(showAllHistory ? DONATION_HISTORY : DONATION_HISTORY.slice(0, 2)).map(
          (d, i) => (
            <View key={i} style={styles.historyRow}>
              <View style={styles.historyIconBox}>
                <Ionicons name="water" size={18} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.historyHospital}>
                  {d.hospital} {d.badge}
                </Text>
                <Text style={styles.historyDate}>{d.date}</Text>
              </View>
              <View style={styles.unitBadge}>
                <Text style={styles.unitText}>{d.units} unit</Text>
              </View>
            </View>
          ),
        )}
      </View>

      {/* Edit Button */}
      <TouchableOpacity style={styles.editBtn}>
        <Ionicons name="create-outline" size={18} color="#fff" />
        <Text style={styles.editBtnText}>Edit Profile</Text>
      </TouchableOpacity>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray100 },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 55,
    paddingBottom: 24,
    overflow: "hidden",
  },
  headerBg: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: COLORS.primaryDark,
    top: -100,
    right: -80,
    opacity: 0.4,
  },
  heroContent: { alignItems: "center", paddingHorizontal: 20 },
  avatarContainer: { position: "relative", marginBottom: 12 },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.5)",
  },
  avatarLetter: { fontSize: 36, fontWeight: "800", color: "#fff" },
  editAvatarBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  userName: { fontSize: 22, fontWeight: "800", color: "#fff" },
  bloodBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    marginVertical: 6,
  },
  bloodBadgeText: { color: "#fff", fontWeight: "900", fontSize: 16 },
  bioText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 19,
  },
  progressCard: {
    margin: 16,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: RADIUS.lg,
    padding: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  progressTitle: { color: "#fff", fontWeight: "700", fontSize: 14 },
  progressCount: { color: "#fff", fontWeight: "800", fontSize: 16 },
  progressTrack: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 4,
  },
  progressFill: { height: 8, backgroundColor: "#fff", borderRadius: 4 },
  progressSub: { color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 8 },
  statsRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 16,
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: RADIUS.md,
    padding: 14,
    alignItems: "center",
    ...SHADOW.small,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  statNum: { fontSize: 18, fontWeight: "800" },
  statLabel: { fontSize: 11, color: COLORS.gray500, marginTop: 2 },
  card: {
    margin: 16,
    marginTop: 0,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: RADIUS.lg,
    padding: 18,
    ...SHADOW.small,
  },
  cardTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.black,
    marginBottom: 14,
  },
  cardSub: {
    fontSize: 12,
    color: COLORS.gray400,
    marginTop: -10,
    marginBottom: 14,
  },
  seeAll: { color: COLORS.primary, fontWeight: "600", fontSize: 13 },
  safeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  safeBadgeText: { color: COLORS.success, fontSize: 11, fontWeight: "700" },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  infoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.primaryBg,
    alignItems: "center",
    justifyContent: "center",
  },
  infoLabel: { fontSize: 11, color: COLORS.gray400 },
  infoValue: { fontSize: 14, fontWeight: "600", color: COLORS.black },
  scheduleRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  scheduleBox: {
    flex: 1,
    backgroundColor: COLORS.primaryBg,
    borderRadius: RADIUS.md,
    padding: 12,
  },
  scheduleLabel: { fontSize: 11, color: COLORS.primary, fontWeight: "600" },
  scheduleValue: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
    marginTop: 2,
  },
  vitalRow: { flexDirection: "row", gap: 10 },
  vitalBox: {
    flex: 1,
    backgroundColor: COLORS.gray100,
    borderRadius: RADIUS.md,
    padding: 12,
    alignItems: "center",
  },
  vitalLabel: { fontSize: 11, color: COLORS.gray400, marginTop: 4 },
  vitalVal: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.black,
    marginTop: 2,
  },
  medGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  medBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  medBadgeText: { fontSize: 12, fontWeight: "600" },
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 16,
  },
  tipIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tipTitle: { fontSize: 14, fontWeight: "700", color: COLORS.black },
  tipDesc: {
    fontSize: 12,
    color: COLORS.gray500,
    marginTop: 3,
    lineHeight: 18,
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  historyIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.primaryBg,
    alignItems: "center",
    justifyContent: "center",
  },
  historyHospital: { fontSize: 14, fontWeight: "600", color: COLORS.black },
  historyDate: { fontSize: 12, color: COLORS.gray400, marginTop: 2 },
  unitBadge: {
    backgroundColor: COLORS.primaryBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  unitText: { color: COLORS.primary, fontSize: 12, fontWeight: "700" },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    margin: 16,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: 15,
    ...SHADOW.large,
  },
  editBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
