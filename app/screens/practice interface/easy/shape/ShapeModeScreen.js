// ShapeModeScreen.js 
import React from "react";
import GameFlows from "../../../../component/game/GameFlows";
import PregameDialog from "../../../../component/game/PregameDialog";
import Countdown from "../../../../component/countdown";
import ShapeGame from "../../../../component/game/shapeGame";
import StageCompletion from "../../../../component/stageCompletion";
import shapeDialogues from "../../../../data/shapeDialogues";
import { useNavigation } from '@react-navigation/native';


const shapeBg = require("../../../../../assets/gameBackground/practice-shape-bg.webp");

const shapeDialogData = {
  dialogues: [
    "Hey there, superstar! 🌟 Today, we’re playing a fun game all about SHAPES! Can you find circles, squares, rectangles, and triangles? Let’s see if you’re a shape expert.",
    "That’s right! I’m Shane, and I LOVE shapes! 😆 Get ready to match, sort, and play with all kinds of shapes. It’s easy-peasy, so don’t worry—I’ll guide you!",
    "Awesome! I know you’ll do great! 🎉 Let’s jump in and have some shape-tastic fun! Go, go, go!",
  ],
  npcNames: ["Eva", "Shane", "Eva"],
  npcImages: [
    { image: require("../../../../../assets/eva/eva-excited.png"), width: 340, height: 480 },
    { image: require("../../../../../assets/shane/shane-greet.png"), width: 460, height: 500 },
    { image: require("../../../../../assets/eva/eva-pointing.png"), width: 601, height: 493 },
  ],
};

const shapeCompletionNpc = {
  name: "Shane",
  image: require("../../../../../assets/shane/shane-greet.png")
};

const ShapeModeScreen = () => {
  const navigation = useNavigation(); 

  return (
    <GameFlows
      backgroundImg={shapeBg}
      DialogComponent={(props) => <PregameDialog {...props} dialogData={shapeDialogData} />}
      CountdownComponent={Countdown}
      GameComponent={ShapeGame}
      navigation={navigation} 
      StageCompletionComponent={(props) => (
        <StageCompletion 
          {...props} 
          dialoguesData={shapeDialogues} 
          completionNpc={shapeCompletionNpc} 
          navigation={navigation} 
        />
      )}
    />
  );
};
export default ShapeModeScreen;
