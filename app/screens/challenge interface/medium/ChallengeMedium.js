// ChallengeMedium.js
import React, { useEffect } from "react";
import GameFlows from "../../../component/game/GameFlowChallenge";
import PregameDialog from "../../../component/game/PregameDialog";
import Countdown from "../../../component/countdown";
import MediumGame from "../../../component/game/challenge/MediumMode/ChallengeMedium";
import StageCompletion from "../../../component/stageCompletion";
import { useNavigation } from "@react-navigation/native";
import { playMusic, stopMusic } from "../../../component/audio/MusicManager";

const bg = require("../../../../assets/gameBackground/challenge/medium/medium-bg.webp");

const DialogData = {
  dialogues: [
    "Thanks for helping me cross the river. Now, the last obstacle is this forest. It's a total maze here.",
  ],
  npcNames: ["Eva"],
  npcImages: [
    {
      image: require("../../../../assets/eva/eva-pointing.png"),
      width: 520,
      height: 480,
    },
  ],
  audioFiles: [
    [
      require("../../../../assets/gameBackground/challenge/medium/audio/pregame/medium-pregame.mp3"),
    ],
  ],
};

const CompletionNpc = {
  name: "Eva",
  image: require("../../../../assets/eva/eva-happy.png"),
};

const customCompletionDialog = [
  "I can’t thank you enough for helping me pass through the forest. Not only that, we have found ourselves new friends!",
];

const MedModeScreen = ({ route }) => {
  const navigation = useNavigation();

  useEffect(() => {
    playMusic("easyBg");
    return () => stopMusic();
  }, []);

  // ✅ Ensure `studentId` is properly extracted
  const studentId = route?.params?.studentId || null;
  console.log("Challenge Hard received studentID:", studentId);

  if (!studentId) {
    console.error("❌ ERROR: studentId is undefined!");
  }

  const handleGameComplete = async (score, timeTaken, setGamePhase) => {
    console.log("Submitting game results...");
    console.log("Student ID:", studentId);
    console.log("Score:", score);
    console.log("Time Taken:", timeTaken);

    if (!studentId) {
      console.error("❌ ERROR: Cannot submit score, studentId is missing.");
      return;
    }

    const totalRounds = 5;
    const mistakes = totalRounds - score;
    const stars = mistakes === 0 ? 3 : mistakes <= 3 ? 2 : 1;

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
            subject: "",
            difficulty: "Medium",
            mode: "challenge",
            points: score,
            stars,
          }),
        }
      );
      const data = await response.json();
      console.log("Score update response:", data);

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
        <MediumGame
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
          mode="challenge" // ✅ Indicates Challenge Mode
          level="Medium" // ✅ Current Level
          dialoguesData={{ complete: customCompletionDialog }}
          completionNpc={CompletionNpc}
          navigation={navigation}
          studentId={studentId} // ✅ Ensure studentId is passed
        />
      )}
    />
  );
};

export default MedModeScreen;
