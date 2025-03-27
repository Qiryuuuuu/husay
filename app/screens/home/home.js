import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  useWindowDimensions,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import SettingsModal from "../../component/setting";
import { playMusic, stopMusic } from "../../component/audio/MusicManager";
import { useNavigation } from "@react-navigation/native";
import axios from "axios"; 
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const navigation = useNavigation();
  const { studentName, studentId } = route.params || {}; // Get studentName from params

  const [studentData, setStudentData] = useState(null); // ✅ State for student data
  const [loading, setLoading] = useState(true); // ✅ Loading state
  const [error, setError] = useState(null); // ✅ Error state

  useEffect(() => {
    playMusic("appBg");
    return () => stopMusic(); // Stop music when the screen unmounts
  }, []);

  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      return;
    }
  
    const fetchStudent = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          throw new Error("No authentication token found");
        }
  
        const response = await axios.get(
          `http://10.0.2.2:5000/api/students/get/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (response.status === 200) {
          console.log("✅ Student data:", response.data);
          setStudentData(response.data.student);
        } else {
          throw new Error("Failed to fetch student data");
        }
      } catch (err) {
        console.error("❌ Error fetching student:", err);
        setError("Failed to fetch student data");
      } finally {
        setLoading(false);
      }
    };
  
    fetchStudent();
  }, [studentId]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken"); // ✅ Clear authentication token
      console.log("User logged out successfully.");
      
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }], // ✅ Ensure user is redirected to login
      });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <ImageBackground source={bgImg} style={styles.backgroundImage}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={logoImg} style={styles.logo} />

          <View style={styles.studentInfo}>
            <Image source={studentImg} style={styles.studentImg} />
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : error ? (
              <Text style={styles.studentName}>{error}</Text>
            ) : (
              <Text style={styles.studentName}>
                {studentData?.fullName || studentName || "Student Name"}
              </Text>
            )}
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
              navigation.navigate("PracMainScreen", { studentId });
            }}
          >
            <Image source={practiceCard} style={styles.cards} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
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
          onButtonOnePress={() => {
            console.log("Switching Profile...");
            navigation.navigate("StudentProfile"); // Navigate back to Student Profile
          }}
          onButtonTwoPress={() => {console.log("Logging Out...");
            handleLogout();
          }}
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
