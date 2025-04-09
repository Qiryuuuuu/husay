import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform
} from "react-native";
import { Searchbar } from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome, Feather } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const API_URL =
  Platform.OS === "web"
    ? "http://localhost:5000/api/class/get-students"
    : "http://10.0.2.2:5000/api/class/get-students";
    
const logoImg = require("../../../assets/logo.png");
const defaultProfile = require("../../../assets/default-profile.png");

export default function StudentProfileScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const homeNavigation = useNavigation(); // Using useNavigation hook

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setStudents(response.data.students);
      } else {
        setStudents([]);
        Alert.alert("Error", "Failed to fetch students.");
      }
    } catch (error) {
      console.error("❌ Error fetching students:", error);
      Alert.alert("Error", "Could not fetch student data.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Corrected logic for filtering students
  const filteredStudents =
    students.length > 0
      ? students.filter((student) =>
          student.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text>Loading students...</Text>
      </View>
    );
  }

 
  return (
    <View style={styles.container}>
      {/* Header and Search Bar */}
      <View style={styles.headerContainer}>

        <View style={styles.headerContent}>
          <Image source={logoImg} style={styles.logo} />
          <View style={styles.headerTagline}>
            <Text style={styles.title}>Husay</Text>
            <Text style={styles.subtitle}>Hugis, Bilang, at Kulay, Aalalay!</Text>
          </View>
        </View>

        <View style={styles.textHeader}>
          <View style={styles.searchWrapper}>
            <Searchbar
              placeholder="Search students..."
              placeholderTextColor="#BDBDBD"
              style={styles.searchBar}
              inputStyle={styles.inputStyle}
              onChangeText={(text) => setSearchQuery(text)}
              value={searchQuery}
            />
          </View>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.shadow, styles.dashboard]}
        >
          <Feather
            name="menu"
            size={20}
            color="#5A8EF4"
            style={styles.buttonIcon}
          />
          <Text
            style={[styles.buttonText, styles.buttonTextDashboard]}
            onPress={() => navigation.navigate("Dashboard")}
          >
            View Dashboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.shadow]}
          onPress={() => navigation.navigate("AddStudent")}
        >
          <Feather
            name="plus-circle"
            size={20}
            color="#fff"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Add Students</Text>
        </TouchableOpacity>
      </View>

      {/* Student Cards */}
      {filteredStudents.length > 0 ? (
        <FlatList
          data={filteredStudents}
          keyExtractor={(item) => item._id.toString()}
          numColumns={4}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <TouchableOpacity
                style={styles.studentCard}
                onPress={() => {
                  console.log("Navigating to Home with studentId:", item._id); // Debugging
                  navigation.navigate("Home", {
                    studentName: item.fullName,
                    studentId: item._id,
                  });
                }}
              >
                <Image
                  source={
                    item.profileImage
                      ? { uri: item.profileImage }
                      : defaultProfile
                  }
                  style={styles.studentImg}
                />
                <Text style={styles.studentName}>{item.fullName}</Text>
              </TouchableOpacity>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.noStudentsText}>No students added yet</Text>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 16,
  },
  headerContainer: {
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 50,
    height: "100%",
    marginRight: 12,
  },
  headerTagline: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  textHeader: {
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  searchBar: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#FFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputStyle: {
    fontSize: 14,
  },
  filterIcon: {
    marginLeft: 12,
    padding: 8,
    backgroundColor: '#F0F4FF',
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#5A8EF4',
    width: '48%',
    justifyContent: 'center',
  },
  dashboard: {
    backgroundColor: '#F0F4FF',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  buttonTextDashboard: {
    color: '#5A8EF4',
  },
  shadow: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  grid: {
    paddingBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardWrapper: {
    width: '23%',
  },
  studentCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  studentImg: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
  },
  studentName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  noStudentsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 40,
  },
});