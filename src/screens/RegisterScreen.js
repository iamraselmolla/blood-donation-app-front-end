import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Import the Picker

const RegisterScreen = ({ navigation }) => {
  const [bloodGroup, setBloodGroup] = useState("A+");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Donor Registration</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        onChangeText={setName}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Select Blood Group</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={bloodGroup}
          onValueChange={(itemValue) => setBloodGroup(itemValue)}
          style={styles.picker}
        >
          {bloodGroups.map((group) => (
            <Picker.Item key={group} label={group} value={group} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Last Donation Date</Text>
      <TextInput style={styles.input} placeholder="YYYY-MM-DD" />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.buttonText}>Register as Donor</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#d32f2f",
    marginBottom: 20,
  },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 5, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#d32f2f",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
    padding: 10,
    borderColor: "#d32f2f",
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#d32f2f",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default RegisterScreen;
