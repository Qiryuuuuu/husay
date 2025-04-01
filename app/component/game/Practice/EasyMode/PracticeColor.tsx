import React, { useState, useEffect } from "react";
import { BaseGame } from "../../EasyBaseGame";
import colorDialogues from "../../../../data/colorDialogues";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";

const dolorIdleImg = require("../../../../../assets/dolor/dolor-guess.png");
const dolorCorrectImg = require("../../../../../assets/dolor/dolor-correct.png");
const dolorWrongImg = require("../../../../../assets/dolor/dolor-wrong.png");

const colors = [
  { name: "Red", image: require("../../../../../assets/color/red.png") },
  { name: "Yellow", image: require("../../../../../assets/color/yellow.png") },
  { name: "Green", image: require("../../../../../assets/color/green.png") },
  { name: "Blue", image: require("../../../../../assets/color/blue.png") },
  { name: "Gray", image: require("../../../../../assets/color/gray.png") },
  { name: "Black", image: require("../../../../../assets/color/black.png") },
  { name: "White", image: require("../../../../../assets/color/white.png") },
];

const ColorGame = ({ onGameComplete, setGamePhase, navigation }) => {
 const route = useRoute();
   const { studentId } = route.params as { studentId: string }; // Get studentId from navigation params
   const [startTime, setStartTime] = useState(Date.now());
 
   useEffect(() => {
     setStartTime(Date.now()); // Start tracking time when game starts
 
     if (!studentId) {
       console.error("❌ ERROR: Missing studentId from navigation params!");
     }
   }, [studentId]);

  const finishGame = (score, timeTaken) => {
    console.log("✅ Game Finished in ColorGame!");
    console.log("Time Taken:", timeTaken);
    console.log("Final Score Received:", score);

    onGameComplete(score, timeTaken); // ✅ Correct order
  };

  return (
    <BaseGame
      items={colors}
      onGameComplete={finishGame}
      navigation={navigation}
      npcConfig={{
        idle: dolorIdleImg,
        correct: dolorCorrectImg,
        wrong: dolorWrongImg,
        name: "Dolor",
      }}
      dialogues={colorDialogues} studentId={studentId}    />
  );
};

export default ColorGame;
