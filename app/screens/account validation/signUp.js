import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";

const logoImg = require("../../../assets/logo.png");
const element1 = require("../../../assets/element1.png");
const element2 = require("../../../assets/element2.png");
const element3 = require("../../../assets/element3.png");
const element4 = require("../../../assets/element4.png");
const element5 = require("../../../assets/element5.png");
const element6 = require("../../../assets/element6.png");

const userIcon = require("../../../assets/user-icon.png");
const keyIcon = require("../../../assets/key-icon.png");
const eyeOpen = require("../../../assets/show-icon.png");
const eyeClosed = require("../../../assets/hide-icon.png");
const nameIcon = require("../../../assets/name-icon.png");
const emplNum = require("../../../assets/employee-icon.png");

export default function SignUpScreen({ navigation }) {
  // State variables
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [employeeNo, setEmployeeNo] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // ✅ Added state for phone number
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  // Password validation checks
  const isLengthValid = password.length >= 8;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*?/.,]/.test(password);

  // Function to handle Sign-Up
  const handleSignUp = async () => {
    if (!phoneNumber || !fullName || !employeeNo || !password || !confirmPassword) {
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
        body: JSON.stringify({ phoneNumber, fullName, employeeNo, password, securityQuestions: [] }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("✅ Sign-up Successful:", data);
        Alert.alert("Success", "Account created successfully!");
        navigation.navigate("SecurityQuestion", { phoneNumber });
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
      {/* Background Elements for Consistency */}
      <Image source={element1} style={styles.element1} />
      <Image source={element2} style={styles.element2} />
      <Image source={element3} style={styles.element3} />
      <Image source={element4} style={styles.element4} />
      <Image source={element5} style={styles.element5} />
      <Image source={element6} style={styles.element6} />

      <View style={styles.headerContainer}>
        <Image source={logoImg} style={styles.logo} />
        <View style={styles.textHeader}>
          <Text style={styles.title}>Create an Account</Text>
          <Text style={styles.subtitle}>Join us for an exciting learning journey!</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        {/* Phone Number Input with Icon */}
        <View style={styles.inputWrapper}>
          <Image source={userIcon} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#BDBDBD"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        {/* Full Name & Employee No. */}
        <View style={styles.inputRow}>
          <View style={styles.inputWrapper}>
            <Image source={nameIcon} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#BDBDBD"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Image source={emplNum} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Employee No."
              placeholderTextColor="#BDBDBD"
              value={employeeNo}
              onChangeText={setEmployeeNo}
            />
          </View>
        </View>

        {/* Phone Number Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#BDBDBD"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        {/* Password Input with Icon & Show/Hide */}
        <View style={styles.inputWrapper}>
          <Image source={keyIcon} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#BDBDBD"
            secureTextEntry={!passwordVisible}
            onFocus={() => setShowPasswordRequirements(true)}
            onBlur={() => setShowPasswordRequirements(false)}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Image source={passwordVisible ? eyeOpen : eyeClosed} style={styles.eyeIcon} />
          </TouchableOpacity>
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputWrapper}>
          <Image source={keyIcon} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#BDBDBD"
            secureTextEntry={!confirmPasswordVisible}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
            <Image source={confirmPasswordVisible ? eyeOpen : eyeClosed} style={styles.eyeIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={[styles.button, styles.shadow]} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>

      {/* Sign Up Navigation */}
      <Text style={styles.signupText}>
        Already have an account{" "}
        <Text style={styles.signupLink} onPress={() => navigation.navigate("Login")}>
          Sign in
        </Text>
      </Text>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 Husay. All Rights Reserved.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  element1: { position: "absolute", bottom: -180, left: -10, resizeMode: "contain" },
  element2: { position: "absolute", top: -180, right: -70, resizeMode: "contain" },
  element3: { position: "absolute", left: -50, resizeMode: "contain" },
  element4: { position: "absolute", right: -180, resizeMode: "contain" },
  element5: { position: "absolute", bottom: -40, right: 40, resizeMode: "contain" },
  element6: { position: "absolute", top: -70, left: 400, resizeMode: "contain" },
  
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
    fontSize: 24,
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
    fontSize: 16, 
    textDecorationLine: "underline",
    marginBottom: 10,
  },
  requirementText: {
    fontSize: 16,
    color: "#777",
  },
  passwordRequirements:{
    margin: 15
  },
  validRequirement: {
    color: "green",
    fontWeight: "bold"
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
