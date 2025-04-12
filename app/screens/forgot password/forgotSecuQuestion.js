import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
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
  const [email, setEmail] = useState("");
  const [fetchedQuestions, setFetchedQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const handleFetchQuestions = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    try {
      setLoadingQuestions(true);
      const response = await fetch("http://10.0.2.2:5000/api/auth/user/security-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        setFetchedQuestions(data.questions);
        setSelectedQuestion(data.questions[0]?.question || "");
      } else {
        Alert.alert("Error", data.message || "No questions found.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Error", "Server error. Please try again.");
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selectedQuestion || !answer) {
      Alert.alert("Error", "Please select a question and enter your answer.");
      return;
    }

    try {
      const response = await fetch("http://10.0.2.2:5000/api/auth/validate-security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          securityAnswers: [{ question: selectedQuestion, answer }],
        }),
      });

      const data = await response.json();
      if (data.message === "Security questions verified successfully.") {
        navigation.navigate("SetPassword", { phoneNumber: "", email });
      } else {
        Alert.alert("Error", data.message || "Incorrect answer.");
      }
    } catch (error) {
      console.error("Validation error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

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
          <Text style={styles.subtitle}>Choose one security question to verify</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        {/* Email Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Enter your PLM email"
            placeholderTextColor="#BDBDBD"
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (text.trim() === "") {
                setFetchedQuestions([]);
                setSelectedQuestion("");
                setAnswer("");
              }
            }}
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity style={[styles.button, styles.shadow]} onPress={handleFetchQuestions} disabled={loadingQuestions}>
          <Text style={styles.buttonText}>Get Security Questions</Text>
        </TouchableOpacity>

        {fetchedQuestions.length > 0 && (
          <>
            {/* Dropdown Picker */}
            <View style={styles.inputWrapper}>
              <Picker
                selectedValue={selectedQuestion}
                onValueChange={(itemValue) => setSelectedQuestion(itemValue)}
                style={styles.picker}
              >
                {fetchedQuestions.map((q, index) => (
                  <Picker.Item key={index} label={q.question} value={q.question} />
                ))}
              </Picker>
            </View>

            {/* Answer Field */}
            <View style={styles.inputWrapper}>
              <Image source={answerIcon} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Answer"
                placeholderTextColor="#BDBDBD"
                value={answer}
                onChangeText={setAnswer}
              />
            </View>

            <TouchableOpacity style={[styles.button, styles.shadow]} onPress={handleSubmitAnswer}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

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