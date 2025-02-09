import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";

const logoImg = require("../../../assets/logo.png");
const element1 = require("../../../assets/element1.png");
const element2 = require("../../../assets/element2.png");
const element3 = require("../../../assets/element3.png");
const element4 = require("../../../assets/element4.png");

// 📌 Use your local IP if using a physical device
const API_URL = "http://10.0.2.2:5000";  // Change to your actual API URL

export default function SecurityQuestionScreen({ navigation, route }) {
  const { email, isRegistration } = route.params || {}; // Get email and mode from previous screen

  const [selectedQuestion1, setSelectedQuestion1] = useState("");
  const [answer1, setAnswer1] = useState("");

  const [selectedQuestion2, setSelectedQuestion2] = useState("");
  const [answer2, setAnswer2] = useState("");

  const [selectedQuestion3, setSelectedQuestion3] = useState("");
  const [answer3, setAnswer3] = useState("");

  const securityQuestions = [
    "What is your pet’s name?",
    "What is your mother’s maiden name?",
    "What was the name of your first school?",
    "What is your favorite movie?",
    "What city were you born in?",
  ];

  const securityAnswers = [
    { question: selectedQuestion1, answer: answer1 },
    { question: selectedQuestion2, answer: answer2 },
    { question: selectedQuestion3, answer: answer3 },
  ];

  // Function to handle saving security questions during registration
const handleSaveSecurityQuestions = async () => {
    if (!selectedQuestion1 || !answer1 || !selectedQuestion2 || !answer2 || !selectedQuestion3 || !answer3) {
      Alert.alert("Error", "Please select and answer all security questions.");
      return;
    }
  
    const securityAnswers = [
      { question: selectedQuestion1, answer: answer1 },
      { question: selectedQuestion2, answer: answer2 },
      { question: selectedQuestion3, answer: answer3 },
    ];
  
    console.log("🔄 Saving security questions to server:", securityAnswers);
  
    try {
      const response = await fetch(`${API_URL}/api/auth/save-security`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, securityQuestions: securityAnswers }),
      });
  
      const data = await response.json();
      console.log("🔄 Server Response:", data);
  
      if (response.ok) {
        console.log("✅ Security Questions Saved in DB!");
        Alert.alert("Success", "Security questions saved successfully!");
        navigation.navigate("HomeScreen"); // Change to actual destination
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.error("❌ Error saving security questions:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  // Function to handle validating security questions during login
  const handleSecurityValidation = async () => {
    try {
      const response = await fetch("http:10.0.2.2:5000/api/auth/validate-security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, securityAnswers }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("✅ Security Questions Verified!");
        Alert.alert("Success", "Security questions verified successfully!");
        navigation.navigate("ResetPasswordScreen"); // Change to actual destination
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.error("❌ Error validating security questions:", error);
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
        <Text style={styles.textSignUp}>
          {isRegistration ? "Set up your security questions" : "Verify your security questions"}
        </Text>

        {/* Security Questions */}
        {[1, 2, 3].map((index) => (
          <View key={index} style={styles.inputRow}>
            <View style={styles.halfInput}>
              <Picker
                selectedValue={index === 1 ? selectedQuestion1 : index === 2 ? selectedQuestion2 : selectedQuestion3}
                onValueChange={(itemValue) => {
                  if (index === 1) setSelectedQuestion1(itemValue);
                  if (index === 2) setSelectedQuestion2(itemValue);
                  if (index === 3) setSelectedQuestion3(itemValue);
                }}
                style={styles.picker}
              >
                <Picker.Item label="Select a Security Question" value="" />
                {securityQuestions.map((question, i) => (
                  <Picker.Item key={i} label={question} value={question} />
                ))}
              </Picker>
            </View>
            <TextInput
              style={styles.halfInput}
              placeholder="Answer"
              placeholderTextColor="#BDBDBD"
              value={index === 1 ? answer1 : index === 2 ? answer2 : answer3}
              onChangeText={(text) => {
                if (index === 1) setAnswer1(text);
                if (index === 2) setAnswer2(text);
                if (index === 3) setAnswer3(text);
              }}
            />
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, styles.shadow]}
        onPress={isRegistration ? handleSaveSecurityQuestions : handleSecurityValidation}
      >
        <Text style={styles.buttonText}>{isRegistration ? "Save" : "Sign Up"}</Text>
      </TouchableOpacity>
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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  textSignUp: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  inputContainer: {
    width: "100%",
    maxWidth: 600,
    marginVertical: 10,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 600,
    gap: 10,
  },
  halfInput: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 12,
    borderWidth: 1,
    borderColor: "#5A8EF4",
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  picker: {
    width: "100%",
    height: 50,
    color: "#333",
  },
  pickerPlaceholder: {
    color: "#aaa",
  },
  button: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#5A8EF4",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    backgroundColor: "#4A90E2",
  },
});
