//ChallengeMedium.tsx
import React from "react";
import { BaseMediumGame } from "../../ChallMediumBase";
import dialogues from "../../../../data/evaDialogues";

// Import NPC (character) assets
const evaIdleImg = require("../../../../../assets/eva/eva-guess.png");
const evaCorrectImg = require("../../../../../assets/eva/eva-correct.png");
const evaWrongImg = require("../../../../../assets/eva/eva-wrong.png");

// Import scenario backgrounds for Round 1 (Pig)
const pigProblemBg = require("../../../../../assets/gameBackground/challenge/medium/scenario-1/pig-problem.webp");
const pigCorrectBg = require("../../../../../assets/gameBackground/challenge/medium/scenario-1/pig-correct.webp");
const pigIncorrectBg = require("../../../../../assets/gameBackground/challenge/medium/scenario-1/pig-incorrect.webp");
const pigSaveBg = require("../../../../../assets/gameBackground/challenge/medium/scenario-1/pig-save.webp");

// Import scenario backgrounds for Round 2 (Chicken)
const chickenProblem1Bg = require("../../../../../assets/gameBackground/challenge/medium/scenario-2/chicken-problem-1.webp");
const chickenProblem2Bg = require("../../../../../assets/gameBackground/challenge/medium/scenario-2/chicken-problem-2.webp");
const chickenCorrectBg = require("../../../../../assets/gameBackground/challenge/medium/scenario-2/chicken-correct.webp");
const chickenIncorrectBg = require("../../../../../assets/gameBackground/challenge/medium/scenario-2/chicken-incorrect.webp");
const chickenSaveBg = require("../../../../../assets/gameBackground/challenge/medium/scenario-2/chicken-save.webp");

// Import scenario backgrounds for Round 3 (Cow)
const cowProblemBg = require("../../../../../assets/gameBackground/challenge/medium/scenario-3/cow-problem.webp");
const cowCorrectBg = require("../../../../../assets/gameBackground/challenge/medium/scenario-3/cow-correct.webp");
const cowIncorrectBg = require("../../../../../assets/gameBackground/challenge/medium/scenario-3/cow-incorrect.webp");

// Import scenario backgrounds for Round 4 (Dog)
const dogProblem1Bg = require("../../../../../assets/gameBackground/challenge/medium/scenario-4/dog-problem-1.webp");
const dogProblem2Bg = require("../../../../../assets/gameBackground/challenge/medium/scenario-4/dog-problem-2.webp");
const dogCorrectBg = require("../../../../../assets/gameBackground/challenge/medium/scenario-4/dog-correct.webp");
const dogIncorrectBg = require("../../../../../assets/gameBackground/challenge/medium/scenario-4/dog-incorrect.webp");

// Import scenario backgrounds for Round 5 (Cat)
const catProblemBg = require("../../../../../assets/gameBackground/challenge/medium/scenario-5/cat-problem.webp");
const catCorrectBg = require("../../../../../assets/gameBackground/challenge/medium/scenario-5/cat-correct.webp");
const catIncorrectBg = require("../../../../../assets/gameBackground/challenge/medium/scenario-5/cat-incorrect.webp");
const catSaveBg = require("../../../../../assets/gameBackground/challenge/medium/scenario-5/cat-save.webp");

// outro
const outro = require("../../../../../assets/gameBackground/challenge/medium/outro/outro-bg.webp");

// Define frame types as constants
export const FrameType = {
  INTRODUCTION: "introduction",
  QUESTION: "question",
  CORRECT_ANSWER: "correctAnswer",
  INCORRECT_ANSWER: "incorrectAnswer",
  ANIMAL_REACTION: "animalReaction",
  FOLLOWING: "following",
};


// Story scenes configuration for all rounds
const storyScenes = {
  round1: [
    {
      type: FrameType.INTRODUCTION,
      background: pigProblemBg,
      character: "EVA",
      dialogues: [
        "What's that sound? Ohhh no, it's piggy! It looks trapped between those two tall trees. Will you help me free piggy? They say if you help someone, they might help you in return.",
      ],
      audio: [
        require("../../../../../assets/gameBackground/challenge/medium/audio/scenario-1/pig-introduction.mp3"),
        require("../../../../../assets/gameBackground/challenge/medium/audio/scenario-1/pig-introduction-continuation.mp3"),
      ]
    },
    {
      type: FrameType.QUESTION,
      background: pigProblemBg,
      character: "EVA",
      dialogues: ["[Show the question from the randomized shape, color, and numbers]"],
    },
    {
      type: FrameType.CORRECT_ANSWER,
      background: pigCorrectBg,
      character: "EVA",
      dialogues: [
        "Ohhh, silly me. Good thing I have grease! Heave-ho, heave-ho, heave-ho! I think we did it!",
      ],
    },
    {
      type: FrameType.INCORRECT_ANSWER,
      background: pigIncorrectBg,
      character: "EVA",
      dialogues: [
        "Hmm… I think that would hurt piggy. But at least we can try pulling him out.",
      ],
    },
    {
      type: FrameType.ANIMAL_REACTION,
      background: pigSaveBg,
      character: "PIG",
      dialogues: ["*oinks thankfully*"],
    },
    {
      type: FrameType.FOLLOWING,
      background: pigSaveBg,
      character: "EVA",
      dialogues: [
        "I believe it's leading us! Told ya—help someone, someone helps you. Let's follow it!",
      ],
      audio: [
        require("../../../../../assets/gameBackground/challenge/medium/audio/scenario-1/pig-completion.mp3"),
      ]
    },
  ],
  round2: [
    {
      type: FrameType.INTRODUCTION,
      background: chickenProblem1Bg,
      character: "PIG",
      dialogues: [
        "*oink oink* points towards the pond where a chicken is struggling to get out.",
      ],
    },
    {
      type: FrameType.INTRODUCTION,
      background: chickenProblem2Bg,
      character: "EVA",
      dialogues: [
        "But, chickens can swim even briefly.",
      ],
      audio: [
        require("../../../../../assets/gameBackground/challenge/medium/audio/scenario-2/chicken-introduction.mp3"),
      ]
    },
    {
      type: FrameType.INTRODUCTION,
      background: chickenProblem2Bg,
      character: "CHICKEN",
      dialogues: [
        "*caws weakly*",
      ],
    },
    {
      type: FrameType.INTRODUCTION,
      background: chickenProblem2Bg,
      character: "CHICKEN",
      dialogues: [
        "I think chicken doesn’t know how to swim. We should help him. I'm gonna find a stick where he can bite his beak.",
      ],
      audio: [
        require("../../../../../assets/gameBackground/challenge/medium/audio/scenario-2/chicken-introduction-continuation.mp3"),
      ]
    },
    {
      type: FrameType.QUESTION,
      background: chickenProblem2Bg,
      character: "EVA",
      dialogues: ["[Show the question from the randomized shape, color, and numbers]"],
    },
    {
      type: FrameType.CORRECT_ANSWER,
      background: chickenCorrectBg,
      character: "EVA",
      dialogues: [
        "Got it. It’s long enough. Come on, try and peck. *pecks successfully* Just hold on!",
      ],
    },
    {
      type: FrameType.INCORRECT_ANSWER,
      background: chickenIncorrectBg,
      character: "EVA",
      dialogues: ["It's too short. Nevermind, I believe I can fly!"],
    },
    {
      type: FrameType.ANIMAL_REACTION,
      background: chickenSaveBg,
      character: "CHICKEN",
      dialogues: ["*caws gratefully* *rubs against EVA* *joins the pig*"],
    },
    {
      type: FrameType.FOLLOWING,
      background: chickenSaveBg,
      character: "EVA",
      dialogues: ["I think they want to lead the way. Let’s follow our new friends!"],
      audio: [
        require("../../../../../assets/gameBackground/challenge/medium/audio/scenario-2/chicken-completion.mp3"),
      ]
    },
    
  ],
  round3: [
    {
      type: FrameType.INTRODUCTION,
      background: cowProblemBg,
      character: "COW",
      dialogues: [
        "*moo desperately* *one foot stuck in the mud*",
      ],
      audio: [
        require("../../../../../assets/gameBackground/challenge/medium/audio/scenario-3/cow-introduction.mp3"),
      ]
    },
    {
      type: FrameType.QUESTION,
      background: cowProblemBg,
      character: "EVA",
      dialogues: ["[Show the question from the randomized shape, color, and numbers]"],
    },
    {
      type: FrameType.CORRECT_ANSWER,
      background: cowCorrectBg,
      character: "EVA",
      dialogues: [
        "Come on guys; more power. Heave-ho, Heave-ho, Heave-ho, Heave-ho, Heave-hooooooo *pop* Whewwwww, it’s harder than I expected.",
      ],
    },
    {
      type: FrameType.INCORRECT_ANSWER,
      background: cowIncorrectBg,
      character: "EVA",
      dialogues: [
        "We’re a little too weak, aren’t we? Let’s pull harder. EVA, please help us!",
      ],
    },
    {
      type: FrameType.ANIMAL_REACTION,
      background: cowCorrectBg,
      character: "COW",
      dialogues: ["*moos agreeingly*"],
    },
    {
      type: FrameType.FOLLOWING,
      background: cowCorrectBg,
      character: "EVA",
      dialogues: ["Yee haw! Hi, cow! Wanna join us?"],
      audio: [
        require("../../../../../assets/gameBackground/challenge/medium/audio/scenario-3/cow-completion.mp3"),
      ]
    },
  ],
  round4: [
    {
      type: FrameType.INTRODUCTION,
      background: dogProblem1Bg,
      character: "EVA",
      dialogues: [
        "I just heard someone barking, But from where???",
      ],
      audio: [
        require("../../../../../assets/gameBackground/challenge/medium/audio/scenario-4/dog-introduction.mp3"),
      ]
    },
    {
      type: FrameType.INTRODUCTION,
      background: dogProblem2Bg,
      character: "COW, CHICKEN, and PIG",
      dialogues: [
        "*makes sounds and do movements that point towards the dog on top of the tree*",
      ],
    },
    {
      type: FrameType.INTRODUCTION,
      background: dogProblem2Bg,
      character: "EVA",
      dialogues: [
        "Where??? Ohhh, I see her now. Don’t worry, we will help you get down. Now, what can I do?",
      ],
      audio: [
        require("../../../../../assets/gameBackground/challenge/medium/audio/scenario-4/dog-introduction-continuation.mp3"),
      ]
    },
    {
      type: FrameType.QUESTION,
      background: dogProblem2Bg,
      character: "EVA",
      dialogues: ["[Show the question from the randomized shape, color, and numbers]"],
    },
    {
      type: FrameType.CORRECT_ANSWER,
      background: dogCorrectBg,
      character: "EVA",
      dialogues: [
        "Great. I remember now. I can extend my arms and legs.",
      ],
    },
    {
      type: FrameType.INCORRECT_ANSWER,
      background: dogIncorrectBg,
      character: "EVA",
      dialogues: [
        "Come on, EVA, think! Oh, he slowly slid down. Thankfully!",
      ],
    },
    {
      type: FrameType.ANIMAL_REACTION,
      background: dogCorrectBg,
      character: "DOG",
      dialogues: [
        "*wags tail vigorously* *barks loudly and gratefully*",
      ],
    },
    {
      type: FrameType.ANIMAL_REACTION,
      background: dogCorrectBg,
      character: "DOG",
      dialogues: [
        "Gee, I think we’re near the Inventor’s lair. I hope there’s no traps.",
      ],
      audio: [
        require("../../../../../assets/gameBackground/challenge/medium/audio/scenario-4/dog-introduction-continuation.mp3"),
      ]
    },
  ],
  round5: [
    {
      type: FrameType.INTRODUCTION,
      background: catProblemBg,
      character: "EVA",
      dialogues: [
        "Yeyyy, we’re near the lair but ohhh nuts. The bridge is cut. And there’s a cat on the other side. Good thing I have you guys here. Help me build a bridge. Chicken peck on the wood to see if it’s sturdy enough. Cow and Dog, help bring the wood over to me. Pig, help me manage my tools. As for me, I have a built-in toolbox. I will create a wooden bridge.",
        "*makes sound in agreement*",
      ],
      audio: [
        require("../../../../../assets/gameBackground/challenge/medium/audio/scenario-5/cat-introduction.mp3"),
        require("../../../../../assets/gameBackground/challenge/medium/audio/scenario-5/cat-introduction-continuation.mp3"),
      ]
    },
    {
      type: FrameType.QUESTION,
      background: catProblemBg,
      character: "EVA",
      dialogues: ["[Show the question from the randomized shape, color, and numbers]"],
    },
    {
      type: FrameType.CORRECT_ANSWER,
      background: catCorrectBg,
      character: "EVA",
      dialogues: [
        "Okayyy, just hold me steady. Then, success. Come on, kitty, pass over the bridge. Come here kitty, kitty. Pspspspspsps",
      ],
    },
    {
      type: FrameType.INCORRECT_ANSWER,
      background: catIncorrectBg,
      character: "EVA",
      dialogues: [
        "Woahhhh, I think I’m falling. Jump, kitty! Jump!",
      ],
    },
    {
      type: FrameType.ANIMAL_REACTION,
      background: catSaveBg,
      character: "CAT",
      dialogues: ["*meows in gratitude*"],
    },
    {
      type: FrameType.FOLLOWING,
      background: catSaveBg,
      character: "EVA",
      dialogues: ["Awwww, what a cutie."],
    },
  ],
  outro: [
    {
      type: FrameType.INTRODUCTION,
      background: outro,
      character: "EVA",
      dialogues: ["Gee, thanks. Would you like to join me and my friends after this in Techtopia?"],
      audio: [
        require("../../../../../assets/gameBackground/challenge/medium/audio/outro/outro-1.mp3"),
      ]
    },
    {
      type: FrameType.INTRODUCTION,
      background: outro,
      character: "COW",
      dialogues: ["We will accept your offer. Just make sure there’s delicious food. Hehe"],
      audio: [
        require("../../../../../assets/gameBackground/challenge/medium/audio/outro/outro-2.mp3"),
      ]
    },
    {
      type: FrameType.INTRODUCTION,
      background: outro,
      character: "EVA",
      dialogues: ["Of course, I think you and Amber would go along well. Alright friends, thanks for accompanying me, I promise I will return safely with my friends. "],
      audio: [
        require("../../../../../assets/gameBackground/challenge/medium/audio/outro/outro-3.mp3"),
      ]
    },
    {
      type: FrameType.INTRODUCTION,
      background: outro,
      character: "DOG",
      dialogues: ["Good luckkk!!! *Loudly and cute* "],
    },
  ]
};

// Define all the game objects
const shapes = [
  { name: "Rectangle", image: require("../../../../../assets/shapes/rectangle.png") },
  { name: "Triangle", image: require("../../../../../assets/shapes/triangle.png") },
  { name: "Square", image: require("../../../../../assets/shapes/square.png") },
  { name: "Circle", image: require("../../../../../assets/shapes/circle.png") },
];

const colors = [
  { name: "Red", image: require("../../../../../assets/color/red.png") },
  { name: "Yellow", image: require("../../../../../assets/color/yellow.png") },
  { name: "Green", image: require("../../../../../assets/color/green.png") },
  { name: "Blue", image: require("../../../../../assets/color/blue.png") },
  { name: "Gray", image: require("../../../../../assets/color/gray.png") },
  { name: "Black", image: require("../../../../../assets/color/black.png") },
  { name: "White", image: require("../../../../../assets/color/white.png") },
];

const numbers = [
  { name: "One", image: require("../../../../../assets/numbers/one.png") },
  { name: "Two", image: require("../../../../../assets/numbers/two.png") },
  { name: "Three", image: require("../../../../../assets/numbers/three.png") },
  { name: "Four", image: require("../../../../../assets/numbers/four.png") },
  { name: "Five", image: require("../../../../../assets/numbers/five.png") },
  { name: "Six", image: require("../../../../../assets/numbers/six.png") },
  { name: "Seven", image: require("../../../../../assets/numbers/seven.png") },
  { name: "Eight", image: require("../../../../../assets/numbers/eight.png") },
  { name: "Nine", image: require("../../../../../assets/numbers/nine.png") },
  { name: "Ten", image: require("../../../../../assets/numbers/ten.png") },
];

// Group all categories into one object
const categories = {
  shape: shapes,
  color: colors,
  number: numbers,
};

// NPC configuration
const npcConfig = {
  idle: evaIdleImg,
  correct: evaCorrectImg,
  wrong: evaWrongImg,
  name: "Eva",
};

interface ChallengeMediumGameProps {
  onGameComplete: (time: number, score: number) => void;
  navigation: any;
}

const ChallengeMediumGame: React.FC<ChallengeMediumGameProps> = ({ onGameComplete, navigation }) => {
  return (
    <BaseMediumGame
      categories={categories}
      onGameComplete={onGameComplete}
      navigation={navigation}
      npcConfig={npcConfig}
      dialogues={dialogues}
      numRounds={5}
      outro={outro}
      storyScenes={storyScenes}
    />
  );
};

export default ChallengeMediumGame;