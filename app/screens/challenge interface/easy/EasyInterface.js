import React, { useState } from "react";
import { 
  View, Text, TouchableOpacity, Image, StyleSheet, Modal, 
  useWindowDimensions, ImageBackground 
} from "react-native";

/* Background image */
const bgImg = require("../../../../assets/gameBackground/green.png");
/* Header images */
const practiceHeader = require("../../../../assets/headerText/challenge-easy-header.png");
const backButton = require("../../../../assets/buttons/back.png");
/* Menu cards */
const shapeCard = require("../../../../assets/menuCards/challenge/easy/shape-easy.png");
const colorCard = require("../../../../assets/menuCards/challenge/easy/color-easy.png");
const numberCard = require("../../../../assets/menuCards/challenge/easy/number-easy.png");


export default function EasyInterface({ navigation }) {
  const { width, height } = useWindowDimensions();
  const [settingsVisible, setSettingsVisible] = useState(false);

  return (
    <ImageBackground source={bgImg} style={styles.backgroundImage}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
         <TouchableOpacity onPress={() => navigation.navigate('ChallMainScreen')}>
            <Image source={backButton} style={styles.logo} />
         </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Image source={practiceHeader} style={styles.studentImg} />
          </View>

        </View>

        {/* Main content */}
        <View style={styles.cardContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('ChallengeShape')}>
            <Image source={shapeCard} style={styles.cards} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('ChallengeColor')}>
            <Image source={colorCard} style={styles.cards} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('ChallengeNumber')}>
            <Image source={numberCard} style={styles.cards} />
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
    justifyContent: "flex-start", 
    paddingHorizontal: 50,
    paddingVertical: 30,
    width: "100%",
  },
  titleContainer: {
    position: "absolute",
    left: "44%",  
    top: 15,
    transform: [{ translateX: -100 }], 
  },

  /* Main Content */
  cardContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 50,
    marginTop: 80,
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