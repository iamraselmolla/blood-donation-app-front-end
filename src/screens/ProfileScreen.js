import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ProfileScreen = () => {
  // This data will eventually come from your PostgreSQL DB
  const userData = {
    name: "Rasel Ahmed",
    bloodGroup: "B+",
    mobile: "+880 17XX-XXXXXX",
    location: "Dhaka, Bangladesh",
    totalDonations: 5,
    lastDonated: "20 Jan 2026",
    diseases: ["None", "No Allergies"],
    weight: "72 kg",
    age: 26,
  };

  const InfoCard = ({ icon, label, value }) => (
    <View style={styles.infoCard}>
      <Ionicons name={icon} size={20} color="#d32f2f" />
      <View style={styles.infoTextGroup}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{userData.name[0]}</Text>
        </View>
        <Text style={styles.userName}>{userData.name}</Text>
        <View style={styles.bloodBadge}>
          <Text style={styles.bloodText}>{userData.bloodGroup}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userData.totalDonations}</Text>
          <Text style={styles.statLabel}>Donations</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userData.age}</Text>
          <Text style={styles.statLabel}>Age</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact & Location</Text>
        <InfoCard icon="call" label="Mobile" value={userData.mobile} />
        <InfoCard icon="location" label="Address" value={userData.location} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medical Information</Text>
        <InfoCard icon="fitness" label="Weight" value={userData.weight} />
        <InfoCard
          icon="calendar"
          label="Last Donated"
          value={userData.lastDonated}
        />
        <InfoCard
          icon="medical"
          label="Conditions"
          value={userData.diseases.join(", ")}
        />
      </View>

      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    alignItems: "center",
    backgroundColor: "#fff",
    paddingpadding: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 3,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#d32f2f",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarText: { color: "#fff", fontSize: 32, fontWeight: "bold" },
  userName: { fontSize: 22, fontWeight: "bold", color: "#333" },
  bloodBadge: {
    backgroundColor: "#ffebee",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 10,
  },
  bloodText: { color: "#d32f2f", fontWeight: "bold" },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  statItem: { alignItems: "center" },
  statNumber: { fontSize: 18, fontWeight: "bold", color: "#d32f2f" },
  statLabel: { color: "#666", fontSize: 12 },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#d32f2f",
    marginBottom: 15,
  },
  infoCard: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  infoTextGroup: { marginLeft: 15 },
  infoLabel: { fontSize: 12, color: "#999" },
  infoValue: { fontSize: 15, color: "#333", fontWeight: "500" },
  editButton: {
    margin: 20,
    backgroundColor: "#d32f2f",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  editButtonText: { color: "#fff", fontWeight: "bold" },
});

export default ProfileScreen;
