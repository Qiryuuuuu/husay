//ChallengeColor.tsx
import React from 'react';
import { BaseGame } from '../../ChallBaseGame';

const evaIdleImg = require("../../../../../assets/eva/eva-guess.png");
const evaCorrectImg = require("../../../../../assets/eva/eva-correct.png");
const evaWrongImg = require("../../../../../assets/eva/eva-wrong.png");

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

const challengeDialogues = {
  idle: [
    "Now where should I begin?", // First question
    "Which stone should I pick next?", // Second question
    "Which stone should I pick next?", // Third question
    "Which stone should I pick next?", // Fourth question
    "Yeyyy, I think we’re almost at the edge of the river. Help me one last time, will you? Which is it?"  // Fifth question
  ],
  correct: [
    "Gee, thanks for helping me find a good stone to stand on to."
  ],
  wrong: [
    "I’m not sure I can stand there."
  ]
};

const ShapeGame = ({ onGameComplete, navigation, onStateChange  }) => {
  return (
    <BaseGame
      items={numbers}
      onGameComplete={onGameComplete}
      navigation={navigation}
      npcConfig={{
        idle: evaIdleImg,
        correct: evaCorrectImg,
        wrong: evaWrongImg,
        name: "Eva"
      }}
      dialogues={challengeDialogues}
      onStateChange={onStateChange}
    />
  );
};

export default ShapeGame;
