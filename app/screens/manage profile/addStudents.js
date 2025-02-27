import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, Image, StyleSheet, TouchableOpacity, 
  Alert, ActivityIndicator 
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; 

const API_URL = "http://10.0.2.2:5000/api/class/add-student"; // ✅ Fixed API endpoint

const backIcon = require("../../../assets/back-icon.png");
const logoImg = require("../../../assets/logo.png");
const defaultProfile = require("../../../assets/default-student.png");
const userIcon = require("../../../assets/user-icon.png");
const ageIcon = require("../../../assets/age-icon.png");
const genderIcon = require("../../../assets/gender-icon.png");

export default function AddStudentScreen({ navigation }) {
  const [employeeNo, setEmployeeNo] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // ✅ Fetch logged-in user's employeeNo from AsyncStorage
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const storedEmployeeNo = await AsyncStorage.getItem("employeeNo");

        if (!token || !storedEmployeeNo) {
          Alert.alert("Error", "Unauthorized: No token or employee number found.");
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

  // ✅ Select and Upload Image
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

  // ✅ Add Student with Authentication Token
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

    try {
      const token = await AsyncStorage.getItem("authToken"); // ✅ Retrieve the token

      const newStudent = {
        employeeNo,  // ✅ Only logged-in teacher can add students
        fullName,
        age: parseInt(age),
        gender,
        profileImage,
        stars: 0,
      };

      const response = await axios.post(API_URL, newStudent, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Send token for authentication
        },
      });

      if (response.status === 201) {
        Alert.alert("Success", "Student added successfully!");

        // ✅ Reset form fields
        setFullName("");
        setAge("");
        setGender("");
        setProfileImage(null);

        // ✅ Redirect back to Student Profile
        navigation.navigate("StudentProfile");
      }
    } catch (error) {
      console.error("❌ Error adding student:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to add student.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Show a loading screen while fetching user data
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
            <TextInput 
              style={styles.input} 
              placeholder="Student name" 
              placeholderTextColor="#BDBDBD" 
              value={fullName} 
              onChangeText={setFullName} 
            />
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <Image source={ageIcon} style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                placeholder="Age" 
                placeholderTextColor="#BDBDBD" 
                value={age} 
                onChangeText={setAge} 
                keyboardType="numeric" 
              />
            </View>

            <View style={styles.inputWrapper}>
              <Image source={genderIcon} style={styles.inputIcon} />
              <Picker
                selectedValue={gender}
                style={styles.input}
                onValueChange={(itemValue) => setGender(itemValue)}
              >
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>
          </View>

          <TouchableOpacity style={[styles.button, styles.shadow]} onPress={addStudent} disabled={loading}>
            {loading ? <ActivityIndicator color="#000000" /> : <Text style={styles.buttonText}>Add Student</Text>}
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
