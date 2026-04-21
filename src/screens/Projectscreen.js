import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SHADOW, RADIUS } from "../components/theme";

const { width } = Dimensions.get("window");

const CAMPAIGNS = [
  {
    id: "1",
    title: "Thalassemia Blood Fund",
    category: "Emergency",
    desc: "Monthly blood support for 12 children with thalassemia at Dhaka Children's Hospital.",
    goal: 50000,
    raised: 32400,
    donors: 87,
    daysLeft: 14,
    urgent: true,
    icon: "🩸",
    color: COLORS.primary,
  },
  {
    id: "2",
    title: "Cancer Patient Support",
    category: "Oncology",
    desc: "Help cover blood transfusion costs for low-income cancer patients in Rajshahi.",
    goal: 80000,
    raised: 61000,
    donors: 134,
    daysLeft: 21,
    urgent: false,
    icon: "💛",
    color: COLORS.warning,
  },
  {
    id: "3",
    title: "Rural Blood Bank Drive",
    category: "Infrastructure",
    desc: "Equipping the Barisal district hospital blood bank with modern storage facilities.",
    goal: 120000,
    raised: 45000,
    donors: 56,
    daysLeft: 45,
    urgent: false,
    icon: "🏥",
    color: COLORS.info,
  },
  {
    id: "4",
    title: "Accident Victim Relief",
    category: "Emergency",
    desc: "Rapid blood supply for road accident victims in Sylhet with no family support.",
    goal: 30000,
    raised: 29500,
    donors: 63,
    daysLeft: 3,
    urgent: true,
    icon: "🚑",
    color: "#E53935",
  },
];

const IMPACT = [
  { num: "4,200+", label: "Lives Impacted", icon: "heart" },
  { num: "BDT 12L", label: "Funds Raised", icon: "cash" },
  { num: "28", label: "Campaigns", icon: "megaphone" },
];

export default function ProjectScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [selectedCat, setSelectedCat] = useState("All");
  const categories = ["All", "Emergency", "Oncology", "Infrastructure"];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const filtered =
    selectedCat === "All"
      ? CAMPAIGNS
      : CAMPAIGNS.filter((c) => c.category === selectedCat);

  const CampaignCard = ({ item, index }) => {
    const pct = Math.min((item.raised / item.goal) * 100, 100);
    const cardAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.spring(cardAnim, {
        toValue: 1,
        tension: 50,
        friction: 9,
        delay: index * 80,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.campaignCard,
          {
            opacity: cardAnim,
            transform: [
              {
                translateY: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [40, 0],
                }),
              },
            ],
          },
        ]}
      >
        {item.urgent && (
          <View style={styles.urgentRibbon}>
            <Text style={styles.urgentRibbonText}>🚨 URGENT</Text>
          </View>
        )}

        <View style={styles.campaignHeader}>
          <View
            style={[
              styles.campaignIcon,
              { backgroundColor: item.color + "18" },
            ]}
          >
            <Text style={{ fontSize: 26 }}>{item.icon}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={styles.categoryRow}>
              <View
                style={[
                  styles.categoryTag,
                  { backgroundColor: item.color + "18" },
                ]}
              >
                <Text style={[styles.categoryText, { color: item.color }]}>
                  {item.category}
                </Text>
              </View>
              {item.daysLeft <= 7 && (
                <View style={styles.daysTag}>
                  <Ionicons
                    name="time-outline"
                    size={11}
                    color={COLORS.danger}
                  />
                  <Text style={styles.daysText}>{item.daysLeft}d left</Text>
                </View>
              )}
            </View>
            <Text style={styles.campaignTitle}>{item.title}</Text>
          </View>
        </View>

        <Text style={styles.campaignDesc}>{item.desc}</Text>

        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.raisedText}>
              ৳{(item.raised / 1000).toFixed(1)}k raised
            </Text>
            <Text style={styles.pctText}>{Math.round(pct)}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                { width: `${pct}%`, backgroundColor: item.color },
              ]}
            />
          </View>
          <View style={styles.goalRow}>
            <Text style={styles.goalText}>
              of ৳{(item.goal / 1000).toFixed(0)}k goal
            </Text>
            <View style={styles.donorCount}>
              <Ionicons
                name="people-outline"
                size={12}
                color={COLORS.gray400}
              />
              <Text style={styles.donorCountText}>{item.donors} donors</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.shareBtn}>
            <Ionicons
              name="share-social-outline"
              size={18}
              color={COLORS.gray500}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.donateBtn, { backgroundColor: item.color }]}
          >
            <Ionicons name="heart" size={16} color="#fff" />
            <Text style={styles.donateBtnText}>Donate Now</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <View>
          <Text style={styles.headerTitle}>Community</Text>
          <Text style={styles.headerSub}>Projects & Fundraising</Text>
        </View>
        <TouchableOpacity style={styles.createBtn}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.createBtnText}>Start</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
      >
        {/* Impact Stats */}
        <Animated.View style={[styles.impactRow, { opacity: fadeAnim }]}>
          {IMPACT.map((item) => (
            <View key={item.label} style={styles.impactBox}>
              <View style={styles.impactIconBox}>
                <Ionicons name={item.icon} size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.impactNum}>{item.num}</Text>
              <Text style={styles.impactLabel}>{item.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Filter (sticky) */}
        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.filterChip,
                  selectedCat === cat && styles.filterChipActive,
                ]}
                onPress={() => setSelectedCat(cat)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedCat === cat && styles.filterChipTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Banner */}
        <View style={styles.featuredBanner}>
          <View style={styles.featuredLeft}>
            <Text style={styles.featuredLabel}>⭐ FEATURED</Text>
            <Text style={styles.featuredTitle}>
              Join our Blood{"\n"}Donation Drive
            </Text>
            <Text style={styles.featuredSub}>Save lives this Ramadan</Text>
            <TouchableOpacity style={styles.featuredBtn}>
              <Text style={styles.featuredBtnText}>Learn More</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 72 }}>🩸</Text>
        </View>

        {/* Campaign Cards */}
        <View style={styles.campaignsSection}>
          <Text style={styles.sectionTitle}>Active Campaigns</Text>
          {filtered.map((item, i) => (
            <CampaignCard key={item.id} item={item} index={i} />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray100 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 55,
    paddingBottom: 12,
    paddingHorizontal: 20,
    backgroundColor: COLORS.gray100,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.black,
    letterSpacing: -0.5,
  },
  headerSub: { fontSize: 13, color: COLORS.gray500, marginTop: 1 },
  createBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: RADIUS.full,
    ...SHADOW.large,
  },
  createBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  impactRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 6,
    gap: 10,
  },
  impactBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: RADIUS.md,
    padding: 12,
    alignItems: "center",
    ...SHADOW.small,
  },
  impactIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.primaryBg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  impactNum: { fontSize: 15, fontWeight: "800", color: COLORS.black },
  impactLabel: {
    fontSize: 10,
    color: COLORS.gray400,
    marginTop: 2,
    textAlign: "center",
  },
  filterSection: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.gray100,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: COLORS.gray200,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: { fontSize: 13, fontWeight: "600", color: COLORS.gray500 },
  filterChipTextActive: { color: "#fff" },
  featuredBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    padding: 22,
    overflow: "hidden",
  },
  featuredLeft: { flex: 1 },
  featuredLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "700",
    letterSpacing: 1,
  },
  featuredTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    marginVertical: 6,
    lineHeight: 28,
  },
  featuredSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    marginBottom: 12,
  },
  featuredBtn: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: RADIUS.full,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },
  featuredBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  campaignsSection: { paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.black,
    marginBottom: 12,
  },
  campaignCard: {
    backgroundColor: "#fff",
    borderRadius: RADIUS.xl,
    padding: 18,
    marginBottom: 14,
    ...SHADOW.medium,
    overflow: "hidden",
  },
  urgentRibbon: {
    position: "absolute",
    top: 14,
    right: -2,
    backgroundColor: COLORS.danger,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  urgentRibbonText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  campaignHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  campaignIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  categoryText: { fontSize: 11, fontWeight: "700" },
  daysTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: COLORS.dangerBg,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  daysText: { fontSize: 11, color: COLORS.danger, fontWeight: "700" },
  campaignTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.black,
    lineHeight: 22,
  },
  campaignDesc: {
    fontSize: 13,
    color: COLORS.gray500,
    lineHeight: 20,
    marginBottom: 14,
  },
  progressSection: { marginBottom: 16 },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  raisedText: { fontSize: 14, fontWeight: "700", color: COLORS.black },
  pctText: { fontSize: 14, fontWeight: "700", color: COLORS.primary },
  progressTrack: {
    height: 8,
    backgroundColor: COLORS.gray200,
    borderRadius: 4,
  },
  progressFill: { height: 8, borderRadius: 4 },
  goalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  goalText: { fontSize: 12, color: COLORS.gray400 },
  donorCount: { flexDirection: "row", alignItems: "center", gap: 4 },
  donorCountText: { fontSize: 12, color: COLORS.gray400 },
  cardActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  shareBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.gray100,
    alignItems: "center",
    justifyContent: "center",
  },
  donateBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    ...SHADOW.medium,
  },
  donateBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
