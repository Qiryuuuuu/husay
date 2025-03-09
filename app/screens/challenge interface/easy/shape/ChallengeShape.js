// ChallengeShape.js 
import React from "react";
import GameFlows from "../../../../component/game/GameFlows";
import PregameDialog from "../../../../component/game/PregameDialog";
import Countdown from "../../../../component/countdown";
import ShapeGame from "../../../../component/game/challenge/EasyMode/ChallengeShape";
import StageCompletion from "../../../../component/stageCompletion";
import shapeDialogues from "../../../../data/shapeDialogues";
import { useNavigation } from '@react-navigation/native';

const shapeBg = require("../../../../../assets/gameBackground/challenge-shape-bg.png");

const shapeDialogData = {
    dialogues: [
        "Welcome back, shape champion! 🏆 This time, it’s Challenge Mode! Are you ready to put your shape skills to the test? Let’s see how fast you can recognize circles, squares, rectangles, and triangles!",
        "I’m Shane, your shape-loving buddy! 😆 But this time, I won’t make it too easy. You’ll need to think fast and choose wisely! Are you up for the challenge?",
        "Awesome! Remember, speed and accuracy matter now! 🚀 Let’s jump in and have a shape-tastic challenge! Go, go, go!",
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
        GameComponent={(props) => <ShapeGame {...props} />}
        navigation={navigation} 
        StageCompletionComponent={(props) => (
          <StageCompletion 
            {...props} 
            dialoguesData={shapeDialogues} 
            completionNpc={shapeCompletionNpc} 
            navigation={navigation} 
            isChallengeMode={true} 
            totalRounds={5} 
          />
        )}
      />
    );
  };
  
export default ShapeModeScreen;
 