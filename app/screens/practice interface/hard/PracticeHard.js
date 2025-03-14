// PracticeHardScreen.js 
import React from "react";
import GameFlows from "../../../component/game/GameFlows";
import PregameDialog from "../../../component/game/PregameDialog";
import Countdown from "../../../component/countdown";
import PracticeHard from "../../../component/game/Practice/HardMode/PracticeHard";
import StageCompletion from "../../../component/stageCompletion";
import EvaDialouges from "../../../data/evaDialogues";
import { useNavigation } from '@react-navigation/native';


const practiceHardBg = require("../../../../assets/gameBackground/practice-hard-bg.png");

const practiceHardDialogData = {
  dialogues: [
    "Ah, this is the hardest level! This is where true adventurers prove their mastery. You'll need to think fast and stay sharp—shapes, colors, and numbers will appear in trickier ways! Can you handle it? Let’s find out! ⚡",
    "You're learning, but this practice won’t be easy! Pay close attention, trust your instincts, and give it your best shot. Only the sharpest minds can conquer this level! Let's see if you're up for it! 💡🔥",
  ],
  npcNames: ["Eva", "Eva"],
  npcImages: [
    { image: require("../../../../assets/eva/eva-loud.png"), width: 500, height: 400 },
    { image: require("../../../../assets/eva/eva-pointing.png"), width: 460, height: 470 },
  ],
    audioFiles: [
    [require('../../../../assets/voiceOver/eva/practiceHard/eva-hard-1.mp3')], 
    [require('../../../../assets/voiceOver/eva/practiceHard/eva-hard-2.mp3')], 
  ],
};

const practiceHardCompletionNpc = {
  name: "Eva",
  image: require("../../../../assets/eva/eva-excited.png")
};

const PracticeHardScreen = () => {
  const navigation = useNavigation(); 

  return (
    <GameFlows
      backgroundImg={practiceHardBg}
      DialogComponent={(props) => <PregameDialog {...props} dialogData={practiceHardDialogData} />}
      CountdownComponent={Countdown}
      GameComponent={PracticeHard}
      navigation={navigation} 
      StageCompletionComponent={(props) => (
        <StageCompletion 
          {...props} 
          dialoguesData={EvaDialouges} 
          completionNpc={practiceHardCompletionNpc} 
          navigation={navigation} 
        />
      )}
    />
  );
};
export default PracticeHardScreen;
