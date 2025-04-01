//PracticeMedium.tsx
import React, { useState, useEffect } from "react";
import { BaseMediumGame } from "../../MediumBaseGame";
import dialogues from "../../../../data/evaDialogues";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";

// Import NPC (character) assets
const evaIdleImg = require("../../../../../assets/eva/eva-guess.png");
const evaCorrectImg = require("../../../../../assets/eva/eva-correct.png");
const evaWrongImg = require("../../../../../assets/eva/eva-wrong.png");

// Define all the game objects
const shapes = [
  {
    name: "Rectangle",
    image: require("../../../../../assets/shapes/rectangle.png"),
  },
  {
    name: "Triangle",
    image: require("../../../../../assets/shapes/triangle.png"),
  },
  { name: "Square", image: require("../../../../../assets/shapes/square.png") },
  { name: "Circle", image: require("../../../../../assets/shapes/circle.png") },
];

const colors = [
  { name: "Red", image: require("../../../../../assets/color/red.png") },
  { name: "Yellow", image: require("../../../../../assets/color/yellow.png") },
  { name: "Green", image: require("../../../../../assets/color/green.png") },
  { name: "Blue", image: require("../../../../../assets/color/blue.png") },
  { name: "Gray", image: require("../../../../../assets/color/gray.png") },
  { name: "Black", image: require("../../../../../assets/color/black.png") },
  { name: "White", image: require("../../../../../assets/color/white.png") },
];

const numbers = [
  { name: "One", image: require("../../../../../assets/numbers/one.png") },
  { name: "Two", image: require("../../../../../assets/numbers/two.png") },
  { name: "Three", image: require("../../../../../assets/numbers/three.png") },
  { name: "Four", image: require("../../../../../assets/numbers/four.png") },
  { name: "Five", image: require("../../../../../assets/numbers/five.png") },
  { name: "Six", image: require("../../../../../assets/numbers/six.png") },
  { name: "Seven", image: require("../../../../../assets/numbers/seven.png") },
  { name: "Eight", image: require("../../../../../assets/numbers/eight.png") },
  { name: "Nine", image: require("../../../../../assets/numbers/nine.png") },
  { name: "Ten", image: require("../../../../../assets/numbers/ten.png") },
];

// Group all categories into one object
const categories = {
  shape: shapes,
  color: colors,
  number: numbers,
};

// NPC configuration
const npcConfig = {
  idle: evaIdleImg,
  correct: evaCorrectImg,
  wrong: evaWrongImg,
  name: "Eva",
};

interface PracticeMediumGameProps {
  onGameComplete: (score: number, time: number) => void;
  navigation: any;
}

const PracticeMediumGame = ({ onGameComplete, setGamePhase, navigation }) => {
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
    console.log("✅ Game Finished in PracticeMediumGame!");
    console.log("Time Taken:", timeTaken);
    console.log("Final Score Received:", score);

    onGameComplete(score, timeTaken); // ✅ Correct order
  };
  return (
    <BaseMediumGame
      categories={categories}
      onGameComplete={finishGame}
      navigation={navigation}
      npcConfig={npcConfig}
      dialogues={dialogues}
      numRounds={5} studentId={studentId}    />
  );
};

export default PracticeMediumGame;
