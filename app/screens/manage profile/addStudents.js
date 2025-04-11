//addStudent.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL =
  Platform.OS === "web"
    ? "http://localhost:5000/api/class/add-student"
    : "http://10.0.2.2:5000/api/class/add-student";

const backIcon = require("../../../assets/addStudent/Back.png");
const logoImg = require("../../../assets/Husay.png");
const defaultProfile = require("../../../assets/default-student.png");
const userIcon = require("../../../assets/user-icon.png");
const ageIcon = require("../../../assets/age-icon.png");
const genderIcon = require("../../../assets/gender-icon.png");
const addSquareIcon = require("../../../assets/addStudent/add-square.png");
const element1 = require("../../../assets/addStudent/element1.png");
const element2 = require("../../../assets/addStudent/element2.png");
const element3 = require("../../../assets/addStudent/element3.png");
const element4 = require("../../../assets/addStudent/element4.png");
const element5 = require("../../../assets/addStudent/element5.png");

export default function AddStudentScreen({ navigation }) {
  const [employeeNo, setEmployeeNo] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const storedEmployeeNo = await AsyncStorage.getItem("employeeNo");

        if (!token || !storedEmployeeNo) {
          Alert.alert(
            "Error",
            "Unauthorized: No token or employee number found."
          );
          navigation.navigate("Login");
          return;
        }
        setEmployeeNo(storedEmployeeNo);
      } catch (error) {
        console.error("❌ Error fetching user:", error);
        Alert.alert("Error", "Could not fetch user data.");
        navigation.navigate("Login");
      } finally {
        setAuthLoading(false);
      }
    };

    fetchUser();
  }, []);

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "You need to allow access to your photos."
      );
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
    if (!employeeNo) {
      Alert.alert("Error", "Unauthorized: Employee number is missing.");
      return;
    }
    if (!fullName || !age || !gender) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (isNaN(age) || age <= 0) {
      Alert.alert("Error", "Please enter a valid age.");
      return;
    }

    setLoading(true);

    //Saving the student data to the Database (MongoDB)
    try {
      const token = await AsyncStorage.getItem("authToken");

      const newStudent = {
        employeeNo,
        fullName,
        age: parseInt(age),
        gender,
        profileImage,
        stars: 0,
      };

      const response = await axios.post(API_URL, newStudent, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        Alert.alert("Success", "Student added successfully!");
        setFullName("");
        setAge("");
        setGender("");
        setProfileImage(null);
        navigation.navigate("StudentProfile");
      }
    } catch (error) {
      console.error("❌ Error adding student:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to add student."
      );
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Decorative Elements */}
      <Image source={element1} style={styles.element1} />
      <Image source={element2} style={styles.element2} />
      <Image source={element3} style={styles.element3} />
      <Image source={element4} style={styles.element4} />
      <Image source={element5} style={styles.element5} />

      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("StudentProfile")}
        style={styles.backButton}
      >
        <Image source={backIcon} style={styles.backIcon} />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Image source={logoImg} style={styles.logo} />
      </View>

      {/* Main Form Container */}
      <View style={styles.mainContainer}>
        <View style={styles.formCard}>
          {/* Profile Picture Upload */}
          <View style={styles.uploadContainer}>
            <TouchableOpacity onPress={selectImage}>
              <Image
                source={profileImage ? { uri: profileImage } : defaultProfile}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={selectImage}
              style={styles.uploadTextContainer}
            >
              <Text style={styles.uploadText}>Upload picture</Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.inputsContainer}>
            <View style={styles.inputWrapper}>
              <Image source={userIcon} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Student Name"
                value={fullName}
                onChangeText={setFullName}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputWrapper, styles.halfInput]}>
                <Image source={ageIcon} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Age"
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              </View>
              <View style={[styles.inputWrapper, styles.halfInput]}>
                <Image source={genderIcon} style={styles.inputIcon} />
                <Picker
                  selectedValue={gender}
                  style={styles.picker}
                  onValueChange={(itemValue) => setGender(itemValue)}
                >
                  <Picker.Item label="Sex" value="" />
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                  <Picker.Item label="Other" value="Other" />
                </Picker>
              </View>
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={addStudent}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <View style={styles.addButtonContent}>
                  <Image source={addSquareIcon} style={styles.addButtonIcon} />
                  <Text style={styles.addButtonText}>Add Student</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>© 2024 Husay. All Rights Reserved.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    position: "relative",
  },
  // Decorative Elements
  element1: {
    position: "absolute",
    bottom: 500,
    right: -210,
    width: 500,
    height: 300,
    resizeMode: "contain",
  },
  element2: {
    position: "absolute",
    top: 300,
    right: -120,
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
  element3: {
    position: "absolute",
    left: 1000,
    top: 620,
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  element4: {
    position: "absolute",
    right: 1090,
    top: 250,
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
  element5: {
    position: "absolute",
    bottom: -70,
    left: 40,
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  // Back Button
  backButton: {
    position: "absolute",
    top: 60,
    left: 70,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },
  backIcon: {
    width: 100,
    height: 65,
    resizeMode: "contain",
  },
  // Header
  header: {
    alignItems: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  logo: {
    resizeMode: "contain",
    marginBottom: 30,
  },

  // Main Container
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 30,
    width: "100%",
    maxWidth: 500,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  // Upload Container
  uploadContainer: {
    alignItems: "center",
    marginBottom: 30,
    position: "relative",
  },
  uploadTextContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 7,
    paddingHorizontal: 29,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
    zIndex: 1,
    marginBottom: -10,
  },
  profileImageContainer: {
    zIndex: 2,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 3,
    backgroundColor: "#F0F0F0",
    marginBottom: -5,
    zIndex: 1,
  },
  uploadText: {
    color: "#666666",
    fontSize: 14,
    textAlign: "center",
  },
  // Form Inputs
  inputsContainer: {
    marginTop: 10,
    width: "100%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    marginBottom: 15,
    width: "100%",
  },
  inputIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#333333",
    marginLeft: 10,
  },
  rowInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  halfInput: {
    width: "48%",
  },
  picker: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    fontSize: 14,
  },
  // Add Button
  addButton: {
    flexDirection: "row",
    backgroundColor: "#4A90E2",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderWidth: 4,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
  },
  addButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  addButtonIcon: {
    width: 25,
    height: 25,
    marginRight: 8,
    resizeMode: "contain",
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  // Footer
  footer: {
    textAlign: "center",
    color: "#666666",
    marginBottom: 20,
    marginTop: 50,
    fontSize: 18,
  },
});
