// PracticeNumber.js
import React, { useEffect } from "react";
import GameFlows from "../../../../component/game/GameFlows";
import PregameDialog from "../../../../component/game/PregameDialog";
import Countdown from "../../../../component/countdown";
import NumberGame from "../../../../component/game/Practice/EasyMode/PracticeNumber";
import StageCompletion from "../../../../component/stageCompletion";
import numberDialogues from "../../../../data/numberDialogues";
import { useNavigation } from '@react-navigation/native';
import { playMusic, stopMusic } from "../../../../component/audio/MusicManager";


const numberBg = require("../../../../../assets/gameBackground/practice-number-bg.png");

const numberDialogData = {
  dialogues: [
    "Heyyy, Ambeeeeerrrrr. I got you some food. ",
    "Ooohhh, thank you, EVA. I love you. Ohhh, hello. I’m Amber. I love numbers and food. Don’t forget food. ",
    "Well, I don’t have to introduce you, do I? Amber here will teach you about numbers. She’s great at it. Especially, counting the cream puffs she can put in her mouth. ",
    "EVA, shhhh... You’re making me blush. Anyways, tap the tools and say the name. It will help you. What number is this?"
  ],
  npcNames: ["Eva", "Amber", "Eva", "Amber"],
  npcImages: [
    { image: require("../../../../../assets/eva/eva-pointing.png"), width: 540, height: 480 },
    { image: require("../../../../../assets/amber/amber-think.png"), width: 360, height: 500 },
    { image: require("../../../../../assets/eva/eva-happy.png"), width: 360, height: 500 },
    { image: require("../../../../../assets/amber/amber-greet.png"), width: 360, height: 500 },
  ],
  audioFiles: [
    [require('../../../../../assets/voiceOver/eva/practiceEasy/number/eva-narrative-8.mp3')], 
    [require('../../../../../assets/voiceOver/amber/practiceEasy/1_easy-number.mp3')], 
    [require('../../../../../assets/voiceOver/eva/practiceEasy/number/eva-narrative-9.mp3')],
    [require('../../../../../assets/voiceOver/amber/practiceEasy/2_easy-number.mp3')],
  ],
};

const numberCompletionNpc = {
  name: "Amber",
  image: require("../../../../../assets/amber/amber-greet.png")
};

const NumberModeScreen = () => {
  const navigation = useNavigation(); 

  useEffect(() => {
    playMusic("easyBg");
    return () => stopMusic();
  }, []);


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
          currentScreen="PracticeNumber"
        />
      )}
    />
  );
}

export default NumberModeScreen;
