// ColorModeScreen.js
import React from "react";
import GameFlow from "../../../../component/game/GameFlows";
import PregameDialog from "../../../../component/game/PregameDialog";
import Countdown from "../../../../component/countdown";
import NumberGame from "../../../../component/game/numberGame";
import StageCompletion from "../../../../component/stageCompletion";
import numberDialogues from "../../../../data/numberDialogues";

const numberBg = require("../../../../../assets/gameBackground/practice-number-bg.png");

const numberDialogData = {
  dialogues: [
    "Hey there, superstar! 🌟 Today, we’re diving into a world of COLORS! Can you name all the colors you see?",
    "That’s right! I’m Shane, and I LOVE colors! 😆 Get ready to match, sort, and play with vibrant hues. Let’s light up the screen!",
    "Awesome! I know you’ll do great! 🎉 Let’s jump in and have some colorful fun! Go, go, go!",
  ],
  npcNames: ["Eva", "Amber", "Eva"],
  npcImages: [
    { image: require("../../../../../assets/eva/eva-excited.png"), width: 340, height: 480 },
    { image: require("../../../../../assets/amber/amber-greet.png"), width: 460, height: 500 },
    { image: require("../../../../../assets/eva/eva-pointing.png"), width: 601, height: 493 },
  ],
};

const numberCompletionNpc = {
  name: "Amber",
  image: require("../../../../../assets/amber/amber-greet.png")
};

const NumberModeScreen = () => (
  <GameFlow
    backgroundImg={numberBg}
    DialogComponent={(props) => <PregameDialog {...props} dialogData={numberDialogData} />}
    CountdownComponent={Countdown}
    GameComponent={NumberGame}
    StageCompletionComponent={(props) => (
      <StageCompletion 
        {...props} 
        dialoguesData={numberDialogues} 
        completionNpc={numberCompletionNpc} 
      />
    )}
  />
);

export default NumberModeScreen;
