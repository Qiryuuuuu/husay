import React, { useState, useEffect } from "react";
import { 
  View, Text, FlatList, Image, StyleSheet, 
  useWindowDimensions, TouchableOpacity, Alert, ActivityIndicator 
} from "react-native";
import { Searchbar } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native"; 
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome, Feather } from "@expo/vector-icons";

const API_URL = "http://10.0.2.2:5000/api/class/get-students";

const logoImg = require("../../../assets/logo.png");
const defaultProfile = require("../../../assets/default-profile.png");

export default function StudentProfileScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

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
        Alert.alert("Error", "Failed to fetch students.");
      }
    } catch (error) {
      console.error("❌ Error fetching students:", error);
      Alert.alert("Error", "Could not fetch student data.");
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Image source={logoImg} style={styles.logo} />
        <View style={styles.textHeader}>
          <Text style={styles.title}>Husay</Text>
          <Text style={styles.subtitle}>Hugis, Bilang, at Kulay, Aalalay!</Text>
          <View style={styles.searchWrapper}>
            <Searchbar
              placeholder="Search students..."
              placeholderTextColor="#BDBDBD"
              style={styles.searchBar}
              inputStyle={styles.inputStyle}
              onChangeText={(text) => setSearchQuery(text)}
              value={searchQuery}
            />
            <Feather name="filter" size={24} color="#5A8EF4" style={styles.filterIcon} />
          </View>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.shadow, styles.dashboard]}>
          <Feather name="menu" size={20} color="#5A8EF4" style={styles.buttonIcon} />
          <Text style={[styles.buttonText, styles.buttonTextDashboard]}>View Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.shadow]} 
          onPress={() => navigation.navigate("AddStudent")}
        >
          <Feather name="plus-circle" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Add Students</Text>
        </TouchableOpacity>
      </View>

      {/* Student Cards */}
      <FlatList
        data={filteredStudents} 
        keyExtractor={(item) => item._id.toString()}
        numColumns={4}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <View style={styles.studentCard}>
              <Image source={item.profileImage ? { uri: item.profileImage } : defaultProfile} style={styles.studentImg} />
              <Text style={styles.studentName}>{item.fullName}</Text>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 30,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    width: "100%",
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: "contain",
    marginRight: 20,
  },
  textHeader: {
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchBar: {
    borderRadius: 50,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#5A8EF4",
    height: 45,
    width: "90%",
    maxWidth: 400,
  },
  filterIcon: {
    marginLeft: -35,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 15,
    gap: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#428bca",
    width: 180,
    backgroundColor: "blue",
  },
  dashboard: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#5A8EF4",
  },
  buttonTextDashboard: {
    color: "#5A8EF4",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonIcon: {
    marginRight: 8,
  },
  grid: {
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  row: {
    flex: 1,
    justifyContent: "space-between",
  },
  cardWrapper: {
    flex: 1,
    alignItems: "center",
    margin: 10,
  },
  studentCard: {
    width: 150,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  studentImg: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginBottom: 10,
  },
  studentName: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
  },
});
