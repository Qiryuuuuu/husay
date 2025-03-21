import React from "react";
import { BaseHardGame } from "../../ChallHardBaseGame";
import dialogues from "../../../../data/evaDialogues";
import figures from "../../../../data/hardQuestions";

// Import NPC (character) assets
const evaIdleImg = require("../../../../../assets/eva/eva-guess.png");
const evaCorrectImg = require("../../../../../assets/eva/eva-correct.png");
const evaWrongImg = require("../../../../../assets/eva/eva-wrong.png");

//Shane  
const shaneIdleImg = require("../../../../../assets/shane/shane-wrong.png");
//Dolor  
const dolorIdleImg = require("../../../../../assets/dolor/dolor-correct.png");
//Amber
const amberIdleImg = require("../../../../../assets/amber/amber-correct.png");
//Evil Inventor
const inventorIdleImg = require("../../../../../assets/inventor/inventor-idle.png");

//Combined characters
const shaneDolor = require("../../../../../assets/combineChar/shane-dolor.png");
const dolorAmber = require("../../../../../assets/combineChar/dolor-amber.png");
const evaShaneDolor = require("../../../../../assets/combineChar/eva-shane-dolor.png");
const shaneDolorAmber = require("../../../../../assets/combineChar/shane-dolor-amber.png");
const everyone = require("../../../../../assets/combineChar/everyone.png");



// shane the shape
const shaneProblem1Bg = require("../../../../../assets/gameBackground/challenge/hard/scenario-1/shape-problem-1.webp");
const shaneProblem2Bg = require("../../../../../assets/gameBackground/challenge/hard/scenario-1/shape-problem-2.webp");
const shaneCorrectBg = require("../../../../../assets/gameBackground/challenge/hard/scenario-1/shape-correct.webp");
const shaneIncorrectBg = require("../../../../../assets/gameBackground/challenge/hard/scenario-1/shape-incorrect.webp");

// dolor the color
const dolorProblemBg = require("../../../../../assets/gameBackground/challenge/hard/scenario-2/color-problem.webp");
const dolorCorrectBg = require("../../../../../assets/gameBackground/challenge/hard/scenario-2/color-correct.webp");
const dolorIncorrectBg = require("../../../../../assets/gameBackground/challenge/hard/scenario-2/color-incorrect.webp");

// amber the number
const amberProblem1Bg = require("../../../../../assets/gameBackground/challenge/hard/scenario-3/number-problem-1.webp");
const amberProblem2Bg = require("../../../../../assets/gameBackground/challenge/hard/scenario-3/number-problem-2.webp");
const amberCorrectBg = require("../../../../../assets/gameBackground/challenge/hard/scenario-3/number-correct.webp");
const amberIncorrectBg = require("../../../../../assets/gameBackground/challenge/hard/scenario-3/number-incorrect.webp");
const amberSaveBg = require("../../../../../assets/gameBackground/challenge/hard/scenario-3/number-save.webp");

// outro
const outro = require("../../../../../assets/gameBackground/challenge/hard/chall-hard-bg.webp");
const outro1 = require("../../../../../assets/gameBackground/challenge/hard/outro/outro-1.webp");
const outro2 = require("../../../../../assets/gameBackground/challenge/hard/outro/outro-2.webp");
const outro3 = require("../../../../../assets/gameBackground/challenge/hard/outro/outro-3.webp");


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
  // Shane's Rescue (Shape Questions) - Rounds 1-5
  round1: [
    {
      type: FrameType.INTRODUCTION,
      background: shaneProblem1Bg,
      character: "EVA",
      dialogues: ["*She saw Shane*"]
    },
    {
      type: FrameType.INTRODUCTION,
      background: shaneProblem2Bg,
      character: "EVA",
      dialogues: ["Shane, Shane, Shaneeeee—",],
    },
    {
      type: FrameType.INTRODUCTION,
      background: shaneProblem2Bg,
      character: "EVA",
      dialogues: [
      "I must do something. Think, EVA, think. pause",
      ],
      audio: [
      require("../../../../../assets/gameBackground/challenge/hard/audio/scenario-1/round-1-intro.mp3"),
      ]
    },
    {
      type: FrameType.INTRODUCTION,
      background: shaneProblem2Bg,
      character: "EVA",
      dialogues: [
      "I remember. Each of their memories are stored in me. If I installed them their memories from mine, I could wake them up. I’ll try.",
      ],
    },
    {
      type: FrameType.QUESTION,
      background: shaneProblem2Bg,
      character: "EVA",
      dialogues: ["Can you identify this shape?"]
    }
  ],
  round2: [
    {
      type: FrameType.QUESTION,
      background: shaneProblem2Bg,
      character: "EVA",
      dialogues: ["What shape is this one?"]
    }
  ],
  round3: [
    {
      type: FrameType.QUESTION,
      background: shaneProblem2Bg,
      character: "EVA",
      dialogues: ["And this shape?"]
    }
  ],
  round4: [
    {
      type: FrameType.QUESTION,
      background: shaneProblem2Bg,
      character: "EVA",
      dialogues: ["Which shape do you see here?"]
    }
  ],
  round5: [
    {
      type: FrameType.QUESTION,
      background: shaneProblem2Bg,
      character: "EVA",
      dialogues: ["Last shape question, what is it?"]
    },
    {
      type: FrameType.CORRECT_ANSWER,
      background: shaneCorrectBg,
      character: "EVA",
      dialogues: [
      "I think he’s waking up. Shane, Shane, Shaneeeee—come on, talk to me. ",
      ],
    },
    {
      type: FrameType.INCORRECT_ANSWER,
      background: shaneIncorrectBg,
      character: "EVA",
      dialogues: [
      "That's not it.",
      ],
    },
    {
      type: FrameType.FOLLOWING,
      background: shaneCorrectBg,
      character: "SHANE",
      dialogues: ["Whewwwww, that’s a good sleep. EVA, where am I??? Why are you crying?"],
      audio: [
      require("../../../../../assets/gameBackground/challenge/hard/audio/scenario-1/round-1-narration-1.mp3"),
      ]
    },
    {
      type: FrameType.FOLLOWING,
      background: shaneCorrectBg,
      character: "EVA",
      dialogues: ["still crying Waaaahhhh Shaneeeeee—I thought I lost you."],
      audio: [
      require("../../../../../assets/gameBackground/challenge/hard/audio/scenario-1/round-1-narration-2.mp3"),
      ]
    },
    {
      type: FrameType.FOLLOWING,
      background: shaneCorrectBg,
      character: "EVA",
      dialogues: ["The Evil Inventor got you three. You are the one that is captured first."],
      audio: [
      require("../../../../../assets/gameBackground/challenge/hard/audio/scenario-1/round-1-narration-3.mp3"),
      ]
    },
    {
      type: FrameType.FOLLOWING,
      background: shaneCorrectBg,
      character: "SHANE",
      dialogues: ["Really??? Why can’t I remember a thing? So, this is the Inventor’s lair? "],
    },
    {
      type: FrameType.FOLLOWING,
      background: shaneCorrectBg,
      character: "EVA",
      dialogues: ["Yes, and right now, I’m going to find Dolor and Amber. Say hi to my friend here."],
      audio: [
      require("../../../../../assets/gameBackground/challenge/hard/audio/scenario-1/round-1-narration-4.mp3"),
      ]
    },
    {
      type: FrameType.FOLLOWING,
      background: shaneCorrectBg,
      character: "SHANE",
      dialogues: ["Hiiii, thanks for taking good care of EVA. waves to the screen"],
      audio: [
      require("../../../../../assets/gameBackground/challenge/hard/audio/scenario-1/round-1-narration-5.mp3"),
      ]
    },
    {
      type: FrameType.FOLLOWING,
      background: shaneCorrectBg,
      character: "EVA",
      dialogues: ["Come on, we must save them. "],
    },
    {
      type: FrameType.FOLLOWING,
      background: shaneCorrectBg,
      character: "SHANE",
      dialogues: ["Right"],
    },
  ],

  // Dolor's Rescue (Color Questions) - Rounds 6-10
  round6: [
    {
      type: FrameType.INTRODUCTION,
      background: dolorProblemBg,
      character: "SHANE",
      dialogues: [
      "There, I see Dolor. ",
      ],
    },
    {
      type: FrameType.INTRODUCTION,
      background: dolorProblemBg,
      character: "EVA",
      dialogues: [
      "Where?!!!",
      ],
      audio: [
      require("../../../../../assets/gameBackground/challenge/hard/audio/scenario-2/color-intro.mp3"),
      ]
    },
    {
      type: FrameType.INTRODUCTION,
      background: dolorProblemBg,
      character: "SHANE",
      dialogues: [
      "There. In that room.",
      ],
      audio: [
      require("../../../../../assets/gameBackground/challenge/hard/audio/scenario-2/color-intro-1.mp3"),
      ]
    },
    {
      type: FrameType.INTRODUCTION,
      background: dolorProblemBg,
      character: "EVA",
      dialogues: [
      "Thank goodness. Now, I’ll just restore your memories that’s within me.",
      ],
      audio: [
      require("../../../../../assets/gameBackground/challenge/hard/audio/scenario-2/color-intro-2.mp3"),
      ]
    },
    {
      type: FrameType.QUESTION,
      background: dolorProblemBg,
      character: "EVA",
      dialogues: ["What color do you see?"]
    }
  ],
  round7: [
    {
      type: FrameType.QUESTION,
      background: dolorProblemBg,
      character: "EVA",
      dialogues: ["Can you identify this color?"]
    }
  ],
  round8: [
    {
      type: FrameType.QUESTION,
      background: dolorProblemBg,
      character: "EVA",
      dialogues: ["What color is shown here?"]
    }
  ],
  round9: [
    {
      type: FrameType.QUESTION,
      background: dolorProblemBg,
      character: "EVA",
      dialogues: ["Which color do you see?"]
    }
  ],
  round10: [
    {
      type: FrameType.QUESTION,
      background: dolorProblemBg,
      character: "EVA",
      dialogues: ["Final color question, what is it?"]
    },
    {
      type: FrameType.CORRECT_ANSWER,
      background: dolorCorrectBg,
      character: "EVA",
      dialogues: [
      "I think she’s waking up. Dolor, can you hear us?",
      ],
    },
    {
      type: FrameType.INCORRECT_ANSWER,
      background: dolorIncorrectBg,
      character: "EVA",
      dialogues: [
      "That’s not it.",
      ],
    },
    {
      type: FrameType.FOLLOWING,
      background: dolorCorrectBg,
      character: "DOLOR",
      dialogues: ["Uhmmm, I’m kinda groggy. Where are we?"],
      audio: [
      require("../../../../../assets/gameBackground/challenge/hard/audio/scenario-2/color-narration-1.mp3"),
      ]
    },
    {
      type: FrameType.FOLLOWING,
      background: dolorCorrectBg,
      character: "EVA",
      dialogues: ["Ohhh, Dolorrr—thank goodness. "],
      audio: [
      require("../../../../../assets/gameBackground/challenge/hard/audio/scenario-2/color-narration-2.mp3"),
      ]
    },
    {
      type: FrameType.FOLLOWING,
      background: dolorCorrectBg,
      character: "DOLOR",
      dialogues: [
      "Why? What happened?",
      ],
    },
    {
      type: FrameType.FOLLOWING,
      background: dolorCorrectBg,
      character: "SHANE",
      dialogues: [
      "She said we got captured.",
      ],
    },
    {
      type: FrameType.FOLLOWING,
      background: dolorCorrectBg,
      character: "DOLOR",
      dialogues: ["Really? I don’t remember."],
      audio: [
      require("../../../../../assets/gameBackground/challenge/hard/audio/scenario-2/color-narration-3.mp3"),
      ]
    },
    {
      type: FrameType.FOLLOWING,
      background: dolorCorrectBg,
      character: "EVA",
      dialogues: [
      "It’s because your memories were deleted. I just restored your recent memories with me.",
      ],
    },
    {
      type: FrameType.FOLLOWING,
      background: dolorCorrectBg,
      character: "SHANE & DOLOR",
      dialogues: [
      "What?!!! That means Techtopia became vulnerable.",
      ],
    },
    {
      type: FrameType.FOLLOWING,
      background: dolorCorrectBg,
      character: "EVA",
      dialogues: [
      " It was. The kids gave me courage to rescue you. ",
      ],
    },
    {
      type: FrameType.FOLLOWING,
      background: dolorCorrectBg,
      character: "SHANE & DOLOR",
      dialogues: [
      "Oh my stars. That's why you’re crying.",
      ],
    },
    {
      type: FrameType.FOLLOWING,
      background: dolorCorrectBg,
      character: "EVA",
      dialogues: [
      "Come on, we must save Amber.",
      ],
    },
  ],

  // Amber's Rescue (Number Question) - Round 11
  round11: [
    {
      type: FrameType.INTRODUCTION,
      background: amberProblem1Bg,
      character: "DOLOR",
      dialogues: [
      "Shane—EVA—I saw Amber. She’s locked up in this room. ",
    ],
      audio: [
      require("../../../../../assets/gameBackground/challenge/hard/audio/scenario-3/amber-intro.mp3"),
    ]
    },
    {
      type: FrameType.INTRODUCTION,
      background: amberProblem1Bg,
      character: "SHANE",
      dialogues: [" Now, EVA, you know how to pick locks, right?"],
    },
    {
      type: FrameType.INTRODUCTION,
      background: amberProblem1Bg,
      character: "EVA",
      dialogues: ["Yes, let me handle this"],
    },
    {
      type: FrameType.INTRODUCTION,
      background: amberProblem2Bg,
      character: "EVA",
      dialogues: ["I'm in."],
    },
    {
      type: FrameType.INTRODUCTION,
      background: amberProblem2Bg,
      character: "SHANE & DOLOR",
      dialogues: ["Ohhhh no."],
    },
    {
      type: FrameType.INTRODUCTION,
      background: amberProblem2Bg,
      character: "DOLOR",
      dialogues: ["Does this mean her memories got deleted too? "],
    },
    {
      type: FrameType.INTRODUCTION,
      background: amberProblem2Bg,
      character: "EVA",
      dialogues: ["Unfortunately, yes. Fortunately, I know how to restore it."],
    },
    {
      type: FrameType.INTRODUCTION,
      background: amberProblem2Bg,
      character: "SHANE",
      dialogues: ["Please do."],
    },
    {
      type: FrameType.QUESTION,
      background: amberProblem2Bg,
      character: "EVA",
      dialogues: ["Lastly, how many shapes do you see?"]
    },
    {
      type: FrameType.CORRECT_ANSWER,
      background: amberCorrectBg,
      character: "EVA",
      dialogues: ["I think she’s waking up. Amber, there’s food in front of you."],
    },
    {
      type: FrameType.INCORRECT_ANSWER,
      background: amberIncorrectBg,
      character: "EVA",
      dialogues: ["That's not it."],
    },
    {
      type: FrameType.FOLLOWING,
      background: amberSaveBg,
      character: "AMBER",
      dialogues: ["Good morning. Where’s the food?"],
      audio: [
      require("../../../../../assets/gameBackground/challenge/hard/audio/scenario-3/amber-narrative-1.mp3"),
    ]
    },
    {
      type: FrameType.FOLLOWING,
      background: amberSaveBg,
      character: "EVA, SHANE, & DOLOR",
      dialogues: ["Waaaahhhhh, Amber. You’re alright."],
    },
    {
      type: FrameType.FOLLOWING,
      background: amberSaveBg,
      character: "AMBER",
      dialogues: ["Wahhhh. What happened? Where’s the food?"],
    },
    {
      type: FrameType.FOLLOWING,
      background: amberSaveBg,
      character: "SHANE",
      dialogues: ["There’s no food, silly. We got captured. "],
    },
    {
      type: FrameType.FOLLOWING,
      background: amberSaveBg,
      character: "AMBER",
      dialogues: ["Really?"],
    },
    {
      type: FrameType.FOLLOWING,
      background: amberSaveBg,
      character: "DOLOR",
      dialogues: ["Apparently, yes. EVA here saved us.?"],
    },
    {
      type: FrameType.FOLLOWING,
      background: amberSaveBg,
      character: "EVA",
      dialogues: ["You’re welcome. This is far from over. We must capture the Evil Inventor so that he can stop bugging us. Are you with me?"],
    },
    {
      type: FrameType.FOLLOWING,
      background: amberSaveBg,
      character: "DOLOR, SHANE, & AMBER",
      dialogues: ["Yes!"],
    },
  ],
  outro: [
    {
      type: FrameType.INTRODUCTION,
      background: outro,
      character: "EVIL INVENTOR",
      dialogues: ["So, you somehow restored their memories. Impressive."],
      audio: [
        require("../../../../../assets/gameBackground/challenge/hard/audio/outro/outro-1.mp3"),
      ]
    },
    {
      type: FrameType.INTRODUCTION,
      background: outro,
      character: "EVA",
      dialogues: ["Yes. And now, it’s payback time."],
      audio: [
        require("../../../../../assets/gameBackground/challenge/hard/audio/outro/outro-2.mp3"),
      ]
    },
    {
      type: FrameType.INTRODUCTION,
      background: outro,
      character: "EVIL INVENTOR",
      dialogues: ["Uhhh uhhh uhhh. No. *activates magnet* I think you think I have no plan. My plan was to capture all of you. Why do you think I’m here in this room?"],
      audio: [
        require("../../../../../assets/gameBackground/challenge/hard/audio/outro/outro-3.mp3"),
      ]
    },
    {
      type: FrameType.INTRODUCTION,
      background: outro,
      character: "EVA, SHANE, DOLOR, & AMBER",
      dialogues: ["Why?"],
    },
    {
      type: FrameType.INTRODUCTION,
      background: outro1,
      character: "EVIL INVENTOR",
      dialogues: ["Because!!!—*activates the room’s magnet* this whole room is a magnet, and you all are a bunch of cheap metal. Wahahahahahahahaha. My plan has worked. I now have Techtopia in my hands. Now, let me re-delete all of your memories."],
      audio: [
        require("../../../../../assets/gameBackground/challenge/hard/audio/outro/outro-4.mp3"),
      ]
    },
    {
      type: FrameType.INTRODUCTION,
      background: outro1,
      character: "AMBER",
      dialogues: ["Noooo. We must do something."],
      audio: [
        require("../../../../../assets/gameBackground/challenge/hard/audio/outro/outro-5.mp3"),
      ]
    },
    {
      type: FrameType.INTRODUCTION,
      background: outro1,
      character: "EVA",
      dialogues: ["I won’t give up. I think I have an idea. Let me think."],
      audio: [
        require("../../../../../assets/gameBackground/challenge/hard/audio/outro/outro-6.mp3"),
      ]
    },
    {
      type: FrameType.INTRODUCTION,
      background: outro1,
      character: "EVA",
      dialogues: ["I know. Make yourself hot, like you have the worst fever ever."],
      audio: [
        require("../../../../../assets/gameBackground/challenge/hard/audio/outro/outro-7.mp3"),
      ]
    },
    {
      type: FrameType.INTRODUCTION,
      background: outro1,
      character: "DOLOR",
      dialogues: ["Why???"],
      audio: [
        require("../../../../../assets/gameBackground/challenge/hard/audio/outro/outro-8.mp3"),
      ]
    },
    {
      type: FrameType.INTRODUCTION,
      background: outro1,
      character: "SHANE",
      dialogues: ["Because heat weakens magnets. EVA you’re a genius."],
      audio: [
        require("../../../../../assets/gameBackground/challenge/hard/audio/outro/outro-9.mp3"),
      ]
    },
    {
      type: FrameType.INTRODUCTION,
      background: outro1,
      character: "EVA",
      dialogues: ["Just do it before he catches wind of what we’re doing."],
      audio: [
        require("../../../../../assets/gameBackground/challenge/hard/audio/outro/outro-10.mp3"),
      ]
    },
    {
      type: FrameType.INTRODUCTION,
      background: outro1,
      character: "EVA, SHANE, DOLOR, & AMBER",
      dialogues: ["Okay."],
    },
    {
      type: FrameType.INTRODUCTION,
      background: outro1,
      character: "EVIL INVENTOR",
      dialogues: ["Why is it so hot here? *turns back* Wha—what. How did you break free?"],
      audio: [
        require("../../../../../assets/gameBackground/challenge/hard/audio/outro/outro-11.mp3"),
      ]
    },
    {
      type: FrameType.INTRODUCTION,
      background: outro1,
      character: "AMBER",
      dialogues: ["I think you’re forgetting that we’re robots. We have the knowledge of those before us. Heat weakens magnets."],
      audio: [
        require("../../../../../assets/gameBackground/challenge/hard/audio/outro/outro-12.mp3"),
      ]
    },
    {
      type: FrameType.INTRODUCTION,
      background: outro1,
      character: "SHANE",
      dialogues: ["Heyyyy, that’s my line but yeah. You’re a goner."],
      audio: [
        require("../../../../../assets/gameBackground/challenge/hard/audio/outro/outro-13.mp3"),
      ]
    },
    {
      type: FrameType.INTRODUCTION,
      background: outro1,
      character: "EVA",
      dialogues: ["Net him."],
      audio: [
        require("../../../../../assets/gameBackground/challenge/hard/audio/outro/outro-14.mp3"),
      ]
    },
    {
      type: FrameType.INTRODUCTION,
      background: outro1,
      character: "EVIL INVENTOR",
      dialogues: ["Wahhhhh. What are you gonna do with me?"],
      audio: [
        require("../../../../../assets/gameBackground/challenge/hard/audio/outro/outro-15.mp3"),
      ]
    },
    {
      type: FrameType.INTRODUCTION,
      background: outro2,
      character: "DOLOR",
      dialogues: ["We’re sending you off to the sky."],
      audio: [
        require("../../../../../assets/gameBackground/challenge/hard/audio/outro/outro-16.mp3"),
      ]
    },
    {
      type: FrameType.INTRODUCTION,
      background: outro2,
      character: "EVIL INVENTOR",
      dialogues: ["Whattttt—"],
      audio: [
        require("../../../../../assets/gameBackground/challenge/hard/audio/outro/outro-17.mp3"),
      ]
    },
    {
      type: FrameType.INTRODUCTION,
      background: outro2,
      character: "SHANE",
      dialogues: ["Yeahhh. You will become one of the stars. Hehehehehe."],
      audio: [
        require("../../../../../assets/gameBackground/challenge/hard/audio/outro/outro-18.mp3"),
      ]
    },
    {
      type: FrameType.INTRODUCTION,
      background: outro2,
      character: "AMBER",
      dialogues: ["Just slow. It’s only a hot air balloon. Sorry."],
      audio: [
        require("../../../../../assets/gameBackground/challenge/hard/audio/outro/outro-19.mp3"),
      ]
    },
    {
      type: FrameType.INTRODUCTION,
      background: outro2,
      character: "EVA",
      dialogues: ["Send him off."],
      audio: [
        require("../../../../../assets/gameBackground/challenge/hard/audio/outro/outro-20.mp3"),
      ]
    },
    {
      type: FrameType.INTRODUCTION,
      background: outro,
      character: "DOLOR & AMBER",
      dialogues: ["Yeyyy!!!"],
    },
    {
      type: FrameType.INTRODUCTION,
      background: outro,
      character: "AMBER",
      dialogues: ["I’m hungryyy. Can we go back now???"],
      audio: [
        require("../../../../../assets/gameBackground/challenge/hard/audio/outro/outro-21.mp3"),
      ]
    },
    {
      type: FrameType.INTRODUCTION,
      background: outro,
      character: "SHANE",
      dialogues: ["You and your food. But yeahhh, can we go back now? I wanna play with the kids."],
      audio: [
        require("../../../../../assets/gameBackground/challenge/hard/audio/outro/outro-22.mp3"),
      ]
    },
    {
      type: FrameType.INTRODUCTION,
      background: outro,
      character: "EVA",
      dialogues: ["Sureee. Let's go back home. We have some animal friends coming over. It’s a feast."],
      audio: [
        require("../../../../../assets/gameBackground/challenge/hard/audio/outro/outro-23.mp3"),
      ]
    },
    {
      type: FrameType.INTRODUCTION,
      background: outro,
      character: "DOLOR",
      dialogues: ["Ohhhh, I must—no, we must prepare."],
      audio: [
        require("../../../../../assets/gameBackground/challenge/hard/audio/outro/outro-24.mp3"),
      ]
    },
    {
      type: FrameType.INTRODUCTION,
      background: outro,
      character: "EVA, SHANE, DOLOR, & AMBER",
      dialogues: ["Yeahhhhh."],
    },
    {
      type: FrameType.INTRODUCTION,
      background: outro,
      character: "EVA",
      dialogues: ["Come on. Let’s go back to Techtopia."],
      audio: [
        require("../../../../../assets/gameBackground/challenge/hard/audio/outro/outro-25.mp3"),
      ]
    },
    {
      type: FrameType.INTRODUCTION,
      background: outro3,
      character: "EVA",
      dialogues: ["Thank you my friend for reuniting me with my friends. If you got time, wanna join us here in Techtopia?"],
      audio: [
        require("../../../../../assets/gameBackground/challenge/hard/audio/outro/outro-26.mp3"),
      ]
    },
  ]
};

// NPC configuration
const npcConfig = {
  EVA: {
    idle: evaIdleImg,
    correct: evaCorrectImg,
    wrong: evaWrongImg,
    name: "Eva",
  },
  SHANE: {
    idle: shaneIdleImg,
    name: "Shane",
  },
  DOLOR: {
    idle: dolorIdleImg,
    name: "Dolor",
  },
  AMBER: {
    idle: amberIdleImg,
    name: "Amber",
  },
  "EVIL INVENTOR": {
    idle: inventorIdleImg,
    name: "Evil Inventor",
  },
  "SHANE & DOLOR": {
    idle: shaneDolor,
    name: "SHANE & DOLOR",
  },
  "DOLOR & AMBER": {
    idle: dolorAmber,
    name: "DOLOR & AMBER",
  },
  "EVA, SHANE, & DOLOR": {
    idle: evaShaneDolor,
    name: "EVA, SHANE, & DOLOR",
  },
  "DOLOR, SHANE, & AMBER": {
    idle: shaneDolorAmber,
    name: "DOLOR, SHANE, & AMBER",
  },
  "EVA, SHANE, DOLOR, & AMBER": {
    idle: everyone,
    name: "EVA, SHANE, DOLOR, & AMBER",
  },
};

interface ChallengeHardGameProps {
  onGameComplete: (time: number, score: number) => void;
  navigation: any;
}

const formattedFigures = {
  house: figures.houseFigure,
  car: figures.carFigure,
  rocket: figures.rocketFigure,
  flower: figures.flowerFigure,
  robot: figures.robotFigure,
};

const ChallengeHardGame: React.FC<ChallengeHardGameProps> = ({ onGameComplete, navigation }) => {
  return (
    <BaseHardGame
      figures={formattedFigures}
      onGameComplete={onGameComplete}
      navigation={navigation}
      npcConfig={npcConfig}
      dialogues={dialogues}
      numShapeRounds={5}
      numColorRounds={5}
      includeCountRound={true}
      numRounds={11}
      outro={outro}
      storyScenes={storyScenes}
    />
  );
};

export default ChallengeHardGame;