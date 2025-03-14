import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AccountSettingsScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [totalStudents, setTotalStudents] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  

  // ✅ Fetch User Data
  const fetchUser = async () => {
    try {
      console.log("🔍 Fetching user data...");
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("❌ No token found, user might be logged out.");
        setLoading(false);
        return;
      }
  
      const response = await fetch("http://10.0.2.2:5000/api/auth/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      const text = await response.text();
      console.log("🔹 Raw API Response: ", text);
  
      const data = JSON.parse(text);
      if (response.ok) {
        console.log("✅ User Data:", data);
        setFullName(data.fullName || "Unknown User");  // ✅ Ensure fullName is set
        setStudentId(data.employeeNo);
        fetchStudentCount(data.employeeNo);
      } else {
        console.error("❌ Server Error:", data.message);
      }
    } catch (error) {
      console.error("❌ Network error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // ✅ Fetch Student Count
  const fetchStudentCount = async (employeeNo) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      
      if (!token || !employeeNo) {
        console.error("❌ No token or employeeNo found.");
        return;
      }
  
      console.log("🔹 Using Token:", token); // ✅ Debugging Token
  
      const response = await fetch(`http://10.0.2.2:5000/api/students/count`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // ✅ Ensure "Bearer " is included
        },
      });
  
      const text = await response.text();
      console.log("🔹 Raw Student Count API Response:", text);
  
      try {
        const data = JSON.parse(text);
        if (response.ok) {
          setTotalStudents(data.count || 0);
        } else {
          console.error("❌ Error fetching student count:", data.message);
        }
      } catch (jsonError) {
        console.error("❌ JSON Parsing Error:", jsonError, "Response:", text);
      }
    } catch (error) {
      console.error("❌ Network error fetching students:", error);
    }
  };
  
  //✅ Update User Info
  const updateUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("❌ No token found, user might be logged out.");
        return;
      }
  
      // ✅ Fetch existing phoneNumber before sending update
      const userResponse = await fetch("http://10.0.2.2:5000/api/auth/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      const userData = await userResponse.json();
      const existingPhoneNumber = userData.phoneNumber || "";
  
      // ✅ Send fullName AND existing phoneNumber (if required)
      const response = await fetch("http://10.0.2.2:5000/api/auth/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName: newName, phoneNumber: existingPhoneNumber }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log("✅ User info updated:", data);
        setFullName(newName);
        setIsEditing(false);
        Alert.alert("Success", "User info updated successfully!");
      } else {
        console.error("❌ Error updating user:", data.message);
      }
    } catch (error) {
      console.error("❌ Network error updating user:", error);
    }
  };
  

  useEffect(() => {
    fetchUser();
  }, []);

  // ✅ Logout Functionality
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      Alert.alert("Logged Out", "You have been logged out.", [{ text: "OK", onPress: () => navigation.replace("Login") }]);
    } catch (error) {
      console.error("❌ Error logging out:", error);
    }
  };
  


  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {/* Left Sidebar */}
          <View style={styles.sidebar}>
            <TouchableOpacity onPress={() => navigation.navigate("StudentProfile")}>
              <Image 
                style={styles.backButton}
                source={require('../../../assets/dashboard/Back.png')} 
              />
            </TouchableOpacity>
  
            {/* Sidebar Menu Options */}
            <View style={styles.sidebarMenu}>
              <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
                <Image 
                  style={styles.menuButton}
                  source={require('../../../assets/dashboard/Dashboard.png')} 
                />
              </TouchableOpacity>
  
              <TouchableOpacity>
                <Image 
                  style={styles.menuButton}
                  source={require('../../../assets/dashboard/account-setting.png')} 
                />
              </TouchableOpacity>
            </View>
  
            {/* Logout Button */}
            <TouchableOpacity onPress={handleLogout}>
              <Image 
                style={styles.logoutButton}
                source={require('../../../assets/dashboard/Logout.png')} 
              />
            </TouchableOpacity>
          </View>
  
          {/* Main Content */}
          <View style={styles.mainContent}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Image 
                  source={require('../../../assets/dashboard/Husay.png')} 
                />
              </View>
  
              <View style={styles.userContainer}>
                <Text style={styles.greeting}>Hello, {fullName}!</Text>
                <Image 
                  source={require('../../../assets/default-profile.png')} 
                  style={styles.profilePic} 
                />
              </View>
            </View>
  
            {/* Account Settings Content */}
            <View style={styles.settingsContainer}>
              <View style={styles.settingsHeader}>
                <View style={styles.profileSection}>
                  <Image 
                    source={require('../../../assets/default-profile.png')} 
                    style={styles.largeProfilePic} 
                  />
                  
                  <View style={styles.profileInfo}>
                    <View style={styles.infoRow}>
                      <Image 
                        source={require('../../../assets/dashboard/user-icon.png')} 
                        style={styles.infoIcon} 
                      />
                      {isEditing ? (
                        <TextInput
                          style={styles.input}
                          value={newName}
                          onChangeText={setNewName}
                          placeholder="Enter new name"
                        />
                      ) : (
                        <Text style={styles.nameText}>{fullName}</Text>
                      )}
                    </View>
                    
                    <View style={styles.infoRow}>
                      <Image 
                        source={require('../../../assets/dashboard/IDNumber.png')} 
                        style={styles.infoIcon} 
                      />
                      <Text style={styles.idText}>{studentId}</Text>
                    </View>
                  </View>
                </View>
  
                <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(!isEditing)}>
                  <Image 
                    source={require('../../../assets/dashboard/Edit.png')} 
                  />
                </TouchableOpacity>
              </View>
  
              {/* Save Button (Only Shows When Editing) */}
              {isEditing && (
                <View style={styles.buttonRow}>
                  <TouchableOpacity onPress={updateUserInfo} style={styles.saveButton}>
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.cancelButton}>
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}
  
              {/* Student Stats */}
              <View style={styles.statsCard}>
                <View style={styles.statsHeader}>
                  <Image 
                    source={require('../../../assets/dashboard/people.png')} 
                    style={styles.statsIcon} 
                  />
                  <Text style={styles.statsTitle}>Total Number of Students</Text>
                </View>
                <View style={styles.statsContent}>
                  <Text style={styles.statsNumber}>{totalStudents}</Text>
                  <Text style={styles.statsLabel}>Students</Text>
                </View>
              </View>
            </View>
  
            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.copyright}>© 2024 Husay. All Rights Reserved.</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
  },
  sidebar: {
    width: 300,
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRightWidth: 1,
    borderRightColor: '#E5E5EA',
    justifyContent: 'space-between',
    height: '100%',
  },
  sidebarMenu: {
    flex: 1,
    marginTop: 45,
    marginLeft: 15,
  },
  backButton: {
    marginTop: 45,
    marginLeft: 15,
  },
  menuButton: {
    width: 250,
    height: 65,
    resizeMode: "contain",
  },
  logoutButton: {
    marginLeft: 15,
    marginBottom: 25,
  },
  mainContent: {
    flex: 1,
    padding: 45,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
 
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 20,
    fontWeight: '500',
    marginRight: 10,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  settingsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
    width: '100%',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  largeProfilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginRight: 30,
  },
  profileInfo: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  nameText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E1E1E',
  },
  idText: {
    fontSize: 20,
    color: '#666666',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginLeft: 15,
  },
  editIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    tintColor: '#FFFFFF',
  },
  statsCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    padding: 25,
    marginTop: 20,
    maxWidth: 300,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  statsIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E1E1E',
    opacity: 0.8,
  },
  statsContent: {
    marginTop: 8,
  },
  statsNumber: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1E1E1E',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 16,
    color: '#6B7280',
    opacity: 0.8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingVertical: 20,
  },
  copyright: {
    fontSize: 12,
    color: '#1E1E1E',
  },
});