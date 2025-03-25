// ChallengeHard.js
import React, { useEffect, useState } from "react";
import GameFlows from "../../../component/game/GameFlowChallenge";
import PregameDialog from "../../../component/game/PregameDialog";
import Countdown from "../../../component/countdown";
import HardGame from "../../../component/game/challenge/HardMode/ChallengeHard";
import StageCompletion from "../../../component/stageCompletion";
import EvaDialouges from "../../../data/evaDialogues";
import { useNavigation } from "@react-navigation/native";
import { playMusic, stopMusic } from "../../../component/audio/MusicManager";

const bg = require("../../../../assets/gameBackground/challenge/hard/chall-hard-bg.webp");

const DialogData = {
  dialogues: [
    "Waaahhh",
    "*laughs menacingly* WAHAHAHAHAHAHAA welcome. You will not foil my plan. I already have your friend’s memories erased. There’s no turning back.",
    "Noooo—Shane, Dolor, Amber. I have to save them.",
  ],
  npcNames: ["Eva", "Evil Inventor", "Eva"],
  npcImages: [
    {
      image: require("../../../../assets/eva/eva-sad.png"),
      width: 344,
      height: 566,
    },
    {
      image: require("../../../../assets/inventor/inventor-laughing.png"),
      width: 600,
      height: 500,
    },
    {
      image: require("../../../../assets/eva/eva-sad.png"),
      width: 344,
      height: 566,
    },
  ],
  audioFiles: [
    [
      require("../../../../assets/gameBackground/challenge/hard/audio/pregame/pregame-1.mp3"),
    ],
    [
      require("../../../../assets/gameBackground/challenge/hard/audio/pregame/pregame-2.mp3"),
    ],
    [
      require("../../../../assets/gameBackground/challenge/hard/audio/pregame/pregame-3.mp3"),
    ],
  ],
};

const CompletionNpc = {
  name: "Eva",
  image: require("../../../../assets/eva/eva-excited.png"),
};

const customCompletionDialog = [
  "I'm truly grateful for your help! We have now successfully rescued our friends and defeated the Evil Inventor. If you ever need help, you're always welcome here in Techtopia.",
];

const HardModeScreen = ({ route }) => {
  const navigation = useNavigation();
  const [scores, setScores] = useState(null); // ✅ Initialize scores state

  useEffect(() => {
    playMusic("hardBg");
    return () => stopMusic();
  }, []);

  // ✅ Ensure `studentId` is properly extracted
  const studentId = route?.params?.studentId || null;
  console.log("Challenge Hard received studentID:", studentId);

  if (!studentId) {
    console.error("❌ ERROR: studentId is undefined!");
  }

  // ✅ Function to submit scores
  const handleGameComplete = async (score, timeTaken, setGamePhase) => {
    console.log("Submitting game results...");
    console.log("Student ID:", studentId);
    console.log("Score:", score);
    console.log("Time Taken:", timeTaken);

    if (!studentId || !scores) {
      if (!scores) {
        console.error("❌ ERROR: Cannot submit score, scores are missing.");
      }
      if (!studentId) {
        console.error("❌ ERROR: Cannot submit score, student ID is missing.");
      }
      return;
    }

    // ✅ Calculate correct and incorrect answers
    let correct = 0;
    let incorrect = 0;

    Object.keys(scores).forEach((category) => {
      Object.entries(scores[category]).forEach(([key, value]) => {
        correct += value; // Value is the number of correct answers
      });
    });

    incorrect = 11 - correct; // Total rounds - correct answers

    try {
      const response = await fetch(
        "http://10.0.2.2:5000/api/students/update-score",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId,
            subject: "Shapes", // 🔹 Adjust subject dynamically if needed
            difficulty: "Hard",
            mode: "challenge",
            points: score,
            stars: correct >= 10 ? 3 : correct >= 7 ? 2 : 1,
            correct,
            incorrect,
          }),
        }
      );

      const data = await response.json();
      console.log("✅ Score update response:", data);

      if (typeof setGamePhase === "function") {
        console.log("✅ Updating game phase to 'completed'");
        setGamePhase("completed");
      } else {
        console.error("❌ ERROR: setGamePhase is not a function!");
      }
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  return (
    <GameFlows
      backgroundImg={bg}
      DialogComponent={(props) => (
        <PregameDialog {...props} dialogData={DialogData} />
      )}
      CountdownComponent={Countdown}
      GameComponent={(props) => (
        <HardGame
          {...props}
          onGameComplete={(score, timeTaken) =>
            handleGameComplete(score, timeTaken, props.setGamePhase)
          }
          studentId={studentId}
        />
      )}
      navigation={navigation}
      StageCompletionComponent={(props) => (
        <StageCompletion
          mode="challenge"
          level="" // ✅ Current Level
          dialoguesData={{ complete: customCompletionDialog }}
          completionNpc={CompletionNpc}
          navigation={navigation}
          studentId={studentId} // ✅ Ensure studentId is passed
        />
      )}
    />
  );
};

export default HardModeScreen;
