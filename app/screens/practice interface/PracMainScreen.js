//PracMainScreen.js
import React, { useState, useEffect } from "react";
import { 
  View, Text, TouchableOpacity, Image, StyleSheet, Modal, 
  useWindowDimensions, ImageBackground 
} from "react-native";
import PregameDialog from "../../component/game/PregameDialog";
import { playMusic, stopMusic } from "../../component/audio/MusicManager";

import { useNavigation } from "@react-navigation/native";

/* Background image */
const bgImg = require("../../../assets/gameBackground/yellow.png");
/* Header images */
const practiceHeader = require("../../../assets/headerText/practice-header.png");
const backButton = require("../../../assets/buttons/back.png");
/* Menu cards */
const easyCard = require("../../../assets/menuCards/practice/practice-easy.png");
const mediumCard = require("../../../assets/menuCards/practice/practice-medium.png");
const hardCard = require("../../../assets/menuCards/practice/practice-hard.png");

// Dialog data
const dialogData = {
  dialogues: [
    "Hi, I'm EVA, your trusted friendly guide here in Techtopia. Techtopia is a fun knowledge world. Here, we play under the sun and learn colors, shapes, and numbers along with other kids. Now, put on your thinking cats. Oops! Sorry, your thinking hats—and let's check if you can get these questions right.",
    "Before we practice, let me give you these goodies. These are the tools you are going to use later.",
    "Now, are you ready? Let's go kiddos!",
  ],
  npcNames: ["EVA", "EVA", "EVA"],
  npcImages: [
    {
      image: require("../../../assets/eva/eva-happy.png"),
      width: 450,
      height: 450,
    },
    {
      image: require("../../../assets/eva/eva-present.png"),
      width: 663,
      height: 455,
    },
    {
      image: require("../../../assets/eva/eva-pointing.png"),
      width: 600,
      height: 500,
    },
  ],
  audioFiles: [
    require("../../../assets/voiceOver/eva/practiceIntro/eva-narrative-1.mp3"),
    require("../../../assets/voiceOver/eva/practiceIntro/eva-narrative-2.mp3"),
    require("../../../assets/voiceOver/eva/practiceIntro/eva-narrative-3.mp3"),
  ],
};

export default function PracMainScreen({ route }) {
  const { width, height } = useWindowDimensions();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [showDialog, setShowDialog] = useState(true);
  const navigation = useNavigation();
  const { studentId } = route.params || {}; // Get studentName from params

  const handleDialogComplete = () => {
    setShowDialog(false);
  };

  useEffect(() => {
    playMusic("gameInterfaceBg");
    return () => stopMusic();
  }, []);

  return (
    <ImageBackground source={bgImg} style={styles.backgroundImage}>
      <View style={styles.container}>
        {showDialog ? (
          <PregameDialog
            dialogData={dialogData}
            onDialogComplete={handleDialogComplete}
          />
        ) : (
          <>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => navigation.navigate("Home", { studentId })}
              >
                <Image source={backButton} style={styles.logo} />
              </TouchableOpacity>

              <View style={styles.titleContainer}>
                <Image source={practiceHeader} style={styles.studentImg} />
              </View>
            </View>

            {/* Main content */}
            <View style={styles.cardContainer}>
              <TouchableOpacity
                onPress={() => 
                  navigation.navigate("EasyMenuInteface", { studentId })
                }
              >
                <Image source={easyCard} style={styles.cards} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("PracticeMedium", { studentId })
                }
              >
                <Image source={mediumCard} style={styles.cards} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("PracticeHard", { studentId })
                }
              >
                <Image source={hardCard} style={styles.cards} />
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                © 2024 Husay. All Rights Reserved.
              </Text>
            </View>
          </>
        )}
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
    left: "37%",
    top: 30,
    transform: [{ translateX: -100 }],
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
