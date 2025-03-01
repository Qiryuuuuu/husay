import React, { useState } from "react";
import { 
  View, Text, TouchableOpacity, Image, StyleSheet, Modal, 
  useWindowDimensions, ImageBackground 
} from "react-native";

/* Background image */
const bgImg = require("../../../assets/gameBackground/yellow.png");
/* Header images */
const practiceHeader = require("../../../assets/headerText/practice-header.png");
const backButton = require("../../../assets/buttons/back.png");
/* Menu cards */
const easyCard = require("../../../assets/menuCards/practice/practice-easy.png");
const mediumCard = require("../../../assets/menuCards/practice/practice-medium.png");
const hardCard = require("../../../assets/menuCards/practice/practice-hard.png");


export default function PracMainScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const [settingsVisible, setSettingsVisible] = useState(false);

  return (
    <ImageBackground source={bgImg} style={styles.backgroundImage}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
         <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Image source={backButton} style={styles.logo} />
         </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Image source={practiceHeader} style={styles.studentImg} />
          </View>

        </View>

        {/* Main content */}
        <View style={styles.cardContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('EasyMenuInteface')}>
            <Image source={easyCard} style={styles.cards} />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image source={mediumCard} style={styles.cards} />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image source={hardCard} style={styles.cards} />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2024 Husay. All Rights Reserved.</Text>
        </View>


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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start", // Align the back button to the left
    paddingHorizontal: 50,
    paddingVertical: 30,
    width: "100%",
  },
  titleContainer: {
    position: "absolute",
    left: "40%",  
    top: 30,
    transform: [{ translateX: -100 }], // Offset by half of its width (adjust accordingly)
  },

  /* Main Content */
  cardContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 45,
    marginTop: 70,
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

