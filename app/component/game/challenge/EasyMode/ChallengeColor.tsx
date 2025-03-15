//ChallengeColor.tsx
import React from 'react';
import { BaseGame } from '../../ChallBaseGame';

const evaIdleImg = require("../../../../../assets/eva/eva-guess.png");
const evaCorrectImg = require("../../../../../assets/eva/eva-correct.png");
const evaWrongImg = require("../../../../../assets/eva/eva-wrong.png");

const colors = [
  { name: "Red", image: require("../../../../../assets/color/red.png") },
  { name: "Yellow", image: require("../../../../../assets/color/yellow.png") },
  { name: "Green", image: require("../../../../../assets/color/green.png") },
  { name: "Blue", image: require("../../../../../assets/color/blue.png") },
  { name: "Gray", image: require("../../../../../assets/color/gray.png") },
  { name: "Black", image: require("../../../../../assets/color/black.png") },
  { name: "White", image: require("../../../../../assets/color/white.png") }
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
      items={colors}
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
