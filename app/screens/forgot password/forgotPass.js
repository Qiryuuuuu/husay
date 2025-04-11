import React, { useRef, useState } from "react";
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity } from "react-native";
import { auth } from "../../config/firebaseConfig"; // path to firebaseConfig.js
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { PhoneAuthProvider, signInWithPhoneNumber } from "firebase/auth";

const logoImg = require("../../../assets/logo.png");
const backIcon = require("../../../assets/back-icon.png");
const phoneIcon = require("../../../assets/user-icon.png");
const element1 = require("../../../assets/element1.png");
const element2 = require("../../../assets/element2.png");
const element3 = require("../../../assets/element3.png");
const element4 = require("../../../assets/element4.png");
const element5 = require("../../../assets/element5.png");
const element6 = require("../../../assets/element6.png");

export default function ForgotPasswordScreen({ navigation }) {

  // Phone number validation
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [showPhoneValidation, setShowPhoneValidation] = React.useState(false);
  const isPhoneValid = /^9\d{9}$/.test(phoneNumber);

  const recaptchaVerifier = useRef(null);

  const handleSendCode = async () => {
    if (!isPhoneValid) {
      setShowPhoneValidation(true);
      Alert.alert("❌ Invalid number", "It must start with 9 and be 10 digits long.");
      return;
    }

    const formattedPhone = "+639762290845";

    try {
      const provider = new PhoneAuthProvider(auth);
      const verificationId = await provider.verifyPhoneNumber(
        formattedPhone,
        recaptchaVerifier.current
      );

      navigation.navigate("EnterCode", {
        phoneNumber: formattedPhone,
        verificationId,
      });
    } catch (error) {
      console.error("❌ OTP send error:", error);
      Alert.alert("Error", "Failed to send verification code.");
    }
  };

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={auth.app.options}
        attemptInvisibleVerification={true}
      />

      
      <Image source={element1} style={styles.element1} />
      <Image source={element2} style={styles.element2} />
      <Image source={element3} style={styles.element3} />
      <Image source={element4} style={styles.element4} />
      <Image source={element5} style={styles.element5} />
      <Image source={element6} style={styles.element6} />

      {/* Back Button */}
      <View style={styles.backHeader}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.backButton}>
          <Image source={backIcon} style={styles.backIcon} />
          <Text style={styles.backText}>Back to login</Text>
        </TouchableOpacity>
      </View>

      {/* Logo */}
      <Image source={logoImg} style={styles.logo} />

      {/* Title & Subtitle */}
      <View style={styles.textHeader}>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          No worries, we’ll send you reset instructions.
        </Text>
      </View>

      {/* Form */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Image source={phoneIcon} style={styles.inputIcon} />
          <TextInput 
            style={styles.input} 
            placeholder="Phone Number (+63)" 
            placeholderTextColor="#BDBDBD"
            keyboardType="numeric"
            value={phoneNumber}
            onFocus={() => setShowPhoneValidation(true)}
            onBlur={() => setShowPhoneValidation(false)}
            onChangeText={(text) => {
              const digitsOnly = text.replace(/\D/g, "");
              if (digitsOnly === "") {
                setPhoneNumber("");
              } else if (digitsOnly.length <= 10 && digitsOnly.startsWith("9")) {
                setPhoneNumber(digitsOnly);
              }
            }}
          />
        </View>


        {showPhoneValidation && (
          <Text style={[styles.requirementText, isPhoneValid && styles.validRequirement]}>
            • Philippine number format only: starts with 9 and has 10 digits (e.g. 9123456789)
          </Text>
        )}

        <TouchableOpacity>
          <Text 
            style={styles.securityQuestionText} 
            onPress={() => navigation.navigate("ForgotSecurityQuestion")}
          >
            Try another ways
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.shadow]}
          onPress={handleSendCode}
        >
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
        
        <TouchableOpacity>
          <Text
            style={styles.securityQuestionText}
            onPress={() => navigation.navigate("ForgotSecurityQuestion")}
          >
            Try another way
          </Text>
        </TouchableOpacity>
      </View >

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
  
  backHeader: {
    position: "absolute",
    top: 45,
    left: 30,
    zIndex: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
    resizeMode: "contain",
  },
  backText: {
    color: "#5A8EF4",
    fontSize: 16,
  },
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
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
    marginBottom: 10,
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
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  requirementText: {
    fontSize: 14,
    color: "#777",
    marginBottom: 5,
    marginLeft: 5,
  },
  validRequirement: {
    color: "green",
    fontWeight: "bold",
  },
  securityQuestion: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginVertical: 10,
  },
  securityQuestionText: {
    color: "#5A8EF4",
    textDecorationLine: "underline",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
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
