import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SHADOW, RADIUS } from "../components/theme";

const SettingsGroup = ({ title, children }) => (
  <View style={styles.group}>
    {title && <Text style={styles.groupTitle}>{title}</Text>}
    <View style={styles.groupCard}>{children}</View>
  </View>
);

const SettingsRow = ({
  icon,
  label,
  subtitle,
  value,
  onPress,
  isToggle,
  iconColor,
  last,
}) => {
  const [toggled, setToggled] = useState(value || false);
  return (
    <TouchableOpacity
      style={[styles.row, !last && styles.rowBorder]}
      onPress={isToggle ? () => setToggled(!toggled) : onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.rowIcon,
          { backgroundColor: (iconColor || COLORS.primary) + "18" },
        ]}
      >
        <Ionicons name={icon} size={18} color={iconColor || COLORS.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        {subtitle && <Text style={styles.rowSub}>{subtitle}</Text>}
      </View>
      {isToggle ? (
        <Switch
          value={toggled}
          onValueChange={setToggled}
          trackColor={{ false: COLORS.gray200, true: COLORS.primary + "80" }}
          thumbColor={toggled ? COLORS.primary : COLORS.gray400}
        />
      ) : (
        <Ionicons name="chevron-forward" size={16} color={COLORS.gray300} />
      )}
    </TouchableOpacity>
  );
};

export default function SettingsScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={{ opacity: fadeAnim }}>
        {/* Profile Summary */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>R</Text>
          </View>
          <View style={{ marginLeft: 14, flex: 1 }}>
            <Text style={styles.profileName}>Rasel Ahmed</Text>
            <Text style={styles.profileMeta}>Blood Group: B+ · Khulna</Text>
            <View style={styles.activeDot}>
              <View style={styles.dot} />
              <Text style={styles.activeText}>Active Donor</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="create-outline" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <SettingsGroup title="Availability">
          <SettingsRow
            icon="water-outline"
            label="Available to Donate"
            subtitle="Show as available in search results"
            isToggle
            value={true}
            iconColor={COLORS.success}
          />
          <SettingsRow
            icon="location-outline"
            label="Share My Location"
            subtitle="Help nearby patients find you"
            isToggle
            value={true}
            last
          />
        </SettingsGroup>

        <SettingsGroup title="Notifications">
          <SettingsRow
            icon="notifications-outline"
            label="Urgent Blood Requests"
            subtitle="Get alerted for emergency requests"
            isToggle
            value={true}
            iconColor={COLORS.danger}
          />
          <SettingsRow
            icon="megaphone-outline"
            label="Campaign Updates"
            subtitle="Fundraising & project news"
            isToggle
            value={false}
            iconColor={COLORS.warning}
          />
          <SettingsRow
            icon="calendar-outline"
            label="Donation Reminders"
            subtitle="Remind me when I'm eligible"
            isToggle
            value={true}
            last
          />
        </SettingsGroup>

        <SettingsGroup title="Account">
          <SettingsRow
            icon="person-outline"
            label="Edit Profile"
            onPress={() => {}}
          />
          <SettingsRow
            icon="shield-outline"
            label="Privacy & Security"
            onPress={() => {}}
          />
          <SettingsRow
            icon="document-text-outline"
            label="Terms & Conditions"
            onPress={() => {}}
          />
          <SettingsRow
            icon="information-circle-outline"
            label="About LifeDrop"
            subtitle="Version 1.0.0"
            onPress={() => {}}
            last
          />
        </SettingsGroup>

        <SettingsGroup title="Danger Zone">
          <SettingsRow
            icon="log-out-outline"
            label="Sign Out"
            iconColor={COLORS.warning}
            onPress={() => navigation?.replace("Login")}
          />
          <SettingsRow
            icon="trash-outline"
            label="Delete Account"
            iconColor={COLORS.danger}
            onPress={() => {}}
            last
          />
        </SettingsGroup>

        <View style={{ height: 100 }} />
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray100 },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    marginTop: 60,
    backgroundColor: "#fff",
    borderRadius: RADIUS.xl,
    padding: 18,
    ...SHADOW.medium,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.primaryBg,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 26, fontWeight: "800", color: COLORS.primary },
  profileName: { fontSize: 17, fontWeight: "800", color: COLORS.black },
  profileMeta: { fontSize: 12, color: COLORS.gray400, marginTop: 2 },
  activeDot: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 5,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  activeText: { fontSize: 12, color: COLORS.success, fontWeight: "600" },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryBg,
    alignItems: "center",
    justifyContent: "center",
  },
  group: { paddingHorizontal: 16, marginBottom: 16 },
  groupTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.gray400,
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
    textTransform: "uppercase",
  },
  groupCard: {
    backgroundColor: "#fff",
    borderRadius: RADIUS.lg,
    ...SHADOW.small,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.gray100 },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: { fontSize: 14, fontWeight: "600", color: COLORS.black },
  rowSub: { fontSize: 12, color: COLORS.gray400, marginTop: 1 },
});
