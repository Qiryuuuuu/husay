import React, { useState, useEffect } from "react";
import { BaseGame } from "../../EasyBaseGame";
import colorDialogues from "../../../../data/colorDialogues";

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

const ColorGame = ({ onGameComplete, navigation }) => {
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    setStartTime(Date.now()); // Start tracking time when game starts
  }, []);

  const finishGame = (finalScore) => {
    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - startTime) / 1000); // Convert ms to seconds

    console.log("Game finished! Submitting score...");
    console.log("Time Taken:", timeTaken, "Score:", finalScore);

    onGameComplete(timeTaken, finalScore); // ✅ Use score from BaseGame
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
      dialogues={colorDialogues}
    />
  );
};

export default ColorGame;
