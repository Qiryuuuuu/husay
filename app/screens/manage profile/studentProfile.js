import React, { useState } from "react";
import { 
  View, Text, FlatList, Image, StyleSheet, useWindowDimensions, TouchableOpacity, Alert 
} from "react-native";
import { Searchbar } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import StudentCard from "../../component/studentCard";

const logoImg = require("../../../assets/logo.png");
const defaultProfile = require("../../../assets/default-profile.png");

export default function StudentProfileScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const students = [
    { id: 1, name: "Superman", stars: 15 },
    { id: 2, name: "Batman", stars: 17 },
    { id: 3, name: "Wonder Woman", stars: 13 },
    { id: 4, name: "Flash", stars: 12 },
    { id: 5, name: "Aquaman", stars: 11 },
    { id: 6, name: "Green Lantern", stars: 10 },
    { id: 7, name: "Thor", stars: 9 },
    { id: 8, name: "Iron Man", stars: 8 },
    { id: 9, name: "Hulk", stars: 7 },
    { id: 10, name: "Black Panther", stars: 6 },
    { id: 11, name: "Captain America", stars: 5 },
    { id: 12, name: "Doctor Strange", stars: 4 },
    { id: 13, name: "Spider-Man", stars: 3 },
    { id: 14, name: "Black Widow", stars: 2 },
    { id: 15, name: "Scarlet Witch", stars: 1 }
  ];

  // Function to handle image selection
  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "You need to allow access to your photos.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Centered Header */}
      <View style={styles.headerContainer}>
        <Image source={logoImg} style={styles.logo} />
        <View style={styles.textHeader}>
          <Text style={styles.title}>Husay</Text>
          <Text style={styles.subtitle}>Hugis, Bilang, at Kulay, Aalalay!</Text>
          <Searchbar
            placeholder="Search students..."
            placeholderTextColor="#BDBDBD"
            style={styles.searchBar}
            inputStyle={styles.inputStyle}
            onChangeText={(text) => setSearchQuery(text)} // 🔹 Ensures search query updates
            value={searchQuery}
          />
        </View>
        <TouchableOpacity onPress={selectImage} style={styles.profileImgContainer}>
          <Image source={profileImage ? { uri: profileImage } : defaultProfile} style={styles.profileImg} />
          <Text style={styles.changeText}>Tap to change</Text>
        </TouchableOpacity>
      </View>

      {/* Centered Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.shadow, styles.dashboard]}>
          <Text style={[styles.buttonText, styles.buttonTextDashboard]}>View Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.shadow]} onPress={() => navigation.navigate("AddStudent")}>
          <Text style={styles.buttonText}>Add Students</Text>
        </TouchableOpacity>
      </View>

      {filteredStudents.length === 0 ? (
        <Text style={styles.noResults}>No students found. Try searching with a different name.</Text>
      ) : (
        <FlatList
          data={filteredStudents} 
          keyExtractor={(item) => item.id}
          numColumns={5}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <StudentCard 
                student={item} 
                onPress={() => navigation.navigate("Home", { student: item })} 
              />
            </View>
          )}
          showsVerticalScrollIndicator={false} 
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 100, 
    paddingTop: 20,
    width: "100%",
  },
  logo: {
    width: 65,
    height: 65,
    resizeMode: "contain",
  },
  textHeader: {
    alignItems: "center",
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "black",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  searchBar: {
    borderRadius: 10,
    backgroundColor: "white",
    borderWidth: 0.5,
    height: 45,
    width: "90%",
    maxWidth: 400,
  },
  inputStyle: {
    fontSize: 14,
  },
  profileImgContainer: {
    alignItems: "center",
  },
  profileImg: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  changeText: {
    fontSize: 12,
    color: "#007BFF",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    gap: 10,
  },
  button: {
    width: 180,
    backgroundColor: "#5A8EF4",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
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
    fontSize: 14,
    fontWeight: "bold",
  },
  dashboard: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#5A8EF4",
  },
  buttonTextDashboard: {
    color: "black",
  },
  grid: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1
  },
  row: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  cardWrapper: {
    flex: 1,
    alignItems: "center",
  },
  noResults: {
    textAlign: "center",
    fontSize: 18,
    color: "#888",
    marginTop: 50,
  },
});
