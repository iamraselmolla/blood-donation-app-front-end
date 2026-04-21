import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SHADOW, RADIUS } from "../components/theme";

const { width, height } = Dimensions.get("window");

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const URGENCY_LEVELS = [
  {
    key: "critical",
    label: "Critical",
    desc: "Within hours",
    color: "#B71C1C",
    bg: "#FFEBEE",
    icon: "flame",
  },
  {
    key: "urgent",
    label: "Urgent",
    desc: "Within 24 hrs",
    color: "#E65100",
    bg: "#FFF3E0",
    icon: "alert-circle",
  },
  {
    key: "normal",
    label: "Normal",
    desc: "Within 3 days",
    color: "#1B5E20",
    bg: "#E8F5E9",
    icon: "time",
  },
];
const HOSPITALS = [
  "Khulna Medical College Hospital",
  "Shaheed Sheikh Abu Naser Specialized Hospital",
  "Ad-din Hospital Khulna",
  "Dhaka Medical College Hospital",
  "Square Hospital Dhaka",
  "Sir Salimullah Medical College",
  "Other",
];
const RELATIONS = [
  "Self",
  "Son / Daughter",
  "Father / Mother",
  "Spouse",
  "Sibling",
  "Friend",
  "Other",
];

// Sample existing requests data
const SAMPLE_REQUESTS = [
  {
    id: "r1",
    name: "Karim Hossain",
    blood: "O-",
    hospital: "Khulna Medical College Hospital",
    units: 2,
    urgency: "critical",
    district: "Khulna",
    phone: "+880 1712-111222",
    posted: "10 min ago",
    reason: "Emergency surgery after road accident",
    relation: "Father",
    age: 52,
    fulfilled: false,
  },
  {
    id: "r2",
    name: "Sumaiya Akter",
    blood: "AB+",
    hospital: "Square Hospital Dhaka",
    units: 1,
    urgency: "urgent",
    district: "Dhaka",
    phone: "+880 1811-333444",
    posted: "1 hr ago",
    reason: "Thalassemia - monthly transfusion needed",
    relation: "Self",
    age: 19,
    fulfilled: false,
  },
  {
    id: "r3",
    name: "Rafiqul Islam",
    blood: "B-",
    hospital: "Dhaka Medical College Hospital",
    units: 3,
    urgency: "urgent",
    district: "Dhaka",
    phone: "+880 1911-555666",
    posted: "3 hrs ago",
    reason: "Post-operative bleeding complication",
    relation: "Mother",
    age: 63,
    fulfilled: false,
  },
  {
    id: "r4",
    name: "Nusrat Jahan",
    blood: "A+",
    hospital: "Ad-din Hospital Khulna",
    units: 1,
    urgency: "normal",
    district: "Khulna",
    phone: "+880 1612-777888",
    posted: "5 hrs ago",
    reason: "Scheduled surgery — kidney transplant",
    relation: "Sibling",
    age: 34,
    fulfilled: false,
  },
  {
    id: "r5",
    name: "Mizanur Rahman",
    blood: "O+",
    hospital: "Sir Salimullah Medical College",
    units: 2,
    urgency: "normal",
    district: "Dhaka",
    phone: "+880 1512-999000",
    posted: "1 day ago",
    reason: "Cancer chemotherapy support",
    relation: "Spouse",
    age: 45,
    fulfilled: true,
  },
];

const URGENCY_MAP = {
  critical: {
    label: "Critical",
    color: "#B71C1C",
    bg: "#FFEBEE",
    icon: "flame",
  },
  urgent: {
    label: "Urgent",
    color: "#E65100",
    bg: "#FFF3E0",
    icon: "alert-circle",
  },
  normal: { label: "Normal", color: "#1B5E20", bg: "#E8F5E9", icon: "time" },
};

export default function RequestBloodScreen({ navigation }) {
  const [tab, setTab] = useState("list"); // "list" | "form"
  const [showForm, setShowForm] = useState(false);
  const [filterBlood, setFilterBlood] = useState("All");
  const [filterUrgency, setFilterUrgency] = useState("All");
  const [focused, setFocused] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideUpAnim = useRef(new Animated.Value(height)).current;

  const [form, setForm] = useState({
    patientName: "",
    patientAge: "",
    bloodGroup: "O+",
    units: "1",
    hospital: "",
    district: "",
    phone: "",
    relation: "Self",
    urgency: "urgent",
    reason: "",
    date: "",
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const openForm = () => {
    setShowForm(true);
    setSubmitted(false);
    Animated.spring(slideUpAnim, {
      toValue: 0,
      tension: 60,
      friction: 12,
      useNativeDriver: true,
    }).start();
  };

  const closeForm = () => {
    Animated.timing(slideUpAnim, {
      toValue: height,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setShowForm(false));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      closeForm();
      setSubmitted(false);
      setForm({
        patientName: "",
        patientAge: "",
        bloodGroup: "O+",
        units: "1",
        hospital: "",
        district: "",
        phone: "",
        relation: "Self",
        urgency: "urgent",
        reason: "",
        date: "",
      });
    }, 2000);
  };

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const filteredRequests = SAMPLE_REQUESTS.filter((r) => {
    const bloodOk = filterBlood === "All" || r.blood === filterBlood;
    const urgencyOk = filterUrgency === "All" || r.urgency === filterUrgency;
    return bloodOk && urgencyOk;
  });

  const InputField = ({
    icon,
    label,
    placeholder,
    value,
    onChangeText,
    keyboardType,
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
          style={{ marginRight: 10 }}
        />
        <TextInput
          style={[
            styles.input,
            multiline && { height: 70, textAlignVertical: "top" },
          ]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray400}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType || "default"}
          onFocus={() => setFocused(id)}
          onBlur={() => setFocused(null)}
          multiline={multiline}
        />
      </View>
    </View>
  );

  const RequestCard = ({ item, index }) => {
    const anim = useRef(new Animated.Value(0)).current;
    const urgency = URGENCY_MAP[item.urgency];

    useEffect(() => {
      Animated.spring(anim, {
        toValue: 1,
        tension: 50,
        friction: 9,
        delay: index * 60,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.requestCard,
          item.fulfilled && styles.requestCardFulfilled,
          {
            opacity: anim,
            transform: [
              {
                translateY: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        {/* Urgency strip */}
        <View
          style={[styles.urgencyStrip, { backgroundColor: urgency.color }]}
        />

        <View style={styles.cardInner}>
          {/* Top row */}
          <View style={styles.cardTopRow}>
            <View style={styles.bloodBigCircle}>
              <Text style={styles.bloodBigText}>{item.blood}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={styles.cardHeaderRow}>
                <View
                  style={[styles.urgencyBadge, { backgroundColor: urgency.bg }]}
                >
                  <Ionicons
                    name={urgency.icon}
                    size={11}
                    color={urgency.color}
                  />
                  <Text style={[styles.urgencyText, { color: urgency.color }]}>
                    {urgency.label}
                  </Text>
                </View>
                {item.fulfilled && (
                  <View style={styles.fulfilledBadge}>
                    <Ionicons
                      name="checkmark-circle"
                      size={12}
                      color={COLORS.success}
                    />
                    <Text style={styles.fulfilledText}>Fulfilled</Text>
                  </View>
                )}
                <Text style={styles.postedTime}>{item.posted}</Text>
              </View>
              <Text style={styles.patientName}>{item.name}</Text>
              <Text style={styles.patientMeta}>
                Age {item.age} · For: {item.relation}
              </Text>
            </View>
            <View style={styles.unitsBox}>
              <Text style={styles.unitsNum}>{item.units}</Text>
              <Text style={styles.unitsLabel}>
                unit{item.units > 1 ? "s" : ""}
              </Text>
            </View>
          </View>

          {/* Hospital */}
          <View style={styles.infoRow}>
            <Ionicons
              name="business-outline"
              size={14}
              color={COLORS.gray400}
            />
            <Text style={styles.infoText} numberOfLines={1}>
              {item.hospital}
            </Text>
          </View>

          {/* Reason */}
          <View style={[styles.infoRow, { marginBottom: 0 }]}>
            <Ionicons
              name="document-text-outline"
              size={14}
              color={COLORS.gray400}
            />
            <Text style={styles.infoText} numberOfLines={2}>
              {item.reason}
            </Text>
          </View>

          {/* Footer */}
          {!item.fulfilled && (
            <View style={styles.cardFooter}>
              <View style={styles.locationRow}>
                <Ionicons
                  name="location-outline"
                  size={13}
                  color={COLORS.gray400}
                />
                <Text style={styles.locationText}>{item.district}</Text>
              </View>
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.callSmallBtn}>
                  <Ionicons name="call" size={14} color={COLORS.primary} />
                  <Text style={styles.callSmallText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.respondBtn}>
                  <Ionicons name="water" size={14} color="#fff" />
                  <Text style={styles.respondText}>I'll Donate</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.black} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Blood Requests</Text>
          <Text style={styles.headerSub}>
            {filteredRequests.filter((r) => !r.fulfilled).length} active
            requests nearby
          </Text>
        </View>
        <View style={{ width: 36 }} />
      </Animated.View>

      {/* Stats Strip */}
      <Animated.View style={[styles.statsStrip, { opacity: fadeAnim }]}>
        {[
          {
            num: SAMPLE_REQUESTS.filter(
              (r) => r.urgency === "critical" && !r.fulfilled,
            ).length,
            label: "Critical",
            color: "#B71C1C",
            icon: "flame",
          },
          {
            num: SAMPLE_REQUESTS.filter(
              (r) => r.urgency === "urgent" && !r.fulfilled,
            ).length,
            label: "Urgent",
            color: "#E65100",
            icon: "alert-circle",
          },
          {
            num: SAMPLE_REQUESTS.filter((r) => r.fulfilled).length,
            label: "Fulfilled",
            color: COLORS.success,
            icon: "checkmark-circle",
          },
        ].map((s) => (
          <View key={s.label} style={styles.statBox}>
            <Ionicons name={s.icon} size={16} color={s.color} />
            <Text style={[styles.statNum, { color: s.color }]}>{s.num}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </Animated.View>

      {/* Filters */}
      <View style={styles.filtersSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 8 }}
        >
          {["All", ...BLOOD_GROUPS].map((g) => (
            <TouchableOpacity
              key={g}
              style={[
                styles.filterChip,
                filterBlood === g && styles.filterChipActive,
              ]}
              onPress={() => setFilterBlood(g)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filterBlood === g && styles.filterChipTextActive,
                ]}
              >
                {g === "All" ? "🩸 All Groups" : g}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {["All", "critical", "urgent", "normal"].map((u) => (
            <TouchableOpacity
              key={u}
              style={[
                styles.filterChip,
                filterUrgency === u && styles.filterChipActive,
              ]}
              onPress={() => setFilterUrgency(u)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filterUrgency === u && styles.filterChipTextActive,
                ]}
              >
                {u === "All" ? "All Urgency" : URGENCY_MAP[u].label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Request List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
      >
        {filteredRequests.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 44 }}>🩸</Text>
            <Text style={styles.emptyTitle}>No requests found</Text>
            <Text style={styles.emptySub}>Try changing your filters</Text>
          </View>
        ) : (
          filteredRequests.map((r, i) => (
            <RequestCard key={r.id} item={r} index={i} />
          ))
        )}
      </ScrollView>

      {/* Floating SOS Button */}
      <Animated.View
        style={[styles.fabWrap, { transform: [{ scale: pulseAnim }] }]}
      >
        <TouchableOpacity
          style={styles.fab}
          onPress={openForm}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={22} color="#fff" />
          <Text style={styles.fabText}>Request Blood</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Request Form Modal */}
      <Modal
        visible={showForm}
        transparent
        animationType="none"
        onRequestClose={closeForm}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} onPress={closeForm} />
          <Animated.View
            style={[
              styles.modalSheet,
              { transform: [{ translateY: slideUpAnim }] },
            ]}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              {/* Handle */}
              <View style={styles.sheetHandle} />
              <View style={styles.sheetHeader}>
                <View>
                  <Text style={styles.sheetTitle}>Request Blood</Text>
                  <Text style={styles.sheetSub}>
                    Fill in all details so donors can help faster
                  </Text>
                </View>
                <TouchableOpacity onPress={closeForm} style={styles.closeBtn}>
                  <Ionicons name="close" size={20} color={COLORS.gray600} />
                </TouchableOpacity>
              </View>

              {submitted ? (
                <View style={styles.successState}>
                  <View style={styles.successCircle}>
                    <Ionicons name="checkmark" size={44} color="#fff" />
                  </View>
                  <Text style={styles.successTitle}>Request Posted!</Text>
                  <Text style={styles.successSub}>
                    Nearby donors have been notified. You'll receive a call
                    soon.
                  </Text>
                </View>
              ) : (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
                  keyboardShouldPersistTaps="handled"
                >
                  {/* Urgency Selector */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Urgency Level *</Text>
                    <View style={styles.urgencyRow}>
                      {URGENCY_LEVELS.map((u) => (
                        <TouchableOpacity
                          key={u.key}
                          style={[
                            styles.urgencyCard,
                            form.urgency === u.key && {
                              borderColor: u.color,
                              borderWidth: 2,
                            },
                            {
                              backgroundColor:
                                form.urgency === u.key ? u.bg : "#fff",
                            },
                          ]}
                          onPress={() => update("urgency", u.key)}
                        >
                          <Ionicons name={u.icon} size={20} color={u.color} />
                          <Text
                            style={[
                              styles.urgencyCardLabel,
                              { color: u.color },
                            ]}
                          >
                            {u.label}
                          </Text>
                          <Text style={styles.urgencyCardDesc}>{u.desc}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Blood Group */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>
                      Blood Group Required *
                    </Text>
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
                              form.bloodGroup === g &&
                                styles.bloodChipTextActive,
                            ]}
                          >
                            {g}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Units */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Units Needed *</Text>
                    <View style={styles.unitsSelector}>
                      {["1", "2", "3", "4", "5+"].map((u) => (
                        <TouchableOpacity
                          key={u}
                          style={[
                            styles.unitChip,
                            form.units === u && styles.unitChipActive,
                          ]}
                          onPress={() => update("units", u)}
                        >
                          <Text
                            style={[
                              styles.unitChipText,
                              form.units === u && styles.unitChipTextActive,
                            ]}
                          >
                            {u}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <InputField
                    id="name"
                    icon="person-outline"
                    label="Patient Full Name *"
                    placeholder="Enter patient name"
                    value={form.patientName}
                    onChangeText={(v) => update("patientName", v)}
                  />
                  <InputField
                    id="age"
                    icon="calendar-outline"
                    label="Patient Age *"
                    placeholder="e.g. 45"
                    value={form.patientAge}
                    onChangeText={(v) => update("patientAge", v)}
                    keyboardType="numeric"
                  />

                  {/* Relation */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>
                      Your Relation to Patient *
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      {RELATIONS.map((r) => (
                        <TouchableOpacity
                          key={r}
                          style={[
                            styles.filterChip,
                            form.relation === r && styles.filterChipActive,
                            { marginBottom: 0 },
                          ]}
                          onPress={() => update("relation", r)}
                        >
                          <Text
                            style={[
                              styles.filterChipText,
                              form.relation === r &&
                                styles.filterChipTextActive,
                            ]}
                          >
                            {r}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  {/* Hospital */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Hospital / Clinic *</Text>
                    <View style={styles.hospitalList}>
                      {HOSPITALS.map((h) => (
                        <TouchableOpacity
                          key={h}
                          style={[
                            styles.hospitalChip,
                            form.hospital === h && styles.hospitalChipActive,
                          ]}
                          onPress={() => update("hospital", h)}
                        >
                          <Text
                            style={[
                              styles.hospitalChipText,
                              form.hospital === h &&
                                styles.hospitalChipTextActive,
                            ]}
                          >
                            {h}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <InputField
                    id="district"
                    icon="location-outline"
                    label="District *"
                    placeholder="e.g. Khulna"
                    value={form.district}
                    onChangeText={(v) => update("district", v)}
                  />
                  <InputField
                    id="phone"
                    icon="call-outline"
                    label="Contact Number *"
                    placeholder="+880 17XX-XXXXXX"
                    value={form.phone}
                    onChangeText={(v) => update("phone", v)}
                    keyboardType="phone-pad"
                  />
                  <InputField
                    id="date"
                    icon="calendar"
                    label="Date Needed By"
                    placeholder="e.g. 22 Apr 2026"
                    value={form.date}
                    onChangeText={(v) => update("date", v)}
                  />
                  <InputField
                    id="reason"
                    icon="document-text-outline"
                    label="Reason for Transfusion *"
                    placeholder="Briefly describe patient condition..."
                    value={form.reason}
                    onChangeText={(v) => update("reason", v)}
                    multiline
                  />

                  {/* Warning */}
                  <View style={styles.warningBox}>
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={16}
                      color={COLORS.warning}
                    />
                    <Text style={styles.warningText}>
                      All requests are reviewed for authenticity. Please provide
                      accurate information. False requests may result in account
                      suspension.
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.submitBtn}
                    onPress={handleSubmit}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="send" size={18} color="#fff" />
                    <Text style={styles.submitBtnText}>Post Blood Request</Text>
                  </TouchableOpacity>
                </ScrollView>
              )}
            </KeyboardAvoidingView>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray100 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 55,
    paddingBottom: 12,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.gray100,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.black,
    textAlign: "center",
  },
  headerSub: {
    fontSize: 12,
    color: COLORS.gray400,
    textAlign: "center",
    marginTop: 1,
  },
  statsStrip: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  statBox: { flex: 1, alignItems: "center", gap: 3 },
  statNum: { fontSize: 20, fontWeight: "800" },
  statLabel: { fontSize: 11, color: COLORS.gray400 },
  filtersSection: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.gray100,
    borderWidth: 1.5,
    borderColor: COLORS.gray200,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: { fontSize: 12, fontWeight: "600", color: COLORS.gray500 },
  filterChipTextActive: { color: "#fff" },
  requestCard: {
    backgroundColor: "#fff",
    borderRadius: RADIUS.xl,
    marginBottom: 14,
    overflow: "hidden",
    flexDirection: "row",
    ...SHADOW.medium,
  },
  requestCardFulfilled: { opacity: 0.6 },
  urgencyStrip: { width: 5, minHeight: "100%" },
  cardInner: { flex: 1, padding: 14 },
  cardTopRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  bloodBigCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.primaryBg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.primary + "30",
  },
  bloodBigText: { fontSize: 16, fontWeight: "900", color: COLORS.primary },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 3,
    flexWrap: "wrap",
  },
  urgencyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  urgencyText: { fontSize: 10, fontWeight: "700" },
  fulfilledBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  fulfilledText: { fontSize: 10, fontWeight: "700", color: COLORS.success },
  postedTime: { fontSize: 11, color: COLORS.gray400, marginLeft: "auto" },
  patientName: { fontSize: 15, fontWeight: "800", color: COLORS.black },
  patientMeta: { fontSize: 12, color: COLORS.gray400, marginTop: 2 },
  unitsBox: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primaryBg,
    borderRadius: RADIUS.md,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 8,
  },
  unitsNum: { fontSize: 18, fontWeight: "900", color: COLORS.primary },
  unitsLabel: { fontSize: 10, color: COLORS.primary },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginBottom: 6,
  },
  infoText: { flex: 1, fontSize: 13, color: COLORS.gray600, lineHeight: 18 },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray100,
  },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  locationText: { fontSize: 12, color: COLORS.gray400 },
  actionRow: { flexDirection: "row", gap: 8 },
  callSmallBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryBg,
  },
  callSmallText: { color: COLORS.primary, fontSize: 12, fontWeight: "700" },
  respondBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    ...SHADOW.medium,
  },
  respondText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  emptyState: { alignItems: "center", paddingVertical: 60 },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.gray700,
    marginTop: 12,
  },
  emptySub: { fontSize: 13, color: COLORS.gray400, marginTop: 4 },
  fabWrap: { position: "absolute", bottom: 30, alignSelf: "center" },
  fab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: RADIUS.full,
    ...SHADOW.large,
  },
  fabText: { color: "#fff", fontSize: 15, fontWeight: "800" },

  // Modal
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: height * 0.92,
    ...SHADOW.large,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.gray300,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  sheetTitle: { fontSize: 20, fontWeight: "800", color: COLORS.black },
  sheetSub: { fontSize: 13, color: COLORS.gray400, marginTop: 2 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.gray100,
    alignItems: "center",
    justifyContent: "center",
  },

  // Form
  fieldGroup: { marginBottom: 18 },
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
    backgroundColor: COLORS.gray100,
    borderWidth: 1.5,
    borderColor: COLORS.gray200,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
  },
  inputFocused: { borderColor: COLORS.primary, backgroundColor: "#FFF5F5" },
  input: { flex: 1, fontSize: 15, color: COLORS.black, paddingVertical: 13 },
  urgencyRow: { flexDirection: "row", gap: 10 },
  urgencyCard: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.gray200,
    gap: 4,
    backgroundColor: "#fff",
  },
  urgencyCardLabel: { fontSize: 13, fontWeight: "700" },
  urgencyCardDesc: { fontSize: 10, color: COLORS.gray400, textAlign: "center" },
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
  unitsSelector: { flexDirection: "row", gap: 10 },
  unitChip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: COLORS.gray200,
  },
  unitChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  unitChipText: { fontSize: 15, fontWeight: "700", color: COLORS.gray600 },
  unitChipTextActive: { color: "#fff" },
  hospitalList: { gap: 8 },
  hospitalChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: RADIUS.md,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: COLORS.gray200,
  },
  hospitalChipActive: {
    backgroundColor: COLORS.primaryBg,
    borderColor: COLORS.primary,
  },
  hospitalChipText: { fontSize: 13, color: COLORS.gray600, fontWeight: "500" },
  hospitalChipTextActive: { color: COLORS.primary, fontWeight: "700" },
  warningBox: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: COLORS.warningBg,
    borderRadius: RADIUS.md,
    padding: 14,
    marginBottom: 16,
  },
  warningText: { flex: 1, fontSize: 12, color: "#E65100", lineHeight: 18 },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    ...SHADOW.large,
  },
  submitBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },

  // Success
  successState: { alignItems: "center", padding: 40, paddingTop: 30 },
  successCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.success,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    ...SHADOW.large,
  },
  successTitle: { fontSize: 22, fontWeight: "800", color: COLORS.black },
  successSub: {
    fontSize: 14,
    color: COLORS.gray500,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },
});
