import React, { useRef, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SHADOW, RADIUS } from "../components/theme";

const HISTORY = [
  {
    id: "1",
    type: "donated",
    date: "20 Jan 2026",
    hospital: "Khulna Medical College",
    units: 1,
    recipient: "Emergency Surgery Patient",
    blood: "B+",
    impact: "Saved a life",
  },
  {
    id: "2",
    type: "donated",
    date: "10 Oct 2025",
    hospital: "Shaheed Ziaur Rahman Medical",
    units: 1,
    recipient: "Thalassemia Child",
    blood: "B+",
    impact: "Monthly support",
  },
  {
    id: "3",
    type: "requested",
    date: "12 Jul 2025",
    hospital: "KMC Hospital",
    units: 1,
    blood: "B+",
    status: "fulfilled",
  },
  {
    id: "4",
    type: "donated",
    date: "22 Mar 2025",
    hospital: "Khulna Medical College",
    units: 1,
    recipient: "Post-op Patient",
    blood: "B+",
    impact: "Recovery support",
  },
  {
    id: "5",
    type: "donated",
    date: "08 Nov 2024",
    hospital: "District Hospital",
    units: 1,
    recipient: "Accident Victim",
    blood: "B+",
    impact: "Critical care",
  },
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function HistoryScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const ActivityCard = ({ item, index }) => {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.spring(anim, {
        toValue: 1,
        tension: 50,
        friction: 9,
        delay: index * 80,
        useNativeDriver: true,
      }).start();
    }, []);

    const isDonated = item.type === "donated";

    return (
      <Animated.View
        style={[
          styles.activityCard,
          {
            opacity: anim,
            transform: [
              {
                translateX: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View
          style={[
            styles.activityIcon,
            { backgroundColor: isDonated ? COLORS.primaryBg : COLORS.infoBg },
          ]}
        >
          <Ionicons
            name={isDonated ? "water" : "hand-left"}
            size={22}
            color={isDonated ? COLORS.primary : COLORS.info}
          />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.activityTopRow}>
            <Text style={styles.activityType}>
              {isDonated ? "Blood Donated" : "Blood Requested"}
            </Text>
            <View
              style={[styles.bloodTag, { backgroundColor: COLORS.primaryBg }]}
            >
              <Text style={styles.bloodTagText}>{item.blood}</Text>
            </View>
          </View>
          <Text style={styles.hospitalText}>{item.hospital}</Text>
          {isDonated && item.recipient && (
            <Text style={styles.recipientText}>For: {item.recipient}</Text>
          )}
          <View style={styles.activityFooter}>
            <View style={styles.dateRow}>
              <Ionicons
                name="calendar-outline"
                size={12}
                color={COLORS.gray400}
              />
              <Text style={styles.dateText}>{item.date}</Text>
            </View>
            {isDonated && item.impact && (
              <View style={styles.impactTag}>
                <Ionicons name="heart" size={10} color={COLORS.success} />
                <Text style={styles.impactText}>{item.impact}</Text>
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    );
  };

  // Build monthly grid (mock data)
  const monthlyGrid = MONTHS.map((m, i) => ({
    month: m,
    count: [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0][i],
  }));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <Text style={styles.headerTitle}>Activity</Text>
        <Text style={styles.headerSub}>Your donation & request history</Text>
      </Animated.View>

      {/* Year Summary */}
      <Animated.View style={[styles.yearCard, { opacity: fadeAnim }]}>
        <Text style={styles.yearTitle}>2025 — Your Year in Blood 🩸</Text>
        <View style={styles.yearStats}>
          {[
            {
              num: "3",
              label: "Donations",
              icon: "water",
              color: COLORS.primary,
            },
            {
              num: "1",
              label: "Requests",
              icon: "hand-left",
              color: COLORS.info,
            },
            { num: "3", label: "Lives", icon: "heart", color: COLORS.success },
          ].map((s) => (
            <View key={s.label} style={styles.yearStat}>
              <Ionicons name={s.icon} size={18} color={s.color} />
              <Text style={[styles.yearStatNum, { color: s.color }]}>
                {s.num}
              </Text>
              <Text style={styles.yearStatLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Monthly Activity Grid */}
        <View style={styles.monthGrid}>
          {monthlyGrid.map((m) => (
            <View key={m.month} style={styles.monthItem}>
              <View
                style={[
                  styles.monthDot,
                  {
                    backgroundColor:
                      m.count > 0 ? COLORS.primary : COLORS.gray200,
                  },
                ]}
              />
              <Text style={styles.monthLabel}>{m.month}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* Eligibility Status */}
      <View style={styles.eligCard}>
        <View style={styles.eligLeft}>
          <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.eligTitle}>You are eligible to donate!</Text>
            <Text style={styles.eligSub}>Next eligible date: 20 Apr 2026</Text>
          </View>
        </View>
      </View>

      {/* History List */}
      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>All Activity</Text>
        {HISTORY.map((item, i) => (
          <ActivityCard key={item.id} item={item} index={i} />
        ))}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray100 },
  header: { paddingTop: 55, paddingHorizontal: 20, paddingBottom: 12 },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.black,
    letterSpacing: -0.5,
  },
  headerSub: { fontSize: 13, color: COLORS.gray500, marginTop: 2 },
  yearCard: {
    margin: 16,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    padding: 20,
  },
  yearTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 14,
  },
  yearStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  yearStat: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: RADIUS.md,
    padding: 14,
    width: 80,
  },
  yearStatNum: { fontSize: 22, fontWeight: "800", color: "#fff", marginTop: 4 },
  yearStatLabel: { fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2 },
  monthGrid: { flexDirection: "row", justifyContent: "space-between" },
  monthItem: { alignItems: "center", gap: 4 },
  monthDot: { width: 14, height: 14, borderRadius: 7 },
  monthLabel: { fontSize: 9, color: "rgba(255,255,255,0.6)" },
  eligCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: COLORS.successBg,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.success + "30",
  },
  eligLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  eligTitle: { fontSize: 14, fontWeight: "700", color: COLORS.success },
  eligSub: { fontSize: 12, color: COLORS.success + "99", marginTop: 2 },
  listSection: { paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.black,
    marginBottom: 12,
  },
  activityCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 10,
    ...SHADOW.small,
  },
  activityIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  activityTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activityType: { fontSize: 14, fontWeight: "700", color: COLORS.black },
  bloodTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  bloodTagText: { color: COLORS.primary, fontSize: 11, fontWeight: "700" },
  hospitalText: { fontSize: 13, color: COLORS.gray600, marginTop: 3 },
  recipientText: { fontSize: 12, color: COLORS.gray400, marginTop: 2 },
  activityFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  dateText: { fontSize: 12, color: COLORS.gray400 },
  impactTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  impactText: { fontSize: 11, color: COLORS.success, fontWeight: "600" },
});
