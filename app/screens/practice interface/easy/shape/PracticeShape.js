// PracticeShape.js
import React from "react";
import GameFlows from "../../../../component/game/GameFlows";
import PregameDialog from "../../../../component/game/PregameDialog";
import Countdown from "../../../../component/countdown";
import ShapeGame from "../../../../component/game/Practice/EasyMode/PracticeShape";
import StageCompletion from "../../../../component/stageCompletion";
import shapeDialogues from "../../../../data/shapeDialogues";
import { useNavigation } from "@react-navigation/native";

const shapeBg = require("../../../../../assets/gameBackground/practice-shape-bg.webp");

const shapeDialogData = {
  dialogues: [
    "Good morning, Shane! Hey kid, learn from this guy. He's sporty and cool and loves playing with kids like you. But most of all, he's your go-to guy if you wanna learn about shapes.",
    "Come on, EVA. You're making me blush hihi. Ahemmm, attention! Grab the cards EVA gave you and tap them on Husay. It will help you. What shape is this?",
  ],
  npcNames: ["Eva", "Shane"],
  npcImages: [
    {
      image: require("../../../../../assets/eva/eva-excited.png"),
      width: 340,
      height: 480,
    },
    {
      image: require("../../../../../assets/shane/shane-greet.png"),
      width: 460,
      height: 500,
    },
  ],
  audioFiles: [
    [
      require("../../../../../assets/voiceOver/eva/practiceEasy/shape/eva-narrative-4.mp3"),
      require("../../../../../assets/voiceOver/eva/practiceEasy/shape/eva-narrative-5.mp3"),
    ],
    [
      require("../../../../../assets/voiceOver/shane/practiceEasy/1_easy-shape.mp3"),
      require("../../../../../assets/voiceOver/shane/practiceEasy/2_easy-shape.mp3"),
    ],
  ],
};

const shapeCompletionNpc = {
  name: "Shane",
  image: require("../../../../../assets/shane/shane-greet.png"),
};

const ShapeModeScreen = ({ route }) => {
  const navigation = useNavigation();
  const { studentId } = route.params || {}; // Receive studentId
  console.log("Practice Shape easy received studentID: ", studentId);

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
            subject: "Shapes",
            difficulty: "Easy",
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
      backgroundImg={shapeBg}
      DialogComponent={(props) => (
        <PregameDialog {...props} dialogData={shapeDialogData} />
      )}
      CountdownComponent={Countdown}
      // GameComponent={ShapeGame}
      GameComponent={(props) => (
        <ShapeGame
          {...props}
          onGameComplete={handleGameComplete}
          setGamePhase={props.setGamePhase} // ✅ Pass setGamePhase from GameFlows.js
        />
      )}
      navigation={navigation}
      StageCompletionComponent={(props) => (
        <StageCompletion
          {...props}
          dialoguesData={shapeDialogues}
          completionNpc={shapeCompletionNpc}
          navigation={() => navigation.navigate("PracMainScreen")}
        />
      )}
    />
  );
};

export default ShapeModeScreen;
