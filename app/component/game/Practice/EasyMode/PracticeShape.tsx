//PracticeShape.js
import React, { useEffect, useState } from "react";
import { BaseGame } from "../../EasyBaseGame";
import shapeDialogues from "../../../../data/shapeDialogues";

const shaneIdleImg = require("../../../../../assets/shane/shane-guess.png");
const shaneCorrectImg = require("../../../../../assets/shane/shane-correct.png");
const shaneWrongImg = require("../../../../../assets/shane/shane-wrong.png");

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

const ShapeGame = ({ onGameComplete, setGamePhase, navigation }) => {
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    setStartTime(Date.now()); // Start tracking time when game starts
  }, []);

  const finishGame = (score, timeTaken) => {
    console.log("✅ Game Finished in ColorGame!");
    console.log("Time Taken:", timeTaken);
    console.log("Final Score Received:", score);

    onGameComplete(score, timeTaken, setGamePhase); // ✅ Correct order
  };
  return (
    <BaseGame
      items={shapes}
      onGameComplete={finishGame}
      navigation={navigation}
      npcConfig={{
        idle: shaneIdleImg,
        correct: shaneCorrectImg,
        wrong: shaneWrongImg,
        name: "Shane",
      }}
      dialogues={shapeDialogues}
    />
  );
};

export default ShapeGame;
