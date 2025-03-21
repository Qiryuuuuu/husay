// PracticeMediumScreen.js
import React from "react";
import GameFlows from "../../../component/game/GameFlows";
import PregameDialog from "../../../component/game/PregameDialog";
import Countdown from "../../../component/countdown";
import PracticeMedium from "../../../component/game/Practice/MediumMode/PracticeMedium";
import StageCompletion from "../../../component/stageCompletion";
import PracticeMediumDialogues from "../../../data/evaDialogues";
import { useNavigation } from "@react-navigation/native";

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
  const navigation = useNavigation();
  const { studentId } = route.params || {}; // Receive studentId
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
            mode: "practice",
            points: score,
            stars,
          }),
        }
      );
      const data = await response.json();
      console.log("Score update response:", data);

      // ✅ Transition to Stage Completion
      if (setGamePhase) {
        console.log("✅ Updating game phase to 'completed'");
        setGamePhase("completed");
      } else {
        console.error("❌ setGamePhase is undefined!");
      }
    } catch (error) {
      console.error("Error updating score:", error);
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
          onGameComplete={handleGameComplete}
          setGamePhase={props.setGamePhase} // ✅ Pass setGamePhase from GameFlows.js
        />
      )}
      navigation={navigation}
      StageCompletionComponent={(props) => (
        <StageCompletion
          {...props}
          dialoguesData={PracticeMediumDialogues}
          completionNpc={practiceMediumCompletionNpc}
          navigation={() => navigation.navigate("PracMainScreen")}
        />
      )}
    />
  );
};
export default PracticeMediumScreen;
