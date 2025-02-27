// ColorModeScreen.js
import React from "react";
import GameFlow from "../../../../component/game/GameFlows";
import PregameDialog from "../../../../component/game/PregameDialog";
import Countdown from "../../../../component/countdown";
import ColorGame from "../../../../component/game/colorGame";
import StageCompletion from "../../../../component/stageCompletion";
import colorDialogues from "../../../../data/colorDialogues";

const colorBg = require("../../../../../assets/gameBackground/practice-color-bg.png");

const colorDialogData = {
  dialogues: [
    "Hey there, superstar! 🌟 Today, we’re diving into a world of COLORS! Can you name all the colors you see?",
    "That’s right! I’m Shane, and I LOVE colors! 😆 Get ready to match, sort, and play with vibrant hues. Let’s light up the screen!",
    "Awesome! I know you’ll do great! 🎉 Let’s jump in and have some colorful fun! Go, go, go!",
  ],
  npcNames: ["Eva", "Dolor", "Eva"],
  npcImages: [
    { image: require("../../../../../assets/eva/eva-excited.png"), width: 340, height: 480 },
    { image: require("../../../../../assets/dolor/dolor-greet.png"), width: 460, height: 500 },
    { image: require("../../../../../assets/eva/eva-pointing.png"), width: 601, height: 493 },
  ],
};

const colorCompletionNpc = {
  name: "Dolor",
  image: require("../../../../../assets/dolor/dolor-greet.png")
};

const ColorModeScreen = () => (
  <GameFlow
    backgroundImg={colorBg}
    DialogComponent={(props) => <PregameDialog {...props} dialogData={colorDialogData} />}
    CountdownComponent={Countdown}
    GameComponent={ColorGame}
    StageCompletionComponent={(props) => (
      <StageCompletion 
        {...props} 
        dialoguesData={colorDialogues} 
        completionNpc={colorCompletionNpc} 
      />
    )}
  />
);

export default ColorModeScreen;
