import React from 'react';
import { BaseGame } from '../../EasyBaseGame';
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
  { name: "White", image: require("../../../../../assets/color/white.png") }
];

const ColorGame = ({ onGameComplete, navigation }) => {
  return (
    <BaseGame
    items={colors}
    onGameComplete={onGameComplete}
    navigation={navigation}
    npcConfig={{
        idle: dolorIdleImg,
        correct: dolorCorrectImg,
        wrong: dolorWrongImg,
        name: "Dolor"
    }}
    dialogues={colorDialogues}
    />
  );
};

export default ColorGame;