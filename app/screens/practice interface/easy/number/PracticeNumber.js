// PracticeNumber.js
import React, { useEffect, useState } from "react";
import GameFlows from "../../../../component/game/GameFlows";
import PregameDialog from "../../../../component/game/PregameDialog";
import Countdown from "../../../../component/countdown";
import NumberGame from "../../../../component/game/Practice/EasyMode/PracticeNumber";
import StageCompletion from "../../../../component/stageCompletion";
import numberDialogues from "../../../../data/numberDialogues";
import { useNavigation } from "@react-navigation/native";
import { playMusic, stopMusic } from "../../../../component/audio/MusicManager";

const numberBg = require("../../../../../assets/gameBackground/practice-number-bg.png");

const numberDialogData = {
  dialogues: [
    "Heyyy, Ambeeeeerrrrr. I got you some food. ",
    "Ooohhh, thank you, EVA. I love you. Ohhh, hello. I’m Amber. I love numbers and food. Don’t forget food. ",
    "Well, I don’t have to introduce you, do I? Amber here will teach you about numbers. She’s great at it. Especially, counting the cream puffs she can put in her mouth. ",
    "EVA, shhhh... You’re making me blush. Anyways, tap the tools and say the name. It will help you. What number is this?",
  ],
  npcNames: ["Eva", "Amber", "Eva", "Amber"],
  npcImages: [
    {
      image: require("../../../../../assets/eva/eva-pointing.png"),
      width: 540,
      height: 480,
    },
    {
      image: require("../../../../../assets/amber/amber-think.png"),
      width: 360,
      height: 500,
    },
    {
      image: require("../../../../../assets/eva/eva-happy.png"),
      width: 360,
      height: 500,
    },
    {
      image: require("../../../../../assets/amber/amber-greet.png"),
      width: 360,
      height: 500,
    },
  ],
  audioFiles: [
    [
      require("../../../../../assets/voiceOver/eva/practiceEasy/number/eva-narrative-8.mp3"),
    ],
    [
      require("../../../../../assets/voiceOver/amber/practiceEasy/1_easy-number.mp3"),
    ],
    [
      require("../../../../../assets/voiceOver/eva/practiceEasy/number/eva-narrative-9.mp3"),
    ],
    [
      require("../../../../../assets/voiceOver/amber/practiceEasy/2_easy-number.mp3"),
    ],
  ],
};

const numberCompletionNpc = {
  name: "Amber",
  image: require("../../../../../assets/amber/amber-greet.png"),
};

const NumberModeScreen = ({ route }) => {
  const [finalTime, setFinalTime] = useState(null);
  const [finalScore, setFinalScore] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const navigation = useNavigation();
  const { studentId } = route.params || {}; // Receive studentId
  useEffect(() => {
    playMusic("easyBg");
    return () => stopMusic();
  }, []);

  console.log("Practice Number easy received studentID: ", studentId);

  const handleGameComplete = async (
    score,
    timeTaken,
    setGamePhase,
    setFinalScore,
    setFinalTime
  ) => {
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
      //       subject: "Numbers",
      //       difficulty: "Easy",
      //       mode: "practice",
      //       points: score,
      //       stars,
      //     }),
      //   }
      // );
      // const data = await response.json();
      // console.log("Score update response:", data);

      setFinalScore(score);
      setFinalTime(timeTaken);

      // ✅ Transition to Stage Completion
      console.log("✅ Updating game phase to 'completed'");
      setGamePhase("completed");
    } catch (error) {
      console.log("Error updating score:", error);
    }
  };
  return (
    <GameFlows
      backgroundImg={numberBg}
      DialogComponent={(props) => (
        <PregameDialog {...props} dialogData={numberDialogData} />
      )}
      CountdownComponent={Countdown}
      // GameComponent={NumberGame}
      GameComponent={(props) => (
        <NumberGame
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
          dialoguesData={numberDialogues}
          completionNpc={numberCompletionNpc}
          navigation={navigation}
          studentId={studentId} // Pass studentId to StageCompletion
          isChallengeMode={false} // Set to false for practice mode
          totalRounds={5} // Total rounds for the game
          onRestart={() => {
            setGameFinished(false);
            setFinalScore(null);
            setFinalTime(null); // Reset final time
            navigation.replace("PracticeNumber", {
              studentId, // Pass studentId when navigating
            });
          }}
        />
      )}
    />
  );
};

export default NumberModeScreen;
