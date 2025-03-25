// ChallengeColor.js
import React, { useEffect } from "react";
import GameFlows from "../../../../component/game/GameFlowChallenge";
import PregameDialog from "../../../../component/game/PregameDialog";
import Countdown from "../../../../component/countdown";
import ColorGame from "../../../../component/game/challenge/EasyMode/ChallengeColor";
import StageCompletion from "../../../../component/stageCompletion";
import { useNavigation } from "@react-navigation/native";
import { playMusic, stopMusic } from "../../../../component/audio/MusicManager";

const bg = require("../../../../../assets/gameBackground/challenge/easy/default-easy.webp");

const DialogData = {
  dialogues: [
    "Woahhh, there’s a river we must cross to reach the lair. But, as you know it, I’m a robot hihihihi I’m not sure I’m waterproof. How silly of me. My friend, will you help me cross the river?",
  ],
  npcNames: ["Eva"],
  npcImages: [
    {
      image: require("../../../../../assets/eva/eva-happy.png"),
      width: 340,
      height: 480,
    },
  ],
  audioFiles: [
    [require("../../../../../assets/voiceOver/eva/challengEasy/1-pregame.mp3")],
  ],
};

const CompletionNpc = {
  name: "Eva",
  image: require("../../../../../assets/eva/eva-happy.png"),
};

const customCompletionDialog = [
  "Thank you. We crossed the river safely. I can see the lair but we have to pass through the forest first.",
];

const ChallengeColorScreen = ({ route }) => {
  const navigation = useNavigation();

  useEffect(() => {
    playMusic("easyBg");
    return () => stopMusic();
  }, []);

  const studentId = route?.params?.studentId || null;
  console.log("Challenge Color easy received studentID:", studentId);

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
            subject: "Colors",
            difficulty: "Easy",
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
        <ColorGame
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
          level="Color" // ✅ Current Level
          completionNpc={CompletionNpc}
          navigation={navigation}
          studentId={studentId} // ✅ Ensure studentId is passed
        />
      )}
    />
  );
};

export default ChallengeColorScreen;
