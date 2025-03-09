// PracticeMediumScreen.js 
import React from "react";
import GameFlows from "../../../component/game/GameFlows";
import PregameDialog from "../../../component/game/PregameDialog";
import Countdown from "../../../component/countdown";
import PracticeMedium from "../../../component/game/Practice/MediumMode/PracticeMedium";
import StageCompletion from "../../../component/stageCompletion";
import PracticeMediumDialogues from "../../../data/evaDialogues";
import { useNavigation } from '@react-navigation/native';


const practiceMediumBg = require("../../../../assets/gameBackground/practice-meduim-bg.png");

const practiceMediumDialogData = {
  dialogues: [
    "Hello Adventurer! time to step up your skills! In this level, you'll need to identify shapes, colors, and numbers ✨. Are you ready for the challenge? Let's see how sharp your mind is!",
    "Great! Remember, take your time and think carefully before you choose 👀. Shapes, colors, and numbers are all around us—let’s see if you can spot them correctly! I'm cheering for you!",
  ],
  npcNames: ["Eva", "Eva"],
  npcImages: [
    { image: require("../../../../assets/eva/eva-love.png"), width: 260, height: 400 },
    { image: require("../../../../assets/eva/eva-happy.png"), width: 430, height: 470 },
  ],
};

const practiceMediumCompletionNpc = {
  name: "Eva",
  image: require("../../../../assets/eva/eva-excited.png")
};

const PracticeMediumScreen = () => {
  const navigation = useNavigation(); 

  return (
    <GameFlows
      backgroundImg={practiceMediumBg}
      DialogComponent={(props) => <PregameDialog {...props} dialogData={practiceMediumDialogData} />}
      CountdownComponent={Countdown}
      GameComponent={PracticeMedium}
      navigation={navigation} 
      StageCompletionComponent={(props) => (
        <StageCompletion 
          {...props} 
          dialoguesData={PracticeMediumDialogues} 
          completionNpc={practiceMediumCompletionNpc} 
          navigation={navigation} 
        />
      )}
    />
  );
};
export default PracticeMediumScreen;
