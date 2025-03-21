// ChallengeMedium.js
import React, { useEffect } from "react";
import GameFlows from "../../../component/game/GameFlowChallenge";
import PregameDialog from "../../../component/game/PregameDialog";
import Countdown from "../../../component/countdown";
import ShapeGame from "../../../component/game/challenge/MediumMode/ChallengeMedium";
import StageCompletion from "../../../component/stageCompletion";
import { useNavigation } from '@react-navigation/native';
import { playMusic, stopMusic } from "../../../component/audio/MusicManager";


const bg = require("../../../../assets/gameBackground/challenge/medium/medium-bg.webp");

const DialogData = {
  dialogues: [
    "Thanks for helping me cross the river. Now, the last obstacle is this forest. It's a total maze here."
  ],
  npcNames: ["Eva"],
  npcImages: [
    { image: require("../../../../assets/eva/eva-pointing.png"), width: 520, height: 480 },
  ],
  audioFiles: [
    [require('../../../../assets/gameBackground/challenge/medium/audio/pregame/medium-pregame.mp3')], 
  ],
};

const CompletionNpc = {
  name: "Eva",
  image: require("../../../../assets/eva/eva-happy.png")
};

const customCompletionDialog = [
  "I can’t thank you enough for helping me pass through the forest. Not only that, we have found ourselves new friends!"
];

const ShapeModeScreen = () => {
  const navigation = useNavigation(); 

  useEffect(() => {
    playMusic("easyBg");
    return () => stopMusic();
  }, []);

  return (
    <GameFlows
      backgroundImg={bg}
      DialogComponent={(props) => <PregameDialog {...props} dialogData={DialogData} />}
      CountdownComponent={Countdown}
      GameComponent={(props) => <ShapeGame {...props} />}
      navigation={navigation} 
      StageCompletionComponent={(props) => (
        <StageCompletion 
          {...props} 
          dialoguesData={{ complete: customCompletionDialog }}  
          completionNpc={CompletionNpc} 
          navigation={navigation} 
          isChallengeMode={true} 
          totalRounds={5} 
          currentScreen="ChallengeMedium"
        />
      )}
    />
  );
};

export default ShapeModeScreen;
