//signup.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, Platform } from "react-native";

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
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [employeeNo, setEmployeeNo] = useState("");

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

  const [emailError, setEmailError] = useState("");

  // Define the base URL depending on the platform
  const baseUrl =
    Platform.OS === "web"
      ? "http://localhost:5000"
      : "http://10.0.2.2:5000";
  
  // Phone number validation
  const isPhoneValid = /^9\d{9}$/.test(phoneNumber); // Philippine number format without +63
  const [showPhoneRequirements, setShowPhoneRequirements] = useState(false);

  // Employee number validation
  const currentYear = new Date().getFullYear();
  const employeeRegex = /^(\d{4})(\d{5})$/;
  const isEmployeeValid =
    employeeRegex.test(employeeNo) &&
    parseInt(employeeNo.substring(0, 4)) >= 2000 &&
    parseInt(employeeNo.substring(0, 4)) <= currentYear;
  const [showEmployeeRequirements, setShowEmployeeRequirements] = useState(false);

  // Function to handle Sign-Up
  const handleSignUp = async () => {
    if (
      !email ||
      !phoneNumber ||
      !fullName ||
      !employeeNo ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (!email.endsWith("@plm.edu.ph")) {
      setEmailError("Invalid email. Must use @plm.edu.ph domain.");
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    // Normalize number
    let normalizedPhone = phoneNumber;

    // Remove leading 0 and prepend +63
    if (normalizedPhone.startsWith("0")) {
      normalizedPhone = "+63" + normalizedPhone.substring(1);
    } else if (normalizedPhone.startsWith("9")) {
      normalizedPhone = "+63" + normalizedPhone;
    }

    if (!/^(\+63)(9\d{9})$/.test(normalizedPhone)) {
      Alert.alert("Error", "Please enter a valid Philippine mobile number.");
      return;
    }

    if (!isEmployeeValid) {
      Alert.alert(
        "Invalid Employee No.",
        `Please enter a valid 9-digit employee number starting with a year between 2000 and ${currentYear}.`
      );
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phoneNumber,
          fullName,
          employeeNo,
          password,
          securityQuestions: [],
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("✅ Sign-up Successful:", data);
        Alert.alert("Success", "Account created successfully!");
        navigation.navigate("SecurityQuestion", { email });
      } else {
        Alert.alert("Error", data.message || "Sign-up failed");
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
        {/* Email Input with Icon */}
        <View style={[
          styles.inputWrapper,
          emailError ? { borderColor: "red" } : null
        ]}>
        <Image source={userIcon} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#BDBDBD"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) setEmailError(""); // Clear error as user types
            }}
          />
        </View>
        {emailError !== "" && (
          <Text style={{ color: "red", marginBottom: 10, marginLeft: 5 }}>{emailError}</Text>
        )}

        {/* Phone Number Input with Icon */}
        <View style={styles.inputWrapper}>
          <Image source={userIcon} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number (+63)"
            placeholderTextColor="#BDBDBD"
            value={phoneNumber}
            keyboardType="numeric"
            onFocus={() => setShowPhoneRequirements(true)}
            onBlur={() => setShowPhoneRequirements(false)}
            onChangeText={(text) => {
              const digits = text.replace(/\D/g, "");
              if (digits === "") {
                setPhoneNumber("");
              } else if (digits.length <= 10 && digits.startsWith("9")) {
                setPhoneNumber(digits);
              }
            }}
          />
        </View>

        {showPhoneRequirements && (
          <View style={styles.passwordRequirements}>
            <Text style={[styles.requirementText, isPhoneValid && styles.validRequirement]}>
              • Philippine number format only: starts with 9 and has 10 digits (e.g. 9123456789)
            </Text>
          </View>
        )}

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
              keyboardType="numeric"
              value={employeeNo}
              onFocus={() => setShowEmployeeRequirements(true)}
              onBlur={() => setShowEmployeeRequirements(false)}
              onChangeText={(text) => {
                const currentYear = new Date().getFullYear();
                const digits = text.replace(/\D/g, "");
              
                if (digits.length > 9) return;
              
                // If still typing the year (less than 4 digits)
                if (digits.length < 4) {
                  if (digits === "" || /^2\d{0,3}$/.test(digits)) {
                    // Allow empty or digits starting with 2 (e.g., 2, 20, 200, 2000...)
                    setEmployeeNo(digits);
                  }
                  return;
                }
              
                // After 4 digits - check if year is valid
                const year = parseInt(digits.slice(0, 4), 10);
                const sequence = digits.slice(4);
              
                if (year >= 2000 && year <= currentYear && sequence.length <= 5) {
                  setEmployeeNo(digits);
                }
              }}
            />
            
          </View> 
        </View>
        {showEmployeeRequirements && (
              <View style={styles.passwordRequirements}>
                <Text style={[styles.requirementText, isEmployeeValid && styles.validRequirement]}>
                  • Must be a 9-digit number starting with a year between 2000 and {currentYear}
                </Text>
              </View>
            )}

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

        {/* Password Requirements Message */}
        {showPasswordRequirements && (
          <View style={styles.passwordRequirements}>
            <Text style={[styles.requirementText, isLengthValid && styles.validRequirement]}>
              • At least 8 characters long
            </Text>
            <Text style={[styles.requirementText, hasLowercase && styles.validRequirement]}>
              • Contains at least one lowercase letter (a-z)
            </Text>
            <Text style={[styles.requirementText, hasUppercase && styles.validRequirement]}>
              • Contains at least one uppercase letter (A-Z)
            </Text>
            <Text style={[styles.requirementText, hasNumber && styles.validRequirement]}>
              • Includes a number (0-9)
            </Text>
            <Text style={[styles.requirementText, hasSpecialChar && styles.validRequirement]}>
              • Includes a special character (!@#$%^&*?/.,)
            </Text>
          </View>
        )}

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