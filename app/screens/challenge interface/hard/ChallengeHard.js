// ChallengeHard.js 
import React, { useEffect } from "react";
import GameFlows from "../../../component/game/GameFlowChallenge";
import PregameDialog from "../../../component/game/PregameDialog";
import Countdown from "../../../component/countdown";
import PracticeHard from "../../../component/game/challenge/HardMode/ChallengeHard";
import StageCompletion from "../../../component/stageCompletion";
import EvaDialouges from "../../../data/evaDialogues";
import { useNavigation } from '@react-navigation/native';
import { playMusic, stopMusic } from "../../../component/audio/MusicManager";


const bg = require("../../../../assets/gameBackground/challenge/hard/chall-hard-bg.webp");

const ChallHardDialogData = {
  dialogues: [
    "Waaahhh",
    "*laughs menacingly* WAHAHAHAHAHAHAA welcome. You will not foil my plan. I already have your friend’s memories erased. There’s no turning back.",
    "Noooo—Shane, Dolor, Amber. I have to save them."
  ],
  npcNames: ["Eva", "Evil Inventor", "Eva"],
  npcImages: [
    { image: require("../../../../assets/eva/eva-sad.png"), width: 344, height: 566 },
    { image: require("../../../../assets/inventor/inventor-laughing.png"), width: 600, height: 500 },
    { image: require("../../../../assets/eva/eva-sad.png"), width: 344, height: 566 },
  ],
  audioFiles: [
    [require('../../../../assets/gameBackground/challenge/hard/audio/pregame/pregame-1.mp3')], 
    [require('../../../../assets/gameBackground/challenge/hard/audio/pregame/pregame-2.mp3')], 
    [require('../../../../assets/gameBackground/challenge/hard/audio/pregame/pregame-3.mp3')], 

  ],
};

const practiceHardCompletionNpc = {
  name: "Eva",
  image: require("../../../../assets/eva/eva-excited.png")
};

const customCompletionDialog = [
  "I'm truly grateful for your help! We have now successfully rescued our friends and defeated the Evil Inventor. If you ever need help, you're always welcome here in Techtopia."
];

const PracticeHardScreen = () => {
  const navigation = useNavigation(); 

  useEffect(() => {
    playMusic("hardBg");
    return () => stopMusic();
  }, []);

  return (
    <GameFlows
      backgroundImg={bg}
      DialogComponent={(props) => <PregameDialog {...props} dialogData={ChallHardDialogData} />}
      CountdownComponent={Countdown}
      GameComponent={PracticeHard}
      navigation={navigation} 
      StageCompletionComponent={(props) => (
        <StageCompletion 
          {...props} 
          dialoguesData={{ complete: customCompletionDialog }}  
          completionNpc={practiceHardCompletionNpc} 
          navigation={navigation} 
          isChallengeMode={true} 
          totalRounds={5} 
          currentScreen="ChallengeHard"
        />
      )}
    />
  );
};
export default PracticeHardScreen;
