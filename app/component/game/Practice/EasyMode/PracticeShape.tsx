//PracticeShape.js
import React from 'react';
import { BaseGame } from '../../EasyBaseGame';
import shapeDialogues from "../../../../data/shapeDialogues";

const shaneIdleImg = require("../../../../../assets/shane/shane-guess.png");
const shaneCorrectImg = require("../../../../../assets/shane/shane-correct.png");
const shaneWrongImg = require("../../../../../assets/shane/shane-wrong.png");

const shapes = [
  { name: "Rectangle", image: require("../../../../../assets/shapes/rectangle.png") },
  { name: "Triangle", image: require("../../../../../assets/shapes/triangle.png") },
  { name: "Square", image: require("../../../../../assets/shapes/square.png") },
  { name: "Circle", image: require("../../../../../assets/shapes/circle.png") }
];

const ShapeGame = ({ onGameComplete, navigation }) => {
  return (
    <BaseGame
      items={shapes}
      onGameComplete={onGameComplete}
      navigation={navigation}
      npcConfig={{
        idle: shaneIdleImg,
        correct: shaneCorrectImg,
        wrong: shaneWrongImg,
        name: "Shane"
      }}
      dialogues={shapeDialogues}
    />
  );
};

export default ShapeGame;