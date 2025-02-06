import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";

const logoImg = require("../../assets/logo.png");
const backgroundImg = require("../../assets/signup-bg.webp");

export default function SignUpScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Left Side - Image and Title */}
      <View style={styles.leftContainer}>
        <View style={styles.headerContainer}>
          <Image source={logoImg} style={styles.logo} />
          <Text style={styles.title}>
            Discover Your Adventure! Fun, Learning, and Play Await!
          </Text>
        </View>
        <Image source={backgroundImg} style={styles.backgroundImage} />
      </View>

      {/* Right Side - Sign-up Form */}
      <View style={styles.rightContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.textSignUp}>Create an account</Text>
          <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#BDBDBD" />
          
          <View style={styles.inputRow}>
            <TextInput style={styles.halfInput} placeholder="Full Name" placeholderTextColor="#BDBDBD" />
            <TextInput style={styles.halfInput} placeholder="Employee No." placeholderTextColor="#BDBDBD" />
          </View>

          <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#BDBDBD" secureTextEntry />
          <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor="#BDBDBD" secureTextEntry /> 
        </View>

        <View style={styles.nextContainer}>
          <TouchableOpacity>
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
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  leftContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    width: "50%", 
  },
  rightContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    width: "100%", 
    height: "60%", 
    resizeMode: "cover",
    borderRadius: 40, 
    marginVertical: 10, 
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
    flexShrink: 1,
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
    padding: 12,
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
    padding: 12,
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

