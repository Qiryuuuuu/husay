//ChallengeShape.tsx
import React from 'react';
import { BaseGame } from '../../ChallBaseGame';

// Import NPC images
const evaIdleImg = require("../../../../../assets/eva/eva-guess.png");
const evaCorrectImg = require("../../../../../assets/eva/eva-correct.png");
const evaWrongImg = require("../../../../../assets/eva/eva-wrong.png");

// Import Backgrounds for each round
const bgIntro = require("../../../../../assets/gameBackground/challenge/easy/default-easy.webp");
const correctBg = require("../../../../../assets/gameBackground/challenge/easy/correct-easy.webp");
const incorrectBg = require("../../../../../assets/gameBackground/challenge/easy/incorrect-easy.webp");
const outro = require("../../../../../assets/gameBackground/challenge/easy/outro-easy.webp");

// Import shapes
const shapes = [
  { name: "Rectangle", image: require("../../../../../assets/shapes/rectangle.png") },
  { name: "Triangle", image: require("../../../../../assets/shapes/triangle.png") },
  { name: "Square", image: require("../../../../../assets/shapes/square.png") },
  { name: "Circle", image: require("../../../../../assets/shapes/circle.png") }
];

// Define Frame Types
export const FrameType = {
  INTRODUCTION: "introduction",
  QUESTION: "question",
  CORRECT_ANSWER: "correctAnswer",
  INCORRECT_ANSWER: "incorrectAnswer"
};

// Define Game Flow with Backgrounds and Correct/Incorrect Frames
const storyScenes = {
  round1: [
    {
      type: FrameType.INTRODUCTION,
      background: bgIntro,
      character: "EVA",
      dialogues: ["Now where should I begin?"]
    },
    {
      type: FrameType.QUESTION,
      background: bgIntro,
      character: "EVA",
      dialogues: ["What shape is this?"]
    },
    {
      type: FrameType.CORRECT_ANSWER,
      background: correctBg,
      character: "EVA",
      dialogues: ["Gee, thanks for helping me find a good stone to stand on to."]
    },
    {
      type: FrameType.INCORRECT_ANSWER,
      background: incorrectBg,
      character: "EVA",
      dialogues: ["That scares me, let's be careful next time."]
    }
  ],
  round2: [
    {
      type: FrameType.INTRODUCTION,
      background: bgIntro,
      character: "EVA",
      dialogues: ["Which stone should I pick next?"]
    },
    {
      type: FrameType.QUESTION,
      background: bgIntro,
      character: "EVA",
      dialogues: ["What shape is this?"]
    },
    {
      type: FrameType.CORRECT_ANSWER,
      background: correctBg,
      character: "EVA",
      dialogues: ["Gee, thanks for helping me find a good stone to stand on to."]
    },
    {
      type: FrameType.INCORRECT_ANSWER,
      background: incorrectBg,
      character: "EVA",
      dialogues: ["Oh my that's dangerous, let's be cautious."]
    }
  ],
  round3: [
    {
      type: FrameType.INTRODUCTION,
      background: bgIntro,
      character: "EVA",
      dialogues: ["Which stone should I pick next?"]
    },
    {
      type: FrameType.QUESTION,
      background: bgIntro,
      character: "EVA",
      dialogues: ["What shape is this?"]
    },
    {
      type: FrameType.CORRECT_ANSWER,
      background: correctBg,
      character: "EVA",
      dialogues: ["Gee, thanks for helping me find a good stone to stand on to."]
    },
    {
      type: FrameType.INCORRECT_ANSWER,
      background: incorrectBg,
      character: "EVA",
      dialogues: ["Oh my that's dangerous, let's be cautious."]
    }
  ],
  round4: [
    {
      type: FrameType.INTRODUCTION,
      background: bgIntro,
      character: "EVA",
      dialogues: ["Which stone should I pick next?"]
    },
    {
      type: FrameType.QUESTION,
      background: bgIntro,
      character: "EVA",
      dialogues: ["What shape is this?"]
    },
    {
      type: FrameType.CORRECT_ANSWER,
      background: correctBg,
      character: "EVA",
      dialogues: ["Gee, thanks for helping me find a good stone to stand on to."]
    },
    {
      type: FrameType.INCORRECT_ANSWER,
      background: incorrectBg,
      character: "EVA",
      dialogues: ["Oh my that's dangerous, let's be cautious."]
    }
  ],
  round5: [
    {
      type: FrameType.INTRODUCTION,
      background: outro,
      character: "EVA",
      dialogues: ["Yeyyy, I think we’re almost at the edge of the river. Help me one last time, will you?"]
    },
    {
      type: FrameType.QUESTION,
      background: outro,
      character: "EVA",
      dialogues: ["What shape is this?"]
    },
    {
      type: FrameType.CORRECT_ANSWER,
      background: correctBg,
      character: "EVA",
      dialogues: ["Thank you. We crossed the river safely. I can see the lair but we have to pass through this forest first."]
    },
    {
      type: FrameType.INCORRECT_ANSWER,
      background: incorrectBg,
      character: "EVA",
      dialogues: ["Oh my I almost fell there... Luckily, I jumped to the next stone."]
    }
  ]
};

const ShapeGame = ({ studentId, onGameComplete, navigation, onStateChange }) => {
  return (
    <BaseGame
      studentId={studentId} 
      category="Shapes" 
      categories={{ Shapes: shapes }} 
      onGameComplete={(time, score) => { 
        console.log("✅ Game Complete Triggered in ChallengeShape.tsx!");
        onGameComplete(time, score, "Shapes", shapes[score]?.name, score); // ✅ Pass subject, element, and stars
      }}
      navigation={navigation}
      npcConfig={{
        idle: evaIdleImg,
        correct: evaCorrectImg,
        wrong: evaWrongImg,
        name: "Eva"
      }}
      storyScenes={storyScenes}
      dialogues={{ idle: [], correct: [], wrong: [] }}
      onStateChange={onStateChange}
      subject="Shapes" // ✅ Now passing a valid subject
      element="" // ✅ Will be set dynamically
      starsEarned={0} // ✅ Will be set dynamically
    />
  );
};

export default ShapeGame;