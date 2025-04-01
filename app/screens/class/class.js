import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const API_URL = "http://10.0.2.2:5000/api/class/get-students";

const element1 = require("../../../assets/element1.png");
const element3 = require("../../../assets/element3.png");
const element4 = require("../../../assets/element4.png");
const element5 = require("../../../assets/element5.png");
const element6 = require("../../../assets/element6.png");
const backIcon = require("../../../assets/back-icon.png");
const starIcon = require("../../../assets/star-icon.png");
const defaultProfile = require("../../../assets/default-profile.png");

export default function LeaderboardScreen({ navigation, route }) {
  const [students, setStudents] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const studentId = route?.params?.studentId || null;
  useFocusEffect(
    React.useCallback(() => {
      fetchStudents();
    }, [])
  );

  const fetchStudents = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "Unauthorized: No token found.");
        navigation.navigate("Login");
        return;
      }

      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const sortedStudents = response.data.students.sort(
          (a, b) => (b.stars?.totalStars || 0) - (a.stars?.totalStars || 0)
        );

        setStudents(sortedStudents);
        setSelectedStudent(sortedStudents[0] || null);
      } else {
        Alert.alert("Error", "Failed to fetch students.");
      }
    } catch (error) {
      console.error("❌ Error fetching students:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Could not fetch student data."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStudentPress = (student) => {
    setSelectedStudent(student);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text>Loading students...</Text>
      </View>
    );
  }

  const displayedStudents = showAll ? students : students.slice(0, 3);

  return (
    <View style={styles.container}>
      <Image
        source={element1}
        style={[styles.element1, styles.backgroundElement]}
      />
      <Image source={element3} style={styles.element3} />
      <Image source={element4} style={styles.element4} />
      <Image
        source={element5}
        style={[styles.element5, styles.backgroundElement]}
      />
      <Image source={element6} style={styles.element6} />

      <View style={styles.navContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home", { studentId })}
          style={styles.backButton}
        >
          <Image source={backIcon} style={styles.backIcon} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowAll(!showAll)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {showAll ? "Show Top 3" : "View all students"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.headerContainer}>
        <Text style={styles.title}>Outstanding</Text>
        <Text style={styles.subtitle}>
          The more you learn, the higher you go!
        </Text>
        {selectedStudent && (
          <TouchableOpacity
            style={styles.topStudentContainer}
            onPress={() => handleStudentPress(selectedStudent)}
          >
            <View style={styles.squareProfileContainer}>
              <Image
                source={
                  selectedStudent.profileImage
                    ? { uri: selectedStudent.profileImage }
                    : defaultProfile
                }
                style={styles.squareProfileImage}
              />
            </View>
            <Text style={styles.topStudentName}>
              {selectedStudent.fullName}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, styles.centerText]}>Ranking</Text>
          <Text style={[styles.headerText, styles.centerText]}>Name</Text>
          <Text style={[styles.headerText, styles.centerText]}>Stars</Text>
        </View>

        <FlatList
          data={displayedStudents}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.tableRow}>
              <Text style={[styles.cell, styles.centerText]}>{index + 1}.</Text>
              <Text style={[styles.cell, styles.centerText]}>
                {item.fullName}
              </Text>
              <View
                style={[styles.cell, styles.centerText, styles.starContainer]}
              >
                <Image source={starIcon} style={styles.starIcon} />
                <Text style={styles.cell}>
                  {typeof item.stars === "object"
                    ? item.stars.totalStars || 0
                    : item.stars}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.noResults}>No students found.</Text>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={true}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2024 Husay. All Rights Reserved.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  element1: {
    position: "absolute",
    bottom: -180,
    left: -10,
    resizeMode: "contain",
  },
  element3: {
    position: "absolute",
    top: 400,
    left: -50,
    resizeMode: "contain",
  },
  element4: {
    position: "absolute",
    top: 200,
    right: -180,
    resizeMode: "contain",
  },
  element5: {
    position: "absolute",
    bottom: -40,
    right: 40,
    resizeMode: "contain",
  },
  element6: {
    position: "absolute",
    top: -70,
    left: 400,
    resizeMode: "contain",
  },
  backgroundElement: {
    position: "absolute",
    zIndex: -1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginVertical: 20,
    width: "90%",
  },
  centerText: {
    textAlign: "center",
    flex: 1,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  backText: {
    color: "#5A8EF4",
    fontSize: 16,
  },
  button: {
    width: "100%",
    maxWidth: 200,
    backgroundColor: "#5A8EF4",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 12,
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
  headerContainer: {
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 26,
  },
  subtitle: {
    fontSize: 20,
  },
  tableContainer: {
    width: "50%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#5A8EF4",
    paddingVertical: 10,
  },
  headerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  cell: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  starIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
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
