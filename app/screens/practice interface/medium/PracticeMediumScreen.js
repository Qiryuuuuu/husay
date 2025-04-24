// PracticeMediumScreen.js
import React, { useEffect, useState } from "react";
import GameFlows from "../../../component/game/GameFlows";
import PregameDialog from "../../../component/game/PregameDialog";
import Countdown from "../../../component/countdown";
import PracticeMedium from "../../../component/game/Practice/MediumMode/PracticeMedium";
import StageCompletion from "../../../component/stageCompletion";
import PracticeMediumDialogues from "../../../data/evaDialogues";

import { useNavigation } from "@react-navigation/native";
import { playMusic, stopMusic } from "../../../component/audio/MusicManager";

const practiceMediumBg = require("../../../../assets/gameBackground/practice-meduim-bg.png");

const practiceMediumDialogData = {
  dialogues: [
    "Hello Adventurer! time to step up your skills! In this level, you'll need to identify shapes, colors, and numbers ✨. Are you ready for the challenge? Let's see how sharp your mind is!",
    "Great! Remember, take your time and think carefully before you choose 👀. Shapes, colors, and numbers are all around us—let’s see if you can spot them correctly! I'm cheering for you!",
  ],
  npcNames: ["Eva", "Eva"],
  npcImages: [
    {
      image: require("../../../../assets/eva/eva-love.png"),
      width: 260,
      height: 400,
    },
    {
      image: require("../../../../assets/eva/eva-happy.png"),
      width: 430,
      height: 470,
    },
  ],
  audioFiles: [
    [
      require("../../../../assets/voiceOver/eva/practiceMedium/eva-medium-1.mp3"),
    ],
    [
      require("../../../../assets/voiceOver/eva/practiceMedium/eva-medium-2.mp3"),
    ],
  ],
};

const practiceMediumCompletionNpc = {
  name: "Eva",
  image: require("../../../../assets/eva/eva-excited.png"),
};

const PracticeMediumScreen = ({ route }) => {
  const [finalTime, setFinalTime] = useState(null);
  const [finalScore, setFinalScore] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const navigation = useNavigation();
  const { studentId } = route.params || {}; // Receive studentId
  useEffect(() => {
    playMusic("easyBg");
    return () => stopMusic();
  }, []);

  console.log("Practice Medium received studentID: ", studentId);

  const handleGameComplete = async (score, timeTaken, setGamePhase) => {
    console.log("Submitting game results...");
    console.log("Student ID:", studentId);
    console.log("Score:", score);
    console.log("Time Taken:", timeTaken);

    const totalRounds = 5; // ✅ Ensure this matches `numRounds` in BaseGame.tsx
    const mistakes = totalRounds - score; // ✅ Calculate mistakes

    // ✅ New star system based on mistakes
    const stars = mistakes === 0 ? 3 : mistakes <= 3 ? 2 : 1;

    try {
      // const response = await fetch(
      //   "http://10.0.2.2:5000/api/students/update-score",
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       studentId,
      //       subject: "",
      //       difficulty: "Medium",
      //       mode: "practice",
      //       points: score,
      //       stars,
      //     }),
      //   }
      // );
      // const data = await response.json();
      // console.log("Score update response:", data);

      // ✅ Store final values
      setFinalScore(score);
      setFinalTime(timeTaken);

      // ✅ Transition to Stage Completion
      console.log("✅ Updating game phase to 'completed'");
      setGamePhase("completed");
      setGameFinished(true); // ✅ Set game finished state
    } catch (error) {
      console.log("Error updating score:", error);
    }
  };

  return (
    <GameFlows
      backgroundImg={practiceMediumBg}
      DialogComponent={(props) => (
        <PregameDialog {...props} dialogData={practiceMediumDialogData} />
      )}
      CountdownComponent={Countdown}
      // GameComponent={PracticeMedium}
      GameComponent={(props) => (
        <PracticeMedium
          {...props}
          onGameComplete={(score, timeTaken) =>
            handleGameComplete(
              score,
              timeTaken,
              props.setGamePhase,
              props.setFinalScore,
              props.setFinalTime
            )
          } // ✅ Pass setGamePhase when calling handleGameComplete
          setGamePhase={props.setGamePhase}
          setFinalScore={props.setFinalScore} // ✅ Ensure these are passed
          setFinalTime={props.setFinalTime}
        />
      )}
      navigation={navigation}
      StageCompletionComponent={(props) => (
        <StageCompletion
          {...props}
          dialoguesData={PracticeMediumDialogues}
          completionNpc={practiceMediumCompletionNpc}
          mode="practice"
          level="Medium"
          navigation={navigation}
          studentId={studentId} // Pass studentId to StageCompletion
          isChallengeMode={false}
          timeTaken={finalTime}
          correctAnswers={finalScore}
          totalRounds={5}
          onRestart={() => {
            setGameFinished(false);
            setFinalScore(null);
            setFinalTime(null); // Reset final time
            navigation.replace("PracticeMedium", {
              studentId, // Pass studentId when navigating
            });
          }}
        />
      )}
    />
  );
};
export default PracticeMediumScreen;
