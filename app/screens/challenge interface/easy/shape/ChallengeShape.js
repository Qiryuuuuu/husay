// ChallengeShape.js
import React from "react";
import GameFlows from "../../../../component/game/GameFlowChallenge";
import PregameDialog from "../../../../component/game/PregameDialog";
import Countdown from "../../../../component/countdown";
import ShapeGame from "../../../../component/game/challenge/EasyMode/ChallengeShape";
import StageCompletion from "../../../../component/stageCompletion";
import { useNavigation } from '@react-navigation/native';

const shapeBg = require("../../../../../assets/gameBackground/challenge/easy/default-easy.png");

const shapeDialogData = {
  dialogues: [
    "Woahhh, there’s a river we must cross to reach the lair. But, as you know it, I’m a robot hihihihi I’m not sure I’m waterproof. How silly of me. My friend, will you help me cross the river?"
  ],
  npcNames: ["Eva"],
  npcImages: [
    { image: require("../../../../../assets/eva/eva-happy.png"), width: 340, height: 480 },
  ],
  audioFiles: [
    [require('../../../../../assets/voiceOver/eva/challengEasy/1-pregame.mp3')], 
  ],
};

const shapeCompletionNpc = {
  name: "Eva",
  image: require("../../../../../assets/eva/eva-happy.png")
};

const customCompletionDialog = [
  "Thank you. We crossed the river safely. I can see the lair but we have to pass through the forest first."
];

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
          dialoguesData={{ complete: customCompletionDialog }}  
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
