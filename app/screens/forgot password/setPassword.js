//setPassword.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { auth } from "../../config/firebaseConfig"; // adjust path if needed

const logoImg = require("../../../assets/logo.png");
const keyIcon = require("../../../assets/key-icon.png");
const eyeOpen = require("../../../assets/show-icon.png");
const eyeClosed = require("../../../assets/hide-icon.png");

const element1 = require("../../../assets/element1.png");
const element2 = require("../../../assets/element2.png");
const element3 = require("../../../assets/element3.png");
const element4 = require("../../../assets/element4.png");
const element5 = require("../../../assets/element5.png");
const element6 = require("../../../assets/element6.png");

export default function SetPasswordScreen({}) {
  const route = useRoute();
  const navigation = useNavigation();
  const { verificationId, phoneNumberForAuth, phoneNumber } = route.params;

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password validation checks
  const isLengthValid = password.length >= 8;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*?/.,]/.test(password);

  const isPasswordValid = isLengthValid && hasLowercase && hasUppercase && hasNumber && hasSpecialChar;

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert("Error", "Please enter and confirm your password.");
      return;
    }
  
    if (!isPasswordValid) {
      Alert.alert("Error", "Password does not meet the required criteria.");
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
  
    // ✅ Normalize phoneNumber to match DB format (e.g. "9066041979")
    let normalizedPhone = phoneNumber;
    if (normalizedPhone.startsWith("+63")) {
      normalizedPhone = normalizedPhone.replace("+63", "");
    } else if (normalizedPhone.startsWith("09")) {
      normalizedPhone = normalizedPhone.slice(1);
    }
  
    try {
      const response = await fetch("http://10.0.2.2:5000/api/auth/reset-password-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: normalizedPhone, newPassword: password }),
      });
  
      const result = await response.json();
  
      if (result.success) {
        Alert.alert("Success", "Password reset successful. Please log in.");
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", result.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error("❌ Reset error:", error);
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
          <Text style={styles.title}>Set New Password</Text>
          <Text style={styles.subtitle}>Create a secure password</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        {/* Password Input */}
        <View style={styles.inputWrapper}>
          <Image source={keyIcon} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="New Password"
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

      <TouchableOpacity
        style={[styles.button, styles.shadow]}
        onPress={handleResetPassword}
      >
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>

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
    marginBottom: 20,
    resizeMode: "contain",
  },
  textHeader: {
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    color: "#333",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    maxWidth: 500,
    marginVertical: 10,
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
    marginRight: 10,
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
  passwordRequirements: {
    alignSelf: "flex-start",
    marginLeft: 10,
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