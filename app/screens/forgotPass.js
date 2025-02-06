import React from "react";
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity } from "react-native";

const logoImg = require("../../assets/logo.png");
const backIcon = require("../../assets/back-icon.png")

export default function ForgotPasswordScreen({ navigation }) {
  return (
    <View style={styles.container}>
        <View style={styles.backHeader}>
            <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.backButton}>
                <Image source={backIcon} style={styles.backIcon}/>
                <Text style={styles.backText}>Back to login</Text>
            </TouchableOpacity>
        </View>

      {/* Logo */}
      <Image source={logoImg} style={styles.logo} />

      {/* Title & Subtitle */}
      <View style={styles.textHeader}>
        <Text style={[styles.title, styles.headerText]}>Forgot password?</Text>
        <Text style={[styles.subtitle, styles.headerText]}>
          No worries, we’ll send you reset instructions
        </Text>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="Email Address" 
            placeholderTextColor="#BDBDBD"
          />
        </View>

        <TouchableOpacity>
            <Text style={styles.securityQuestionText}>Answer security questions?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.shadow]}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  },
  backText: {
    color: "#5A8EF4",
  },  
  container: {
    flex: 1,  
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 10,
    resizeMode: "contain",
  },
  textHeader: {
    alignItems: "center",
  },
  headerText: {
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
  },
  formContainer: {
    width: "100%",  
    maxWidth: 500,  
    alignItems: "center", 
  },
  inputContainer: {
    width: "100%", 
    maxWidth: 400, 
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
    marginBottom: 10,
    marginTop: 10
  },
  securityQuestionText:{
    color: "#5A8EF4",
    textDecorationLine: "underline"
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
    marginTop: 15
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
  }
});

