// PracticeColor.js
import React from "react";
import GameFlows from "../../../../component/game/GameFlows";
import PregameDialog from "../../../../component/game/PregameDialog";
import Countdown from "../../../../component/countdown";
import ColorGame from "../../../../component/game/Practice/EasyMode/PracticeColor";
import StageCompletion from "../../../../component/stageCompletion";
import colorDialogues from "../../../../data/colorDialogues";
import { useNavigation } from '@react-navigation/native';


const colorBg = require("../../../../../assets/gameBackground/practice-color-bg.png");

const colorDialogData = {
  dialogues: [
    "Hi, Dolor! You’re looking as beautiful as ever. Seriously, how do you always manage to look so radiant?",
    "Oh, you flatter me! That’s so kind of you to say. But tell me, who’s this little one you’ve brought with you today?",  
    "Ah, this is my new companion! I thought it would be wonderful if they could learn a bit about colors from you. After all, you’re an artist, and there’s no one better to teach them than you.",
    "Oh, how delightful! I’d be more than happy to help. Alright, dear, let’s make learning fun! Just tap the tools and say their names out loud. It will help you remember them better. Now, let’s start—what color is this?"
  ],
  npcNames: ["Eva", "Dolor", "Eva", "Dolor"],
  npcImages: [
    { image: require("../../../../../assets/eva/eva-love.png"), width: 340, height: 550 },
    { image: require("../../../../../assets/dolor/dolor-casual.png"), width: 345, height: 525 },
    { image: require("../../../../../assets/eva/eva-loud.png"), width: 601, height: 493 },
    { image: require("../../../../../assets/dolor/dolor-greet.png"), width: 460, height: 500 },
  ],
  audioFiles: [
    [require('../../../../../assets/voiceOver/eva/practiceEasy/color/eva-narrative-6.mp3')], 
    [require('../../../../../assets/voiceOver/dolor/practiceEasy/1_easy-color.mp3')], 
    [require('../../../../../assets/voiceOver/eva/practiceEasy/color/eva-narrative-7.mp3')],
    [require('../../../../../assets/voiceOver/dolor/practiceEasy/2_easy-color.mp3')],
  ],
};

const colorCompletionNpc = {
  name: "Dolor",
  image: require("../../../../../assets/dolor/dolor-greet.png")
};

const ColorModeScreen = () => {
  const navigation = useNavigation(); 

  return (
    <GameFlows
      backgroundImg={colorBg}
      DialogComponent={(props) => <PregameDialog {...props} dialogData={colorDialogData} />}
      CountdownComponent={Countdown}
      GameComponent={ColorGame}
      navigation={navigation} 
      StageCompletionComponent={(props) => (
        <StageCompletion 
          {...props} 
          dialoguesData={colorDialogues} 
          completionNpc={colorCompletionNpc} 
          navigation={navigation}
        />
      )}
    />
  );
};
export default ColorModeScreen;
