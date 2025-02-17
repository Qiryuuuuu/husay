import React, { useState } from "react";
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const element1 = require("../../../assets/element1.png");
const element2 = require("../../../assets/element2.png");
const element3 = require("../../../assets/element3.png");
const element4 = require("../../../assets/element4.png");
const element5 = require("../../../assets/element5.png");
const element6 = require("../../../assets/element6.png");

const backIcon = require("../../../assets/back-icon.png");
const logoImg = require("../../../assets/logo.png");
const defaultProfile = require("../../../assets/default-student.png");
const userIcon = require("../../../assets/user-icon.png");
const ageIcon = require("../../../assets/age-icon.png");
const genderIcon = require("../../../assets/gender-icon.png");

export default function AddStudentScreen({ navigation }) {
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "You need to allow access to your photos.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const addStudent = async () => {
    if (!name || !age || !gender) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const newStudent = {
        name,
        age,
        gender,
        profileImage,
        stars: 0,
      };

      await axios.post("YOUR_MONGODB_API_ENDPOINT", newStudent);
      Alert.alert("Success", "Student added successfully!");
      
      // Reset form
      setName("");
      setAge("");
      setGender("");
      setProfileImage(null);
    } catch (error) {
      console.error("Error adding student:", error);
      Alert.alert("Error", "Failed to add student.");
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
        <TouchableOpacity onPress={() => navigation.navigate("StudentProfile")} style={styles.backButton}>
          <Image source={backIcon} style={styles.backIcon} />
          <Text style={styles.backText}>Student Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.headerContainer}>
        <Image source={logoImg} style={styles.logo} />
        <View style={styles.textHeader}>
          <Text style={styles.title}>Husay</Text>
          <Text style={styles.subtitle}>Hugis, bilang, at kulay — aalalay!</Text>
        </View>
      </View>

      <View style={styles.formWrapper}>
        <View style={[styles.formContainer, styles.shadow]}>
          <TouchableOpacity onPress={selectImage} style={styles.profileImgContainer}>
            <Image source={profileImage ? { uri: profileImage } : defaultProfile} style={styles.profileImg} />
            <Text style={styles.changeText}>Upload Profile Picture</Text>
          </TouchableOpacity>

          <View style={styles.inputWrapper}>
            <Image source={userIcon} style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="Student name" placeholderTextColor="#BDBDBD" value={name} onChangeText={setName} />
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <Image source={ageIcon} style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Age" placeholderTextColor="#BDBDBD" value={age} onChangeText={setAge} keyboardType="numeric" />
            </View>
            <View style={styles.inputWrapper}>
              <Image source={genderIcon} style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Gender" placeholderTextColor="#BDBDBD" value={gender} onChangeText={setGender} />
            </View>
          </View>

          <TouchableOpacity style={[styles.button, styles.shadow]} onPress={addStudent}>
            <Text style={styles.buttonText}>Add student</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 Husay. All Rights Reserved.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  element1:{position: "absolute", bottom: -180, left: -10, resizeMode: "contain",},
  element2:{position: "absolute", top: -180, right: -70, resizeMode: "contain",},
  element3:{position: "absolute", left: -50, top: 300, resizeMode: "contain",},
  element4:{position: "absolute", right: -180, top: 300, resizeMode: "contain", },
  element5:{position: "absolute", bottom: -40, right: 40 , resizeMode: "contain", },
  element6:{position: "absolute", top: -70, left: 400, resizeMode: "contain", },
  
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 50,
    gap: 15,
  },
  title: {
    fontSize: 24,
    color: "#333",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  formWrapper: {
    flex: 1, // Takes up remaining space
    justifyContent: "center", // Centers the formContainer vertically
    alignItems: "center", // Centers it horizontally
    width: "100%",
  },
  formContainer: {
    padding: 50,
    borderRadius: 50,
    alignItems: "center",
    width: "90%",
    maxWidth: 650,
    backgroundColor: "#fff",
    alignSelf: "center",
  },
  profileImgContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImg: {
    width: 350,
    height: 350,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#5A8EF4",
  },
  changeText: {
    marginTop: 10,
    fontSize: 14,
    color: "#007BFF",
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    maxWidth: 245,
    gap: 10,
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
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
  },
  inputIcon: {
    width: 20,
    height: 20,
    marginRight: 20,
    resizeMode: "contain",
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  button: {
    width: "90%",
    backgroundColor: "#5A8EF4",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
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
