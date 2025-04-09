// PracticeHardScreen.js
import React, { useState } from "react";
import GameFlows from "../../../component/game/GameFlows";
import PregameDialog from "../../../component/game/PregameDialog";
import Countdown from "../../../component/countdown";
import PracticeHard from "../../../component/game/Practice/HardMode/PracticeHard";
import StageCompletion from "../../../component/stageCompletion";
import EvaDialouges from "../../../data/evaDialogues";
import { useNavigation } from "@react-navigation/native";
import { playMusic, stopMusic } from "../../../component/audio/MusicManager";
import { useEffect } from "react";

const practiceHardBg = require("../../../../assets/gameBackground/practice-hard-bg.png");

const practiceHardDialogData = {
  dialogues: [
    "Ah, this is the hardest level! This is where true adventurers prove their mastery. You'll need to think fast and stay sharp—shapes, colors, and numbers will appear in trickier ways! Can you handle it? Let’s find out! ⚡",
    "You're learning, but this practice won’t be easy! Pay close attention, trust your instincts, and give it your best shot. Only the sharpest minds can conquer this level! Let's see if you're up for it! 💡🔥",
  ],
  npcNames: ["Eva", "Eva"],
  npcImages: [
    {
      image: require("../../../../assets/eva/eva-loud.png"),
      width: 500,
      height: 400,
    },
    {
      image: require("../../../../assets/eva/eva-pointing.png"),
      width: 460,
      height: 470,
    },
  ],
  audioFiles: [
    [require("../../../../assets/voiceOver/eva/practiceHard/eva-hard-1.mp3")],
    [require("../../../../assets/voiceOver/eva/practiceHard/eva-hard-2.mp3")],
  ],
};

const practiceHardCompletionNpc = {
  name: "Eva",
  image: require("../../../../assets/eva/eva-excited.png"),
};

const PracticeHardScreen = ({ route }) => {
  const [finalTime, setFinalTime] = useState(null);
  const [finalScore, setFinalScore] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const navigation = useNavigation();
  const { studentId } = route.params || {}; // Receive studentId

  useEffect(() => {
    playMusic("easyBg");
    return () => stopMusic();
  }, []);

  console.log("Practice Hard received studentID: ", studentId);

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
      //       difficulty: "Hard",
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
      console.error("Error updating score:", error);
    }
  };

  return (
    <GameFlows
      backgroundImg={practiceHardBg}
      DialogComponent={(props) => (
        <PregameDialog {...props} dialogData={practiceHardDialogData} />
      )}
      CountdownComponent={Countdown}
      GameComponent={(props) => (
        <PracticeHard
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
          dialoguesData={EvaDialouges}
          completionNpc={practiceHardCompletionNpc}
          mode="practice"
          level="Hard"
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
            navigation.replace("PracticeHard", {
              studentId, // Pass studentId when navigating
            });
          }}
        />
      )}
    />
  );
};
export default PracticeHardScreen;
