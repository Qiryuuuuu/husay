import React from 'react';
import { BaseGame } from '../../EasyBaseGame';
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

const NumberGame = ({ onGameComplete, navigation }) => {
  return (
    <BaseGame
      items={numbers}
      onGameComplete={onGameComplete}
      navigation={navigation}
      npcConfig={{
        idle: amberIdleImg,
        correct: amberCorrectImg,
        wrong: amberWrongImg,
        name: "Amber"
      }}
      dialogues={numberDialogues}
      />
  );
};

export default NumberGame;