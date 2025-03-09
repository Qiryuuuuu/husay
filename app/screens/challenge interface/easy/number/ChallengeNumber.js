// ChallengeNumber.js
import React from "react";
import GameFlows from "../../../../component/game/GameFlows";
import PregameDialog from "../../../../component/game/PregameDialog";
import Countdown from "../../../../component/countdown";
import NumberGame from "../../../../component/game/Practice/EasyMode/PracticeNumber";
import StageCompletion from "../../../../component/stageCompletion";
import numberDialogues from "../../../../data/numberDialogues";
import { useNavigation } from '@react-navigation/native';


const numberBg = require("../../../../../assets/gameBackground/challenge-number-bg.png");

const numberDialogData = {
  dialogues: [
    "Hey there, little math wizard! 🧙‍♂️✨ Today, we’re going on an adventure with NUMBERS! Can you count with me?",
    "That’s right! I’m Amber, and I LOVE numbers! 😆 Get ready to spot, count, and match the right ones. Let’s make numbers magical!",
    "That’s the spirit! 🌟 Stay sharp, have fun, and let’s crack the number code together! Off we goooo!",
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

const NumberModeScreen = () => {
  const navigation = useNavigation(); 

  return (
    <GameFlows
      backgroundImg={numberBg}
      DialogComponent={(props) => <PregameDialog {...props} dialogData={numberDialogData} />}
      CountdownComponent={Countdown}
      GameComponent={NumberGame}
      navigation={navigation} 
      StageCompletionComponent={(props) => (
        <StageCompletion 
          {...props} 
          dialoguesData={numberDialogues} 
          completionNpc={numberCompletionNpc} 
          navigation={navigation}  
          isChallengeMode={true} 
          totalRounds={5} 
        />
      )}
    />
  );
}

export default NumberModeScreen;
