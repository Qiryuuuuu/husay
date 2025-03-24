import React, { useEffect, useState } from "react";
import { BaseGame } from "../../EasyBaseGame";
import numberDialogues from "../../../../data/numberDialogues";

const amberIdleImg = require("../../../../../assets/amber/amber-guess.png");
const amberCorrectImg = require("../../../../../assets/amber/amber-correct.png");
const amberWrongImg = require("../../../../../assets/amber/amber-wrong.png");

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

const NumberGame = ({ onGameComplete, setGamePhase, navigation }) => {
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
      items={numbers}
      onGameComplete={finishGame}
      navigation={navigation}
      npcConfig={{
        idle: amberIdleImg,
        correct: amberCorrectImg,
        wrong: amberWrongImg,
        name: "Amber",
      }}
      dialogues={numberDialogues}
    />
  );
};

export default NumberGame;
