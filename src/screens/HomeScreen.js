import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SHADOW, RADIUS } from "../components/theme";

const { width } = Dimensions.get("window");

const BLOOD_GROUPS = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const DONORS = [
  {
    id: "1",
    name: "Arif Rahman",
    blood: "A+",
    location: "Dhaka",
    lastDonated: "2 months ago",
    available: true,
    donations: 12,
    distance: "2.3 km",
  },
  {
    id: "2",
    name: "Sara Khan",
    blood: "O-",
    location: "Khulna",
    lastDonated: "4 months ago",
    available: true,
    donations: 7,
    distance: "5.1 km",
  },
  {
    id: "3",
    name: "Tanvir Alam",
    blood: "B+",
    location: "Chittagong",
    lastDonated: "1 month ago",
    available: false,
    donations: 3,
    distance: "8.0 km",
  },
  {
    id: "4",
    name: "Nadia Islam",
    blood: "AB+",
    location: "Dhaka",
    lastDonated: "6 months ago",
    available: true,
    donations: 18,
    distance: "3.7 km",
  },
  {
    id: "5",
    name: "Hasan Ali",
    blood: "O+",
    location: "Sylhet",
    lastDonated: "3 months ago",
    available: true,
    donations: 5,
    distance: "1.2 km",
  },
];

const URGENTS = [
  {
    id: "u1",
    blood: "O-",
    hospital: "Dhaka Medical",
    patient: "Emergency Surgery",
    posted: "10 min ago",
  },
  {
    id: "u2",
    blood: "AB+",
    hospital: "Square Hospital",
    patient: "Thalassemia Patient",
    posted: "1 hr ago",
  },
];

export default function HomeScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [searchFocused, setSearchFocused] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const statsAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(statsAnim, {
        toValue: 1,
        tension: 50,
        friction: 9,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.12,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const filtered = DONORS.filter(
    (d) =>
      (selectedGroup === "All" || d.blood === selectedGroup) &&
      (d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.location.toLowerCase().includes(search.toLowerCase())),
  );

  const BloodGroupPill = ({ group }) => (
    <TouchableOpacity
      style={[styles.pill, selectedGroup === group && styles.pillActive]}
      onPress={() => setSelectedGroup(group)}
    >
      <Text
        style={[
          styles.pillText,
          selectedGroup === group && styles.pillTextActive,
        ]}
      >
        {group}
      </Text>
    </TouchableOpacity>
  );

  const UrgentCard = ({ item }) => (
    <View style={styles.urgentCard}>
      <Animated.View
        style={[styles.urgentBadge, { transform: [{ scale: pulseAnim }] }]}
      >
        <Text style={styles.urgentBadgeText}>{item.blood}</Text>
      </Animated.View>
      <View style={{ flex: 1 }}>
        <View style={styles.urgentHeader}>
          <Text style={styles.urgentLabel}>🚨 URGENT</Text>
          <Text style={styles.urgentTime}>{item.posted}</Text>
        </View>
        <Text style={styles.urgentPatient}>{item.patient}</Text>
        <View style={styles.urgentLocation}>
          <Ionicons
            name="location-outline"
            size={12}
            color="rgba(255,255,255,0.8)"
          />
          <Text style={styles.urgentHospital}>{item.hospital}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.respondBtn}>
        <Text style={styles.respondText}>Respond</Text>
      </TouchableOpacity>
    </View>
  );

  const DonorCard = ({ item }) => (
    <TouchableOpacity
      style={styles.donorCard}
      activeOpacity={0.9}
      onPress={() => navigation.navigate("DonorDetail", { donor: item })}
    >
      <View style={[styles.donorAvatar, { backgroundColor: COLORS.primaryBg }]}>
        <Text style={styles.donorAvatarText}>{item.name[0]}</Text>
        {item.available && <View style={styles.availableDot} />}
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.donorTopRow}>
          <Text style={styles.donorName}>{item.name}</Text>
          <View style={styles.bloodTag}>
            <Text style={styles.bloodTagText}>{item.blood}</Text>
          </View>
        </View>
        <View style={styles.donorMeta}>
          <Ionicons name="location-outline" size={12} color={COLORS.gray400} />
          <Text style={styles.donorMetaText}>{item.location}</Text>
          <Text style={styles.dot}>·</Text>
          <Ionicons name="navigate-outline" size={12} color={COLORS.gray400} />
          <Text style={styles.donorMetaText}>{item.distance}</Text>
        </View>
        <View style={styles.donorMeta}>
          <Ionicons name="water-outline" size={12} color={COLORS.primary} />
          <Text style={[styles.donorMetaText, { color: COLORS.primary }]}>
            {item.donations} donations
          </Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.donorMetaText}>Last: {item.lastDonated}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.callBtn}>
        <Ionicons name="call" size={16} color={COLORS.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <View>
          <Text style={styles.greeting}>Good morning 👋</Text>
          <Text style={styles.headerTitle}>Find a Donor</Text>
        </View>
        <TouchableOpacity style={styles.notifBtn}>
          <Ionicons
            name="notifications-outline"
            size={22}
            color={COLORS.black}
          />
          <View style={styles.notifDot} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
      >
        {/* Stats Row */}
        <Animated.View
          style={[
            styles.statsRow,
            { opacity: statsAnim, transform: [{ scale: statsAnim }] },
          ]}
        >
          {[
            {
              num: "1,240",
              label: "Donors",
              icon: "people",
              color: COLORS.primary,
            },
            {
              num: "456",
              label: "Saved",
              icon: "heart",
              color: COLORS.success,
            },
            {
              num: "38",
              label: "Requests",
              icon: "alert-circle",
              color: COLORS.warning,
            },
          ].map((stat) => (
            <View key={stat.label} style={styles.statBox}>
              <View
                style={[
                  styles.statIconBox,
                  { backgroundColor: stat.color + "18" },
                ]}
              >
                <Ionicons name={stat.icon} size={18} color={stat.color} />
              </View>
              <Text style={[styles.statNum, { color: stat.color }]}>
                {stat.num}
              </Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Search Bar (sticky) */}
        <View style={styles.searchSection}>
          <View
            style={[styles.searchWrap, searchFocused && styles.searchFocused]}
          >
            <Ionicons name="search-outline" size={18} color={COLORS.gray400} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or location..."
              placeholderTextColor={COLORS.gray400}
              value={search}
              onChangeText={setSearch}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={COLORS.gray400}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Urgent Requests */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Urgent Requests</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("RequestBlood")}
            >
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {URGENTS.map((u) => (
              <UrgentCard key={u.id} item={u} />
            ))}
          </ScrollView>
        </View>

        {/* Blood Group Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Donors</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 12 }}
          >
            {BLOOD_GROUPS.map((g) => (
              <BloodGroupPill key={g} group={g} />
            ))}
          </ScrollView>
        </View>

        {/* Donor List */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 100 }}>
          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={{ fontSize: 40 }}>🩸</Text>
              <Text style={styles.emptyText}>No donors found</Text>
              <Text style={styles.emptySubText}>
                Try changing your filter or search
              </Text>
            </View>
          ) : (
            filtered.map((item) => <DonorCard key={item.id} item={item} />)
          )}
        </View>
      </ScrollView>

      {/* SOS Floating Button */}
      <Animated.View
        style={[styles.sosFab, { transform: [{ scale: pulseAnim }] }]}
      >
        <TouchableOpacity
          style={styles.sosFabBtn}
          onPress={() => navigation.navigate("RequestBlood")}
          activeOpacity={0.85}
        >
          <Ionicons name="water" size={18} color="#fff" />
          <Text style={styles.sosFabText}>Need Blood?</Text>
        </TouchableOpacity>
      </Animated.View>
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
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: COLORS.gray100,
  },
  greeting: { fontSize: 13, color: COLORS.gray500, marginBottom: 2 },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.black,
    letterSpacing: -0.5,
  },
  notifBtn: {
    position: "relative",
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    ...SHADOW.small,
  },
  notifDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    borderWidth: 1.5,
    borderColor: COLORS.gray100,
  },
  statsRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 6,
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
  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  statNum: { fontSize: 18, fontWeight: "800" },
  statLabel: { fontSize: 11, color: COLORS.gray500, marginTop: 2 },
  searchSection: { padding: 16, backgroundColor: COLORS.gray100 },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    borderRadius: RADIUS.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: COLORS.gray200,
  },
  searchFocused: { borderColor: COLORS.primary },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.black },
  section: { paddingHorizontal: 20, marginBottom: 16 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: COLORS.black },
  seeAll: { fontSize: 13, color: COLORS.primary, fontWeight: "600" },
  urgentCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginRight: 14,
    marginTop: 12,
    width: width * 0.7,
  },
  urgentBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  urgentBadgeText: { color: "#fff", fontWeight: "900", fontSize: 15 },
  urgentHeader: { flexDirection: "row", justifyContent: "space-between" },
  urgentLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "700",
  },
  urgentTime: { fontSize: 11, color: "rgba(255,255,255,0.6)" },
  urgentPatient: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    marginTop: 2,
  },
  urgentLocation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 3,
  },
  urgentHospital: { color: "rgba(255,255,255,0.75)", fontSize: 12 },
  respondBtn: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: RADIUS.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  respondText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: COLORS.gray200,
    marginRight: 8,
  },
  pillActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  pillText: { fontSize: 13, fontWeight: "600", color: COLORS.gray600 },
  pillTextActive: { color: "#fff" },
  donorCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: RADIUS.lg,
    padding: 14,
    marginBottom: 10,
    ...SHADOW.small,
  },
  donorAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  donorAvatarText: { fontSize: 22, fontWeight: "800", color: COLORS.primary },
  availableDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: "#fff",
  },
  donorTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  donorName: { fontSize: 15, fontWeight: "700", color: COLORS.black },
  bloodTag: {
    backgroundColor: COLORS.primaryBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  bloodTagText: { color: COLORS.primary, fontSize: 12, fontWeight: "700" },
  donorMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  donorMetaText: { fontSize: 12, color: COLORS.gray500 },
  dot: { color: COLORS.gray300, fontSize: 10 },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryBg,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: { alignItems: "center", paddingVertical: 40 },
  emptyText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.gray700,
    marginTop: 10,
  },
  emptySubText: { fontSize: 13, color: COLORS.gray400, marginTop: 4 },
  sosFab: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
  },
  sosFabBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: RADIUS.full,
    elevation: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
  },
  sosFabText: { color: "#fff", fontSize: 14, fontWeight: "800" },
});
