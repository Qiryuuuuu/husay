// ChallMainScreen.js
import React, { useState, useEffect } from "react";
import { 
  View, Text, TouchableOpacity, Image, StyleSheet, 
  useWindowDimensions, ImageBackground 
} from "react-native";
import PregameDialog from "../../component/game/dialogBg";

/* Background images */
const bg1 = require("../../../assets/gameBackground/challenge-interface-bg.png");
const bg2 = require("../../../assets/gameBackground/challenge-interface-bg-2.webp");
const bgKids = require("../../../assets/gameBackground/challenge-interface-kids-bg.webp");
const mainBg = require("../../../assets/gameBackground/red.png");

/* Header images */
const challengeHeader = require("../../../assets/headerText/challenge-header.png");
const backButton = require("../../../assets/buttons/back.png");

/* Menu cards */
const easyCard = require("../../../assets/menuCards/challenge/challenge-easy.png");
const mediumCard = require("../../../assets/menuCards/challenge/challenge-medium.png");
const hardCard = require("../../../assets/menuCards/challenge/challenge-hard.png");

// Dialog data
const dialogData = {
  dialogues: [
    "Nyahahahaha! I have your friends, finally! One by one, I will delete their memories and all of the fun and joy you had will be gone, leaving them a lifeless piece of metal. If you want to rescue them, conquer my lair.",
    "Ohhh nooo! He got my friends...",
    "You can do it EVA!!!", 
    "Will you help me? I am hoping you will.",
    "First, we need to follow this forest path and cross the river. Then, we must pass through the forest to the Evil Inventor's Lair and hopefully we defeat the Evil Inventor."
  ],
  npcNames: ["Evil Inventor", "EVA", "Kids", "EVA", "EVA"],
  npcImages: [
    { image: require("../../../assets/inventor/inventor-laughing.png"), width: 600, height: 500 },
    { image: require("../../../assets/eva/eva-sad.png"), width: 344, height: 566 },
    { image: require("../../../assets/eva/eva-smile.png"), width: 0, height: 0 },
    { image: require("../../../assets/eva/eva-smile.png"), width: 344, height: 566 },
    { image: require("../../../assets/eva/eva-pointing.png"), width: 600, height: 500 },
  ],
  audioFiles: [
    require("../../../assets/voiceOver/inventor/challengeIntro/inventor-narrative-1.mp3"),
    require('../../../assets/voiceOver/eva/challengeIntro/eva-narrative-1.mp3'),
    require("../../../assets/voiceOver/misc/kids.mp3"),
    require("../../../assets/voiceOver/eva/challengeIntro/eva-narrative-2.mp3"),
    require('../../../assets/voiceOver/eva/challengeIntro/eva-narrative-3.mp3'),
  ],
};

export default function ChallMainScreen({ navigation }) {
  const [dialogIndex, setDialogIndex] = useState(0);
  const [showDialog, setShowDialog] = useState(true);
  const [currentBackground, setCurrentBackground] = useState(bg1);

  const getBackgroundForSpeaker = (npcName) => {
    switch (npcName) {
      case "Evil Inventor":
        return bg1;
      case "Kids":
        return bgKids;
      case "EVA":
        return bg2;
      default:
        return mainBg;
    }
  };

  useEffect(() => {
    if (showDialog) {
      const speaker = dialogData.npcNames[dialogIndex];
      setCurrentBackground(getBackgroundForSpeaker(speaker));
    } else {
      setCurrentBackground(mainBg);
    }
  }, [dialogIndex, showDialog]);

  const handleDialogNext = (index) => {
    const nextIndex = index + 1;
    setDialogIndex(nextIndex);
  };

  const handleDialogComplete = () => {
    setShowDialog(false);
    setCurrentBackground(mainBg);
  };

  return (
    <ImageBackground 
      source={currentBackground} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {showDialog ? (
          <PregameDialog
            dialogData={dialogData}
            onDialogComplete={handleDialogComplete}
            onDialogNext={handleDialogNext}
            currentDialogIndex={dialogIndex}
          />
        ) : (
          <>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Image source={backButton} style={styles.logo} />
              </TouchableOpacity>

              <View style={styles.titleContainer}>
                <Image source={challengeHeader} style={styles.studentImg} />
              </View>
            </View>

            {/* Main content */}
            <View style={styles.cardContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('ChallengeEasyInterface')}>
                <Image source={easyCard} style={styles.cards} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('ChallengeMedium')}>
                <Image source={mediumCard} style={styles.cards} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('ChallengeHard')}>
                <Image source={hardCard} style={styles.cards} />
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>© 2024 Husay. All Rights Reserved.</Text>
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
    left: "32%",  
    top: 30,
    transform: [{ translateX: -100 }], 
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 45,
    marginTop: 50,
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
  logo: {
    // Add dimensions if needed
  },
  studentImg: {
    // Add dimensions if needed
  },
  cards: {
    // Add dimensions if needed
  }
});
