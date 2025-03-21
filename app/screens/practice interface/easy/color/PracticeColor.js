// PracticeColor.js
import React, { useState } from "react";
import GameFlows from "../../../../component/game/GameFlows";
import PregameDialog from "../../../../component/game/PregameDialog";
import Countdown from "../../../../component/countdown";
import ColorGame from "../../../../component/game/Practice/EasyMode/PracticeColor";
import StageCompletion from "../../../../component/stageCompletion";
import colorDialogues from "../../../../data/colorDialogues";
import { useNavigation } from "@react-navigation/native";

const colorBg = require("../../../../../assets/gameBackground/practice-color-bg.png");

const colorDialogData = {
  dialogues: [
    "Hi, Dolor! You’re looking as beautiful as ever. Seriously, how do you always manage to look so radiant?",
    "Oh, you flatter me! That’s so kind of you to say. But tell me, who’s this little one you’ve brought with you today?",
    "Ah, this is my new companion! I thought it would be wonderful if they could learn a bit about colors from you. After all, you’re an artist, and there’s no one better to teach them than you.",
    "Oh, how delightful! I’d be more than happy to help. Alright, dear, let’s make learning fun! Just tap the tools and say their names out loud. It will help you remember them better. Now, let’s start—what color is this?",
  ],
  npcNames: ["Eva", "Dolor", "Eva", "Dolor"],
  npcImages: [
    {
      image: require("../../../../../assets/eva/eva-love.png"),
      width: 340,
      height: 550,
    },
    {
      image: require("../../../../../assets/dolor/dolor-casual.png"),
      width: 345,
      height: 525,
    },
    {
      image: require("../../../../../assets/eva/eva-loud.png"),
      width: 601,
      height: 493,
    },
    {
      image: require("../../../../../assets/dolor/dolor-greet.png"),
      width: 460,
      height: 500,
    },
  ],
  audioFiles: [
    [
      require("../../../../../assets/voiceOver/eva/practiceEasy/color/eva-narrative-6.mp3"),
    ],
    [
      require("../../../../../assets/voiceOver/dolor/practiceEasy/1_easy-color.mp3"),
    ],
    [
      require("../../../../../assets/voiceOver/eva/practiceEasy/color/eva-narrative-7.mp3"),
    ],
    [
      require("../../../../../assets/voiceOver/dolor/practiceEasy/2_easy-color.mp3"),
    ],
  ],
};

const colorCompletionNpc = {
  name: "Dolor",
  image: require("../../../../../assets/dolor/dolor-greet.png"),
};

const ColorModeScreen = ({ route }) => {
  const navigation = useNavigation();
  const { studentId } = route.params || {}; // Receive studentId
  console.log("Practice Color easy received studentID: ", studentId);

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
            subject: "Colors",
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
      backgroundImg={colorBg}
      DialogComponent={(props) => (
        <PregameDialog {...props} dialogData={colorDialogData} />
      )}
      CountdownComponent={Countdown}
      GameComponent={(props) => (
        <ColorGame
          {...props}
          onGameComplete={handleGameComplete}
          setGamePhase={props.setGamePhase} // ✅ Pass setGamePhase from GameFlows.js
        />
      )}
      navigation={navigation}
      StageCompletionComponent={(props) => (
        <StageCompletion
          {...props}
          dialoguesData={colorDialogues}
          completionNpc={colorCompletionNpc}
          navigation={() => navigation.navigate("PracMainScreen")}
        />
      )}
    />
  );
};

export default ColorModeScreen;
