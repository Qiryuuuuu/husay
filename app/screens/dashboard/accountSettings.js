import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  useWindowDimensions 
} from "react-native";

export default function AccountSettingsScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const [fullName, setFullName] = useState("Jastine");
  
  return(
        <View style={styles.container}>
            {/* Left Sidebar */}
            <View style={styles.sidebar}>
                <TouchableOpacity onPress={() => navigation.navigate("StudentProfile")}>
                <Image style={styles.backButton}
                    source={require('../../../assets/dashboard/Back.png')} 
                />
                </TouchableOpacity>
        
                {/* Sidebar Menu Options */}
                <View style={styles.sidebarMenu}>
                <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
                    <Image style={styles.studentButton}
                    source={require('../../../assets/dashboard/Dashboard.png')} 
                    />
                </TouchableOpacity>
        
                <TouchableOpacity >
                    <Image style={styles.accountButton}
                    source={require('../../../assets/dashboard/account-setting.png')} 
                    />
                </TouchableOpacity>
                </View>
        
                {/* Logout Button */}
                <TouchableOpacity >
                <Image style={styles.logoutButton}
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
                            style={styles.logo} 
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

              {/* Footer */}
                 <View style={styles.footer}>
                    <Text style={styles.copyright}>© 2024 Husay. All Rights Reserved.</Text>
                </View>
            </View>
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
  
    studentButton:{
      width: 250,
      height: 65, 
      resizeMode: "contain", 
    },
  
    accountButton:{
      width: 250,
      height: 65,  
      resizeMode: "contain", 
    },
  
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 'auto',
      marginBottom: 25,
      marginLeft: 15,
    },
    
    mainContent: {
      flex: 1,
      padding: 45,
    },
    
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    
    logoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 35,
    },
    
    userContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 35,
    },

    greeting: {
      fontSize: 20,
      fontWeight: '500',
      marginRight: 10,
    },

    profilePic: {
      width: 50,
      height: 50,
      borderRadius: 30,
      backgroundColor: '#007AFF',
    },

    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: "center",
        paddingVertical: 50,
    },
    
    copyright: {
      fontSize: 12,
      color: '#1E1E1E',
    },
});