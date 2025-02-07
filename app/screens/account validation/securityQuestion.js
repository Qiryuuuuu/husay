import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

const logoImg = require("../../../assets/logo.png");
const element1 = require("../../../assets/element1.png")
const element2 = require("../../../assets/element2.png")
const element3 = require("../../../assets/element3.png")
const element4 = require("../../../assets/element4.png")

export default function SecurityQuestionScreen({ navigation }) {
  const [selectedQuestion1, setSelectedQuestion1] = useState("");
  const [selectedQuestion2, setSelectedQuestion2] = useState("");
  const [selectedQuestion3, setSelectedQuestion3] = useState("");

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

        <View style={styles.headerContainer}>
          <Image source={logoImg} style={styles.logo} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.textSignUp}>Create an account</Text>

          {/* Security Question 1 */}
          <View style={styles.inputRow}>
            <View style={styles.halfInput}>
              <Picker
                selectedValue={selectedQuestion1}
                onValueChange={(itemValue) => setSelectedQuestion1(itemValue)}
                style={[styles.picker, selectedQuestion1 === "" && styles.pickerPlaceholder]}
              >
                <Picker.Item label="Select a Security Question" value="" />
                {securityQuestions.map((question, index) => (
                    <Picker.Item 
                    key={index} 
                    label={question} 
                    value={question} 
                    color={selectedQuestion1 === question ? "#4A90E2" : "#BDBDBD"}
                    />
                ))}
              </Picker>
            </View>
            <TextInput style={styles.halfInput} placeholder="Answer" placeholderTextColor="#BDBDBD" />
          </View>

          {/* Security Question 2 */}
          <View style={styles.inputRow}>
            <View style={styles.halfInput}>
              <Picker
                selectedValue={selectedQuestion2}
                onValueChange={(itemValue) => setSelectedQuestion2(itemValue)}
                style={[styles.picker, selectedQuestion2 === "" && styles.pickerPlaceholder]}              
                >
                <Picker.Item label="Select a Security Question" value="" />
                {securityQuestions.map((question, index) => (
                    <Picker.Item 
                    key={index} 
                    label={question} 
                    value={question} 
                    color={selectedQuestion2 === question ? "#4A90E2" : "#BDBDBD"}
                    />
                ))}
              </Picker>
            </View>
            <TextInput style={styles.halfInput} placeholder="Answer" placeholderTextColor="#BDBDBD" />
          </View>

          {/* Security Question 3 */}
          <View style={styles.inputRow}>
            <View style={styles.halfInput}>
              <Picker
                selectedValue={selectedQuestion3}
                onValueChange={(itemValue) => setSelectedQuestion3(itemValue)}
                style={[styles.picker, selectedQuestion3 === "" && styles.pickerPlaceholder]} 
              >
                <Picker.Item label="Select a Security Question" value="" />
                {securityQuestions.map((question, index) => (
                    <Picker.Item 
                    key={index} 
                    label={question} 
                    value={question} 
                    color={selectedQuestion3 === question ? "#4A90E2" : "#BDBDBD"}
                    />
                ))}
              </Picker>
            </View>
            <TextInput style={styles.halfInput} placeholder="Answer" placeholderTextColor="#BDBDBD" />
          </View>
        </View>

          <TouchableOpacity style={[styles.button, styles.shadow]}>
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>

      </View>
  );
}

const styles = StyleSheet.create({
  element1:{
    position: "absolute",
    top: -30,
    left: -50,   
    resizeMode: "contain",
  },
  element2:{
    position: "absolute",
    top: -30,
    right: -70,   
    resizeMode: "contain",
  },
  element3:{
    position: "absolute",
    bottom: -50,
    left: -90,   
    resizeMode: "contain",
  },
  element4:{
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
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain"
  },
  textSignUp: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 14,
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
    fontSize: 14,
    fontWeight: "bold",
  },
});
