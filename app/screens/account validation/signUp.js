import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";

const logoImg = require("../../../assets/logo.png");
const element1 = require("../../../assets/element1.png")
const element2 = require("../../../assets/element2.png")
const element3 = require("../../../assets/element3.png")
const element4 = require("../../../assets/element4.png")
const element5 = require("../../../assets/element5.png")
const element6 = require("../../../assets/element6.png")
const userIcon = require("../../../assets/user-icon.png");
const keyIcon = require("../../../assets/key-icon.png");
const eyeOpen = require("../../../assets/show-icon.png");
const eyeClosed = require("../../../assets/hide-icon.png");
const nameIcon = require("../../../assets/name-icon.png");
const emplNum = require("../../../assets/employee-icon.png");

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
    alignItems: "center",
    marginTop: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
    resizeMode: "contain",
  },
  textHeader: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    color: "#333",
    flexShrink: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 15,
  },
  inputContainer: {
    width: "100%",
    maxWidth: 500,
    marginVertical: 10,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 245,
    gap: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    maxWidth: 500,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#5A8EF4",
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  inputIcon: {
    width: 20,
    height: 20,
    marginRight: 20,
    resizeMode: "contain",
  },
  eyeIcon: {
    width: 22,
    height: 22,
    marginLeft: 10,
    resizeMode: "contain",
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  nextTriggerText: {
    color: "#5A8EF4",
    fontSize: 14,
    textDecorationLine: "underline",
    marginBottom: 10,
  },
  requirementText: {
    fontSize: 14,
    color: "#777",
  },
  validRequirement: {
    color: "green",
    fontWeight: "bold",
  },
  button: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#5A8EF4",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    borderWidth: 2,
    borderColor: "white",
  },
  shadow: {
    shadowColor: "#000",  
    shadowOffset: { width: 2, height: 4 }, 
    shadowOpacity: 0.3,  
    shadowRadius: 4,  
    elevation: 6, 
    backgroundColor: "#4A90E2", 
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555", 
  },
  signupLink: {
    color: "#5A8EF4",
    textDecorationLine: "underline"
  },
  footer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
});
