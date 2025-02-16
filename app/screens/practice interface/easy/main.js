import React from "react";
import { View, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";

const { width, height } = Dimensions.get("window");

const backButton = require("../../../../assets/Back.png");
const shapeImg = require("../../../../assets/Shape.png");
const colorImg = require("../../../../assets/Color.png");
const numberImg = require("../../../../assets/Number.png");
const EasyFrameImg = require("../../../../assets/EasyFrame.png");

const shapes = {
  shape1: require("../../../../assets/shape1.png"),
  shape2: require("../../../../assets/shape2.png"),
  shape3: require("../../../../assets/shape3.png"),
  shape4: require("../../../../assets/shape4.png"),
  shape5: require("../../../../assets/shape5.png"),
  countdown: require("../../../../assets/countdown.png"),
  copyright: require("../../../../assets/copyright.png"),
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
    flex: 1, // ✅ Allow container to fill screen naturally
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  difficultyContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "50%", // ✅ Full width
    height: "50%",
    position: "absolute", // ✅ Position it explicitly
    alignItems: "center",
  },

  option: {
    alignItems: "center",
    width: "50%", // ✅ Explicit width
    height: "75%", // ✅ Explicit height
  },

  image: {
    width: 450, // ✅ Explicit size to be visible
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
    zIndex: 5,
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
  EasyFrame: { position: 'absolute', top: 100, alignSelf: "center", width: 250, height: 150, resizeMode: "contain", zIndex: 2 },

});

