import React from "react";
import { HardBaseGame } from "../../HardBaseGame";
import dialogues from "../../../../data/evaDialogues";
import figures from "../../../../data/hardQuestions";

// Import Eva images
const evaIdleImg = require("../../../../../assets/eva/eva-guess.png");
const evaCorrectImg = require("../../../../../assets/eva/eva-correct.png");
const evaWrongImg = require("../../../../../assets/eva/eva-wrong.png");

// NPC Configuration
const evaConfig = {
  idle: evaIdleImg,
  correct: evaCorrectImg,
  wrong: evaWrongImg,
  name: "Eva"
};

interface GameCompleteProps {
  time: number;
  score: number;
}

interface HardGameProps {
  onGameComplete: (time: number, score: number) => void;
  navigation: any;
}

const HardGame: React.FC<HardGameProps> = ({ onGameComplete, navigation }) => {
  return (
    <HardBaseGame
      figures={figures}
      onGameComplete={onGameComplete}
      navigation={navigation}
      npcConfig={evaConfig}
      dialogues={dialogues}
      numShapeRounds={5}
      numColorRounds={5}
      includeCountRound={true}
    />
  );
};

export default HardGame;