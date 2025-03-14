import React, { useState } from "react";
import { 
  View, Text, TouchableOpacity, Image, StyleSheet, 
  useWindowDimensions, ImageBackground 
} from "react-native";
import SettingsModal from "../../component/setting"; 

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


export default function HomeScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const [settingsVisible, setSettingsVisible] = useState(false);

  return (
    <ImageBackground source={bgImg} style={styles.backgroundImage}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={logoImg} style={styles.logo} />
          
          <View style={styles.studentInfo}>
            <Image source={studentImg} style={styles.studentImg} />
            <Text style={styles.studentName}>Student Name</Text>
          </View>

          <TouchableOpacity onPress={() => setSettingsVisible(true)}>
            <Image source={settingIcon} style={styles.settingImg} />
          </TouchableOpacity>
        </View>

        {/* Main content */}
        <View style={styles.cardContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Class')}>
            <Image source={classCard} style={styles.cards} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('PracMainScreen')}>
            <Image source={practiceCard} style={styles.cards} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('ChallMainScreen')}>
            <Image source={challengeCard} style={styles.cards} />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2024 Husay. All Rights Reserved.</Text>
        </View>

        {/* Use SettingsModal Component */}
        <SettingsModal 
          visible={settingsVisible} 
          onClose={() => setSettingsVisible(false)}
          headerImage={settingHeader}
          buttonOneText="Switch Profile"
          buttonTwoText="Logout"
          onButtonOnePress={() => console.log("Switching Profile...")}
          onButtonTwoPress={() => console.log("Logging Out...")}
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
