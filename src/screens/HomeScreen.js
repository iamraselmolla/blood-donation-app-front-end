import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const DUMMY_DONORS = [
  { id: "1", name: "Arif Rahman", blood: "A+", location: "Dhaka" },
  { id: "2", name: "Sara Khan", blood: "O-", location: "Khulna" },
  { id: "3", name: "Tanvir Alam", blood: "B+", location: "Chittagong" },
];

const HomeScreen = () => {
  const renderDonor = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.bloodCircle}>
        <Text style={styles.bloodText}>{item.blood}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.donorName}>{item.name}</Text>
        <Text style={styles.donorLoc}>{item.location}</Text>
      </View>
      <TouchableOpacity style={styles.contactBtn}>
        <Text style={styles.contactText}>Call</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>124</Text>
          <Text>Donors</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>45</Text>
          <Text>Requests</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Available Donors</Text>

      <FlatList
        data={DUMMY_DONORS}
        renderItem={renderDonor}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 15 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
    elevation: 2,
  },
  statNum: { fontSize: 20, fontWeight: "bold", color: "#d32f2f" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    elevation: 1,
  },
  bloodCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ffebee",
    justifyContent: "center",
    alignItems: "center",
  },
  bloodText: { color: "#d32f2f", fontWeight: "bold" },
  info: { flex: 1, marginLeft: 15 },
  donorName: { fontSize: 16, fontWeight: "bold" },
  donorLoc: { color: "#666" },
  contactBtn: {
    backgroundColor: "#d32f2f",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  contactText: { color: "#fff", fontSize: 12 },
});

export default HomeScreen;
