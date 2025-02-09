import React from "react";
import { View, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";

const { width, height } = Dimensions.get("window");

const backButton = require("./assets/Back.png");
const shapeImg = require("./assets/Shape.png");
const colorImg = require("./assets/Color.png");
const numberImg = require("./assets/Number.png");
const EasyFrameImg = require("./assets/EasyFrame.png");
const shapes = {
  ellipse5: require("./assets/Ellipse 5.png"),
  ellipse7: require("./assets/Ellipse 7.png"),
  rect10: require("./assets/Rectangle 10.png"),
  rect11: require("./assets/Rectangle 11.png"),
  rect12: require("./assets/Rectangle 12.png"),
  rect21: require("./assets/Rectangle 21.png"),
  rect23: require("./assets/Rectangle 23.png"),
  rect24: require("./assets/Rectangle 24.png"),
  rect25: require("./assets/Rectangle 25.png"),
  countdown: require("./assets/countdown.png"),
  copyright: require("./assets/copyright.png"),
};

const DifficultySelection = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backTouchable}>
        <Image source={backButton} style={styles.backButton} />
      </TouchableOpacity>
      <Image source={EasyFrameImg} style={styles.EasyFrame} />
      <View style={styles.difficultyContainer}>
        <TouchableOpacity style={styles.option} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
          <Image source={shapeImg} style={styles.image} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
          <Image source={colorImg} style={styles.image} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
          <Image source={numberImg} style={styles.image} />
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
  difficultyContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "70%",
    marginTop: 100,
  },
  option: {
    alignItems: "center",
    flex: 1,
  },
  image: {
    width: "95%",
    height: "85%",
    resizeMode: "contain",
    borderRadius: 15,
  },
  backTouchable: {
    position: "absolute",
    top: 25,
    left: 35,
    zIndex: 10,
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
  ellipse5: { top: 590, left: 100, width: 120, height: 150, zIndex: 2 },
  ellipse7: { top: 170, right: -70, width: 200, height: 245 },
  rect10: { bottom: 0, left: 1080, width: 200, height: 140 },
  rect11: { top: 90, right: 990, width: 500, height: 500 },
  rect12: { bottom: 310, left: 1, width: 110, height: 180 },
  rect21: { top: 650, left: 5, width: 140, height: 140 },
  rect23: { bottom: 655, right: 690, width: 130, height: 150 },
  rect24: { bottom: 45, right: 100, width: 140, height: 90 },
  rect25: { bottom: 670, right: 800, width: 100, height: 140 },
  countdown: { top: -20, right: 90, width: 100, height: 140 },
  copyright: { bottom: 20, alignSelf: "center", width: 200, height: 50 },
  EasyFrame: { top: 120, alignSelf: "center", width: 250, height: 100, resizeMode: "contain", zIndex: 2 },
});

