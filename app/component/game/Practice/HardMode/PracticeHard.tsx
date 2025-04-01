import React, { useState, useEffect } from "react";
import { HardBaseGame } from "../../HardBaseGame";
import dialogues from "../../../../data/evaDialogues";
import figures from "../../../../data/hardQuestions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";

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
  onGameComplete: (score: number, time: number) => void;
  navigation: any;
}

const HardGame: React.FC<HardGameProps> = ({ onGameComplete, navigation }) => {
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
        console.log("✅ Game Finished in PracticeHardGame!");
        console.log("Time Taken:", timeTaken);
        console.log("Final Score Received:", score);
    
        onGameComplete(score, timeTaken); // ✅ Correct order
      };
  return (
    <HardBaseGame
      figures={figures}
      onGameComplete={finishGame}
      navigation={navigation}
      npcConfig={evaConfig}
      dialogues={dialogues}
      numShapeRounds={5}
      numColorRounds={5}
      includeCountRound={true} studentId={studentId}    />
  );
};

export default HardGame;