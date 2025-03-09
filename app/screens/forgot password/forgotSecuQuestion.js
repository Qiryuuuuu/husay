import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

const logoImg = require("../../../assets/logo.png");
const backIcon = require("../../../assets/back-icon.png");
const element1 = require("../../../assets/element1.png");
const element2 = require("../../../assets/element2.png");
const element3 = require("../../../assets/element3.png");
const element4 = require("../../../assets/element4.png");
const element5 = require("../../../assets/element5.png");
const element6 = require("../../../assets/element6.png");
const answerIcon = require("../../../assets/book-icon.png");

export default function ForgotSecurityQuestionScreen({ navigation }) {
  const [selectedQuestion1, setSelectedQuestion1] = useState("");
  const [selectedQuestion2, setSelectedQuestion2] = useState("");
  const [selectedQuestion3, setSelectedQuestion3] = useState("");
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [answer3, setAnswer3] = useState("");

  const securityQuestions = [
    "What is your pet’s name?",
    "What is your mother’s maiden name?",
    "What was the name of your first school?",
    "What is your favorite movie?",
    "What city were you born in?",
  ];

  return (
    <View style={styles.container}>
      <Image source={element1} style={styles.element1} />
      <Image source={element2} style={styles.element2} />
      <Image source={element3} style={styles.element3} />
      <Image source={element4} style={styles.element4} />
      <Image source={element5} style={styles.element5} />
      <Image source={element6} style={styles.element6} />

      <View style={styles.backHeader}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.backButton}>
          <Image source={backIcon} style={styles.backIcon} />
          <Text style={styles.backText}>Back to login</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.headerContainer}>
        <Image source={logoImg} style={styles.logo} />
        <View style={styles.textHeader}>
          <Text style={styles.title}>Forgot password</Text>
          <Text style={styles.subtitle}>Provide answers to secure your account</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        {/* Security Question 1 */}
        <View style={styles.inputWrapper}>
          <Picker
            selectedValue={selectedQuestion1}
            onValueChange={(itemValue) => setSelectedQuestion1(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a Security Question" value="" />
            {securityQuestions.map((question, index) => (
              <Picker.Item key={index} label={question} value={question} />
            ))}
          </Picker>
        </View>
        <View style={styles.inputWrapper}>
          <Image source={answerIcon} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Answer"
            placeholderTextColor="#BDBDBD"
            value={answer1}
            onChangeText={setAnswer1}
          />
        </View>

        {/* Security Question 2 */}
        <View style={styles.inputWrapper}>
          <Picker
            selectedValue={selectedQuestion2}
            onValueChange={(itemValue) => setSelectedQuestion2(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a Security Question" value="" />
            {securityQuestions.map((question, index) => (
              <Picker.Item key={index} label={question} value={question} />
            ))}
          </Picker>
        </View>
        <View style={styles.inputWrapper}>
          <Image source={answerIcon} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Answer"
            placeholderTextColor="#BDBDBD"
            value={answer2}
            onChangeText={setAnswer2}
          />
        </View>

        {/* Security Question 3 */}
        <View style={styles.inputWrapper}>
          <Picker
            selectedValue={selectedQuestion3}
            onValueChange={(itemValue) => setSelectedQuestion3(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a Security Question" value="" />
            {securityQuestions.map((question, index) => (
              <Picker.Item key={index} label={question} value={question} />
            ))}
          </Picker>
        </View>
        <View style={styles.inputWrapper}>
          <Image source={answerIcon} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Answer"
            placeholderTextColor="#BDBDBD"
            value={answer3}
            onChangeText={setAnswer3}
          />
        </View>
      </View>

      <TouchableOpacity style={[styles.button, styles.shadow]} onPress={() => navigation.navigate("StudentProfile")}>
        <Text style={styles.buttonText}>Submit</Text>
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
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 15,
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
  picker: {
    width: "100%",
    height: 50,
    color: "#333",
    backgroundColor: "transparent", 
    borderWidth: 0, 
    outline: "none", 
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
  button: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#5A8EF4",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
    marginBottom: 15,
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