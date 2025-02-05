import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  useWindowDimensions,
} from "react-native";

const logoImg = require("../assets/logo.png"); 
const backgroundImg = require("../assets/login-bg.webp"); 

export default function App() {
  const { width, height } = useWindowDimensions(); // Handle responsiveness

  return (
    <View style={styles.container}>
      {/* Left Side - Login Form */}
      <View style={styles.leftContainer}>
        <View style={styles.headerContainer}>
        {/* Logo */}
        <Image source={logoImg} style={styles.logo} />

        {/* Title & Subtitle */}
        <Text style={styles.title}>Your pupil’s first step into fun and creative learning!</Text>

        </View>

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#BDBDBD"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#BDBDBD"
            secureTextEntry
          />
        </View>

        {/* Forgot Password Link */}
        <View style={styles.forgotContainer}>
          <TouchableOpacity>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        {/* Sign-In Button */}
        <TouchableOpacity style={[styles.button, styles.shadow]}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>

        {/* Sign-Up Link */}
        <Text style={styles.signupText}>
          Don’t have an account yet?{" "}
          <Text style={styles.signupLink}>Sign up</Text>
        </Text>
      </View>

      {/* Right Side - Background Image */}
      <View style={styles.rightContainer}>
        <Image source={backgroundImg} style={styles.backgroundImage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row", 
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  headerContainer:{
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10
  },
  leftContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  rightContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 10,
    resizeMode: "contain",
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    color: "#333",
    flexShrink: 1
  },
  inputContainer: {
    width: "100%",
    maxWidth: 400,
    marginVertical: 10,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#5A8EF4",
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  
  forgotText: {
    color: "#007BFF",
    fontSize: 14,
  },
  button: {
    width: "100%",
    maxWidth: 400,
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
    fontSize: 14,
    color: "#555",
  },
  signupLink: {
    color: "#5A8EF4",
  },
  backgroundImage: {
    width: "100%",
    height: "90%",
    resizeMode: "contain",
    borderRadius: 45
  },
});