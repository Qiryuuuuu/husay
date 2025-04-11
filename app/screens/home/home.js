//home.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  useWindowDimensions,
  ImageBackground,
  Alert,
  Platform
} from "react-native";
import SettingsModal from "../../component/setting";
import { playMusic, stopMusic } from "../../component/audio/MusicManager";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTimer } from "../../contexts/TimerContext";

/* Background image */
const bgImg = require("../../../assets/gameBackground/blue.png");
/* Header images */
const logoImg = require("../../../assets/icons/white-logo.png");
const studentImg = require("../../../assets/default-student.png");
const settingIcon = require("../../../assets/icons/setting-icon.png");
/* Menu cards */
const classCard = require("../../../assets/menuCards/home/class-card.png");
const practiceCard = require("../../../assets/menuCards/home/practice-card.png");
const challengeCard = require("../../../assets/menuCards/home/challenge-card.png");

const settingHeader = require("../../../assets/headerText/setting-header.png");

export default function HomeScreen({ route }) {
  const { width, height } = useWindowDimensions();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [studentImage, setStudentImage] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();
  const { studentId } = route.params || {}; // Get studentName from params
  const { stopTimer } = useTimer();

  console.log("🏠 HomeScreen received studentId:", studentId); // Debugging
  useEffect(() => {
    playMusic("appBg");
    return () => stopMusic(); // Stop music when the screen unmounts
  }, []);

  useEffect(() => {
    async function fetchStudentName() {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          console.error("No auth token found");
          return;
        }

        // Separate the URL from the options object

        const baseUrl =
        Platform.OS === 'web'
          ? 'http://localhost:5000' // Web: use localhost
          : 'http://10.0.2.2:5000'; // Android emulator
      
      const response = await fetch(
        `${baseUrl}/api/students/get-student-name/${studentId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        // data should contain { name: "Some Name" } or similar
        setStudentName(data.fullName || "");
        console.log("Student Name: ", data.fullName);
      } catch (error) {
        console.error("Error fetching student name:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (studentId) {
      fetchStudentName();
    } else {
      // If there's no studentId, stop loading to avoid a spinner hanging
      setIsLoading(false);
    }
  }, [studentId]);


  useEffect(() => {
    async function fetchStudentImage() {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const baseUrl =
          Platform.OS === 'web'
            ? 'http://localhost:5000'
            : 'http://10.0.2.2:5000';
  
        const response = await fetch(`${baseUrl}/api/students/get-student-image/${studentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = await response.json();
        setStudentImage(data.profileImage || null);
      } catch (error) {
        console.error("❌ Error fetching student image:", error);
      }
    }
  
    if (studentId) {
      fetchStudentImage();
    }
  }, [studentId]);

  const handleLogout = async () => {
    try {
      await stopTimer(); // ✅ stop timer first
      await AsyncStorage.clear();
  
      Alert.alert("Logged Out", "You have been logged out.", [
        { text: "OK", onPress: () => navigation.replace("Login") },
      ]);
  
      console.log("✅ User successfully logged out.");
    } catch (error) {
      console.error("❌ Error logging out:", error);
    }
  };
  

  const handleSwitchProfile = async () => {
    try {
      await stopTimer(); // ✅ stop timer when switching profile
      console.log("Switching Profile...");
      navigation.navigate("StudentProfile");
    } catch (error) {
      console.error("❌ Error switching profile:", error);
    }
  };
  

  return (
    <ImageBackground source={bgImg} style={styles.backgroundImage}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={logoImg} style={styles.logo} />

          <View style={styles.studentInfo}>
          <Image
            source={
              studentImage
                ? { uri: studentImage }
                : studentImg // fallback default
            }
            style={styles.studentImg}
          />
            <Text style={styles.studentName}>
              {studentName || "Student Name"}
            </Text>
          </View>

          <TouchableOpacity onPress={() => setSettingsVisible(true)}>
            <Image source={settingIcon} style={styles.settingImg} />
          </TouchableOpacity>
        </View>

        {/* Main content */}
        <View style={styles.cardContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("Class", {studentId})}>
            <Image source={classCard} style={styles.cards} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              console.log(
                "Navigating to PracMainScreen with studentId:",
                studentId
              ); // Debugging
              navigation.navigate("PracMainScreen", { studentId });
            }}
          >
            <Image source={practiceCard} style={styles.cards} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              console.log(
                "Navigating to ChallMainScreen with studentId:",
                studentId
              ); // Debugging
              navigation.navigate("ChallMainScreen", { studentId });
            }}
          >
            <Image source={challengeCard} style={styles.cards} />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 Husay. All Rights Reserved.
          </Text>
        </View>

        {/* Use SettingsModal Component */}
        <SettingsModal
          visible={settingsVisible}
          onClose={() => setSettingsVisible(false)}
          headerImage={settingHeader}
          buttonOneText="Switch Profile"
          buttonTwoText="Logout"
          onButtonOnePress={handleSwitchProfile}
          onButtonTwoPress={handleLogout}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
  },
  /* Header */
  studentImg: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#FAE3B7",
  },
  studentName: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  studentInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#5A8EF4",
    paddingHorizontal: 60,
    paddingVertical: 15,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: "#FAE3B7",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 50,
    paddingVertical: 30,
    width: "100%",
  },

  /* Main Content */
  cardContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 35,
    marginTop: 20,
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
