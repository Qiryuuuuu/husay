import React, { useState } from "react";
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Text } from "react-native";

const { width, height } = Dimensions.get("window");

const backButton = require("../../../assets/Back.png");
const easyImg = require("../../../assets/Easy.png");
const mediumImg = require("../../../assets/Medium.png");
const hardImg = require("../../../assets/Hard.png");
const robotImg = require("../../../assets/Robot.png");
const robotImg2 = require("../../../assets/Robot2.png");

const shapes = {
  shape1: require("../../../assets/shape1.png"),
  shape2: require("../../../assets/shape2.png"),
  shape3: require("../../../assets/shape3.png"),
  shape4: require("../../../assets/shape4.png"),
  shape5: require("../../../assets/shape5.png"),
  countdown: require("../../../assets/countdown.png"),
  copyright: require("../../../assets/copyright.png"),
  selectDifficulty: require("../../../assets/selectdifficulty.png"),
};

const DifficultySelection = () => {
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const dialogues = [
    "Hi, I’m EVA, your trusted friendly guide here in Techtopia. Techtopia is a fun knowledge world. Here, we play under the sun and learn colors, shapes, and numbers along with other kids. Now, put on your thinking cats. Oops! Sorry, your thinking hats—and let’s check if you can get these questions right.",
    "Before we practice, let me give you these goodies. These are the tools you are going to use later. Now, are you ready? Let’s go kiddos!"
  ];

  const robotImgs = [robotImg, robotImg2];

  const handleOverlayPress = () => {
    if (dialogueIndex < dialogues.length - 1) {
      setDialogueIndex(dialogueIndex + 1);
    } else {
      setOverlayVisible(false);
    }
  };

  return (
    <View style={styles.container}>
    {overlayVisible && (
      <TouchableOpacity style={styles.overlay} onPress={handleOverlayPress}>
        <Image source={robotImgs[dialogueIndex % robotImgs.length]} style={styles.robotImg} />
        <View style={styles.dialogueBox}>
          <Text style={styles.dialogueText}>{dialogues[dialogueIndex]}</Text>
        </View>
      </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.backTouchable}>
        <Image source={backButton} style={styles.backButton} />
      </TouchableOpacity>
      <View style={styles.difficultyContainer}>
        <TouchableOpacity style={styles.option} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
          <Image source={easyImg} style={styles.image} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
          <Image source={mediumImg} style={styles.image} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
          <Image source={hardImg} style={styles.image} />
        </TouchableOpacity>
      </View>
      <View style={styles.decorations}>
        {Object.keys(shapes).map((key, index) => (
          <Image key={index} source={shapes[key]} style={[styles.absoluteShape, styles[key]]} />
        ))}
      </View>
    </View>
  );
};

export default function App() {
  return (
    <View style={styles.appContainer}>
      <DifficultySelection />
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  robotImg: {
    position: "absolute",
    top: 30,
    zIndex: 1,
    resizeMode: "contain",
  },

  dialogueBox: {
    width: "75%",
    padding: 50,
    top: '64%',
    position: "absolute",
    resizeMode: "contain",
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    backgroundColor: "#E1F1FF",
    zIndex: 10,
    borderRadius: 100,

    borderWidth: 10,
    borderColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 10 },
    shadowOpacity: 10,
    shadowRadius: 5,
    elevation: 10,

  },

  dialogueText: {
    fontSize: 20,
    color: "black",
    textAlign: "center",
  },

  difficultyContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "50%",
    height: "50%",
    position: "absolute",
    alignItems: "center",
  },

  option: {
    alignItems: "center",
    width: "50%",
    height: "75%",
  },

  image: {
    width: 450,
    height: 350,
    resizeMode: "contain",
    borderRadius: 15,
  },

  backTouchable: {
    position: "absolute",
    top: 25,
    left: 35,
    zIndex: 5,
  },

  backButton: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    zIndex: 3,
  },

  decorations: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  absoluteShape: {
    position: "absolute",
    resizeMode: "contain",
  },

  shape1: { position: 'absolute', top: 50, left: -360, width: 500, height: 500, zIndex: 2, resizeMode: 'contain' },
  shape2: { position: 'absolute', top: -120, right: 600, width: 250, height: 250, resizeMode: 'contain' },
  shape3: { position: 'absolute', bottom: 330, left: 1050, width: 500, height: 300, resizeMode: 'contain' },
  shape4: { position: 'absolute', top: 590, right: -25, width: 300, height: 300, resizeMode: 'contain' },
  shape5: { position: 'absolute', bottom: -45, left: 0, width: 250, height: 250, resizeMode: 'contain' },
  countdown: { position: 'absolute', top: -20, right: 90, width: 100, height: 140, resizeMode: 'contain' },
  copyright: { position: 'absolute', bottom: 20, alignSelf: "center", width: 250, height: 50, resizeMode: 'contain' },
  selectDifficulty: { position: 'absolute', top: 120, alignSelf: "center", width: 200, height: 100, resizeMode: "contain", zIndex: 2 },
});