import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";

const logoImg = require("../../../assets/logo.png");
const element1 = require("../../../assets/element1.png");
const element2 = require("../../../assets/element2.png");
const element3 = require("../../../assets/element3.png");
const element4 = require("../../../assets/element4.png");

export default function SignUpScreen({ navigation }) {
  // State variables for input fields
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [employeeNo, setEmployeeNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Function to handle Sign-Up
  const handleSignUp = async () => {
    if (!email || !fullName || !employeeNo || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://10.0.2.2:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, fullName, employeeNo, password, securityQuestions: [] }), // Empty securityQuestions for now
      });

      const data = await response.json();
      if (response.ok) {
        console.log("✅ Sign-up Successful:", data);
        Alert.alert("Success", "Account created successfully!");

        // Navigate to the Security Questions screen
        navigation.navigate("SecurityQuestion", { email }); // Passing email for security question setup
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.error("❌ Error signing up:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={element1} style={styles.element1} />
      <Image source={element2} style={styles.element2} />
      <Image source={element3} style={styles.element3} />
      <Image source={element4} style={styles.element4} />

      <View style={styles.headerContainer}>
        <Image source={logoImg} style={styles.logo} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.textSignUp}>Create an account</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#BDBDBD"
          value={email}
          onChangeText={setEmail}
        />
        
        <View style={styles.inputRow}>
          <TextInput
            style={styles.halfInput}
            placeholder="Full Name"
            placeholderTextColor="#BDBDBD"
            value={fullName}
            onChangeText={setFullName}
          />
          <TextInput
            style={styles.halfInput}
            placeholder="Employee No."
            placeholderTextColor="#BDBDBD"
            value={employeeNo}
            onChangeText={setEmployeeNo}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#BDBDBD"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#BDBDBD"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      <View style={styles.nextContainer}>
        <TouchableOpacity onPress={handleSignUp}>
          <Text style={styles.nextTriggerText}>Next</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.signupText}>
        Already have an account?{" "}
        <Text style={styles.signupLink} onPress={() => navigation.navigate("Login")}>
          Sign in
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  element1: {
    position: "absolute",
    top: -30,
    left: -50,
    resizeMode: "contain",
  },
  element2: {
    position: "absolute",
    top: -30,
    right: -70,
    resizeMode: "contain",
  },
  element3: {
    position: "absolute",
    bottom: -50,
    left: -90,
    resizeMode: "contain",
  },
  element4: {
    position: "absolute",
    bottom: -70,
    right: -70,
    resizeMode: "contain",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  textSignUp: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 14,
  },
  inputContainer: {
    width: "100%",
    maxWidth: 400,
    marginVertical: 10,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 400,
    gap: 10,
  },
  halfInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#5A8EF4",
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#5A8EF4",
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  nextTriggerText: {
    color: "#5A8EF4",
    fontSize: 14,
    textDecorationLine: "underline",
    marginBottom: 10,
  },
  signupLink: {
    color: "#5A8EF4",
    textDecorationLine: "underline",
  },
});

