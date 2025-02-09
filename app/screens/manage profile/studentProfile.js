import React, { useState } from "react";
import { 
  View, Text, Image, StyleSheet, useWindowDimensions, TouchableOpacity, Alert 
} from "react-native";
import { Searchbar } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

const logoImg = require("../../../assets/logo.png");
const defaultProfile = require("../../../assets/default-profile.png");

export default function StudentProfileScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const [profileImage, setProfileImage] = useState(null);

  // Function to handle image selection
  const selectImage = async () => {
    // Request permission to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission Denied", "You need to allow access to your photos.");
      return;
    }

    // Open the gallery
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Crop to a square
      quality: 1,
    });

    console.log("Image Picker Result:", result); // Debugging

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
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
          />
        </View>

        {/* Clickable Profile Image */}
        <TouchableOpacity onPress={selectImage} style={styles.profileImgContainer}>
          <Image source={profileImage ? { uri: profileImage } : defaultProfile} style={styles.profileImg} />
          <Text style={styles.changeText}>Tap to change</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.shadow, styles.dashboard]}>
          <Text style={[styles.buttonText, styles.buttonTextDashboard]}>View Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.shadow]}>
          <Text style={styles.buttonText}>Add Students</Text>
        </TouchableOpacity>
      </View>
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
    marginTop: 25,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  logo: {
    width: 45,
    height: 45,
    resizeMode: "contain",
  },
  textHeader: {
    alignItems: "center",
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
  },
  searchBar: {
    padding: 0,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: "white",
    borderWidth: 0.5,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    textAlignVertical: "center",
    maxWidth: 400,
  },
  inputStyle: {
    fontSize: 14,
    textAlignVertical: "center",
    paddingVertical: 0,
    lineHeight: 40,
  },
  profileImgContainer: {
    alignItems: "center",
  },
  profileImg: {
    width:60,
    height:60,
    borderRadius: 35, 
    borderWidth: 2,
    borderColor: "#ddd",
  },
  changeText: {
    marginTop: 5,
    fontSize: 12,
    color: "#007BFF",
  },
  buttonContainer:{
    flexDirection: "row",
    justifyContent: "center",
    gap: 10
  },
  button: {
    width: "100%",
    maxWidth: 150,
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
    fontSize: 14,
    fontWeight: "bold",
  },
  dashboard:{
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#5A8EF4"
  },
  buttonTextDashboard:{
    color: "black"
  }
});
