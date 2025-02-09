import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, useWindowDimensions } from "react-native";

const logoImg = require("../../../assets/logo.png");
const element1 = require("../../../assets/element1.png")
const element2 = require("../../../assets/element2.png")
const element3 = require("../../../assets/element3.png")
const element4 = require("../../../assets/element4.png")
const element5 = require("../../../assets/element5.png")
const element6 = require("../../../assets/element6.png")
const eyeOpen = require("../../../assets/show-icon.png"); 
const eyeClosed = require("../../../assets/hide-icon.png");


export default function LoginScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const [passwordVisible, setPasswordVisible] = useState(false);


  return (
    <View style={styles.container}>
        <Image source={element1} style={styles.element1} />
        <Image source={element2} style={styles.element2} />
        <Image source={element3} style={styles.element3} />
        <Image source={element4} style={styles.element4} />
        <Image source={element5} style={styles.element5} />
        <Image source={element6} style={styles.element6} />


        <View style={styles.headerContainer}>
          <Image source={logoImg} style={styles.logo} />
            <View style={styles.textHeader}>
              <Text style={styles.title}>Empower Young Minds</Text>
              <Text style={styles.subtitle}>Your pupil’s first step into fun and creative learning!</Text>
            </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Image source={require("../../../assets/user-icon.png")} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#BDBDBD"
            />
          </View>       
             
          <View style={styles.inputWrapper}>
            <Image source={require("../../../assets/key-icon.png")} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#BDBDBD"
              secureTextEntry={!passwordVisible}          
            />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Image source={passwordVisible ? eyeOpen : eyeClosed} style={styles.eyeIcon} />
          </TouchableOpacity>
         </View>
        </View>

        <View style={styles.forgotContainer}>
          <TouchableOpacity>
            <Text style={styles.forgotText} onPress={() => navigation.navigate("ForgotPassword")}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.button, styles.shadow]} onPress={() => navigation.navigate("StudentProfile")}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>

        <Text style={styles.signupText}>
          Don’t have an account yet?{" "}
          <Text style={styles.signupLink} onPress={() => navigation.navigate("SignUp")}>
            Sign up
          </Text>
        </Text>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2024 Husay. All Rights Reserved.</Text>
        </View>

      </View>
  );
}

const styles = StyleSheet.create({
    element1:{position: "absolute", bottom: -180, left: -10, resizeMode: "contain",},
    element2:{position: "absolute", top: -180, right: -70, resizeMode: "contain",},
    element3:{position: "absolute", left: -50, resizeMode: "contain",},
    element4:{position: "absolute", right: -180 , resizeMode: "contain", },
    element5:{position: "absolute", bottom: -40, right: 40 , resizeMode: "contain", },
    element6:{position: "absolute", top: -70, left: 400, resizeMode: "contain", },


    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
    headerContainer:{
      alignItems: "center",
      marginTop: 20
    },
    logo: {
      width: 80,
      height: 80,
      marginBottom: 20,
      resizeMode: "contain",
      marginRight: 10,
    },
    textHeader:{
      alignItems: "center",
    },
    title: {
      fontSize: 20,
      color: "#333",
      flexShrink: 1
    },
    subtitle:{
      fontSize: 24,
      marginBottom: 15
    },
    inputContainer: {
      width: "100%",
      maxWidth: 500,
      marginVertical: 10,
    },inputWrapper: {
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
    forgotText: {
      color: "#007BFF",
      fontSize: 16,
      textDecorationLine: "underline"
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