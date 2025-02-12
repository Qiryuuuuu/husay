import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, useWindowDimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';

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

export default function LoginScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigation();

  // Function to handle Sign-In API request
  const handleSignIn = async () => {
    try {
      const response = await axios.post("http://10.0.2.2:5000/api/auth/signin", {
        email,
        password,
      });

      if (response.status === 200) {
        Alert.alert("Success", response.data.message);
        navigate.navigate("StudentProfile");
        console.log("Token:", response.data.token);
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.response ? error.response.data.message : "Something went wrong"
      );
      console.log(error.response.data.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Elements */}
      <Image source={element1} style={styles.element1} />
      <Image source={element2} style={styles.element2} />
      <Image source={element3} style={styles.element3} />
      <Image source={element4} style={styles.element4} />
      <Image source={element5} style={styles.element5} />
      <Image source={element6} style={styles.element6} />

      {/* Header */}
      <View style={styles.headerContainer}>
        <Image source={logoImg} style={styles.logo} />
        <View style={styles.textHeader}>
          <Text style={styles.title}>Empower Young Minds</Text>
          <Text style={styles.subtitle}>Your pupil’s first step into fun and creative learning!</Text>
        </View>
      </View>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        {/* Email Input with Icon */}
        <View style={styles.inputWrapper}>
          <Image source={userIcon} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#BDBDBD"
            value={email}
            onChangeText={setEmail}
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
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Image source={passwordVisible ? eyeOpen : eyeClosed} style={styles.eyeIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Forgot Password */}
      <View style={styles.forgotContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>
      </View>

      {/* Sign In Button */}
      <TouchableOpacity style={[styles.button, styles.shadow]} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>

      {/* Sign Up Navigation */}
      <Text style={styles.signupText}>
        Don’t have an account yet?{" "}
        <Text style={styles.signupLink} onPress={() => navigation.navigate("SignUp")}>
          Sign up
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
  forgotContainer: {
    marginBottom: 10,
  },
  forgotText: {
    color: "#007BFF",
    fontSize: 16,
    textDecorationLine: "underline",
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
    textDecorationLine: "underline",
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