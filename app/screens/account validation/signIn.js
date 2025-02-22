import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  useWindowDimensions,
} from "react-native";
import axios from "axios";

const logoImg = require("../../../assets/logo.png");
const element1 = require("../../../assets/element1.png");
const element2 = require("../../../assets/element2.png");
const element3 = require("../../../assets/element3.png");
const element4 = require("../../../assets/element4.png");

export default function LoginScreen({ navigation }) {  // ✅ Use navigation from props
  const { width, height } = useWindowDimensions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    try {
      const response = await axios.post("http://10.0.2.2:5000/api/auth/signin", {
        email,
        password,
      });

      if (response.status === 200) {
        Alert.alert("Success", response.data.message);
        console.log("Token:", response.data.token);

        // ✅ Ensure the screen name matches Stack Navigator
        navigation.navigate("StudentProfile"); 
      }
    } catch (error) {
      console.error("❌ Error:", error);
      Alert.alert("Error", error.response?.data?.message || "Something went wrong");
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
        <View style={styles.textHeader}>
          <Text style={styles.title}>Empower Young Minds</Text>
          <Text style={styles.subtitle}>
            Your pupil’s first step into fun and creative learning!
          </Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#BDBDBD"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#BDBDBD"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      
      <View style={styles.forgotContainer}>
        <TouchableOpacity>
          <Text
            style={styles.forgotText}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            Forgot password?
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={[styles.button, styles.shadow]} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>

      <Text style={styles.signupText}>
        Don’t have an account yet?{" "}
        <Text
          style={styles.signupLink}
          onPress={() => navigation.navigate("SignUp")}
        >
          Sign up
        </Text>
      </Text>
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
    width: 40,
    height: 40,
    marginBottom: 10,
    resizeMode: "contain",
    marginRight: 10,
  },
  textHeader: {
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    color: "#333",
    flexShrink: 1,
  },
  inputContainer: {
    width: "100%",
    maxWidth: 400,
    marginVertical: 10,
  },
  input: {
    width: "100%",
    padding: 10,
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
    textDecorationLine: "underline",
  },
  button: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#5A8EF4",
    padding: 10,
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
    textDecorationLine: "underline",
  },
});
