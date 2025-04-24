//ChallengeShape.tsx
import React, { useEffect, useState } from "react";
import { BaseGame, CategoryItem } from "../../ChallBaseGame";

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
  {
    name: "Rectangle",
    image: require("../../../../../assets/shapes/rectangle.png"),
  },
  {
    name: "Triangle",
    image: require("../../../../../assets/shapes/triangle.png"),
  },
  { name: "Square", image: require("../../../../../assets/shapes/square.png") },
  { name: "Circle", image: require("../../../../../assets/shapes/circle.png") },
  { name: "Circle", image: require("../../../../../assets/shapes/circle.png") },
];

// Define Frame Types
export const FrameType = {
  INTRODUCTION: "introduction",
  QUESTION: "question",
  CORRECT_ANSWER: "correctAnswer",
  INCORRECT_ANSWER: "incorrectAnswer",
};

// Define Game Flow with Backgrounds and Correct/Incorrect Frames
const storyScenes = {
  round1: [
    {
      type: FrameType.INTRODUCTION,
      background: bgIntro,
      character: "EVA",
      dialogues: ["Now where should I begin?"],
    },
    {
      type: FrameType.QUESTION,
      background: bgIntro,
      character: "EVA",
      dialogues: ["What shape is this?"],
    },
    {
      type: FrameType.CORRECT_ANSWER,
      background: correctBg,
      character: "EVA",
      dialogues: [
        "Gee, thanks for helping me find a good stone to stand on to.",
      ],
    },
    {
      type: FrameType.INCORRECT_ANSWER,
      background: incorrectBg,
      character: "EVA",
      dialogues: ["That scares me, let's be careful next time."],
    },
  ],
  round2: [
    {
      type: FrameType.INTRODUCTION,
      background: bgIntro,
      character: "EVA",
      dialogues: ["Which stone should I pick next?"],
    },
    {
      type: FrameType.QUESTION,
      background: bgIntro,
      character: "EVA",
      dialogues: ["What shape is this?"],
    },
    {
      type: FrameType.CORRECT_ANSWER,
      background: correctBg,
      character: "EVA",
      dialogues: [
        "Gee, thanks for helping me find a good stone to stand on to.",
      ],
    },
    {
      type: FrameType.INCORRECT_ANSWER,
      background: incorrectBg,
      character: "EVA",
      dialogues: ["Oh my that's dangerous, let's be cautious."],
    },
  ],
  round3: [
    {
      type: FrameType.INTRODUCTION,
      background: bgIntro,
      character: "EVA",
      dialogues: ["Which stone should I pick next?"],
    },
    {
      type: FrameType.QUESTION,
      background: bgIntro,
      character: "EVA",
      dialogues: ["What shape is this?"],
    },
    {
      type: FrameType.CORRECT_ANSWER,
      background: correctBg,
      character: "EVA",
      dialogues: [
        "Gee, thanks for helping me find a good stone to stand on to.",
      ],
    },
    {
      type: FrameType.INCORRECT_ANSWER,
      background: incorrectBg,
      character: "EVA",
      dialogues: ["Oh my that's dangerous, let's be cautious."],
    },
  ],
  round4: [
    {
      type: FrameType.INTRODUCTION,
      background: bgIntro,
      character: "EVA",
      dialogues: ["Which stone should I pick next?"],
    },
    {
      type: FrameType.QUESTION,
      background: bgIntro,
      character: "EVA",
      dialogues: ["What shape is this?"],
    },
    {
      type: FrameType.CORRECT_ANSWER,
      background: correctBg,
      character: "EVA",
      dialogues: [
        "Gee, thanks for helping me find a good stone to stand on to.",
      ],
    },
    {
      type: FrameType.INCORRECT_ANSWER,
      background: incorrectBg,
      character: "EVA",
      dialogues: ["Oh my that's dangerous, let's be cautious."],
    },
  ],
  round5: [
    {
      type: FrameType.INTRODUCTION,
      background: outro,
      character: "EVA",
      dialogues: [
        "Yeyyy, I think we’re almost at the edge of the river. Help me one last time, will you?",
      ],
    },
    {
      type: FrameType.QUESTION,
      background: outro,
      character: "EVA",
      dialogues: ["What shape is this?"],
    },
    {
      type: FrameType.CORRECT_ANSWER,
      background: correctBg,
      character: "EVA",
      dialogues: [
        "Thank you. We crossed the river safely. I can see the lair but we have to pass through this forest first.",
      ],
    },
    {
      type: FrameType.INCORRECT_ANSWER,
      background: incorrectBg,
      character: "EVA",
      dialogues: [
        "Oh my I almost fell there... Luckily, I jumped to the next stone.",
      ],
    },
  ],
};

// Group all categories into one object
const categories = {
  shape: shapes,
};

interface BaseGameProps {
  onGameComplete: (
    time: number,
    score: number,
    currentCategoryType: string,
    rounds: CategoryItem[]
  ) => void;
  navigation: any;
  rounds: CategoryItem[];
  studentId: any;
  updatedRecommendations: any; // Add this line to handle the recommendations data
  onStateChange: (state: any) => void;
}

const ShapeGame: React.FC<BaseGameProps> = ({
  rounds,
  onGameComplete,
  navigation,
  studentId,
  updatedRecommendations,
  onStateChange,
}) => {
  const [currentCategoryType, setCurrentCategoryType] = useState<string>("");

  useEffect(() => {
    if (
      Array.isArray(rounds) &&
      rounds.length > 0 &&
      rounds[0] &&
      "type" in rounds[0]
    ) {
      setCurrentCategoryType(rounds[0].type as string); // 🚨 This is fine
    } else {
      setCurrentCategoryType(""); // Or null if you prefer
    }
  }, [rounds]);

  const handleGameComplete = (
    time: number,
    score: number,
    categoryType: string,
    rounds: CategoryItem[]
  ) => {
    console.log("🔍 Challenge Color Game received rounds:", rounds);
    // Fetch studentId from AsyncStorage
    if (!studentId) {
      console.log("❌ ERROR: Missing studentId before navigation!");
      return;
    }

    if (!rounds || !Array.isArray(rounds)) {
      console.log(
        "❌ ERROR: Rounds array is missing or invalid before navigation!",
        rounds
      );
      return;
    }
    onGameComplete(time, score, categoryType, rounds);
  };

  return (
    <BaseGame
      categories={categories}
      rounds={rounds} // ✅ Ensure `rounds` is explicitly used
      onGameComplete={handleGameComplete} // ✅ Use the modified function
      currentCategoryType={currentCategoryType} // ✅ Pass category type
      navigation={navigation}
      npcConfig={{
        idle: evaIdleImg,
        correct: evaCorrectImg,
        wrong: evaWrongImg,
        name: "Eva",
      }}
      storyScenes={storyScenes} // Pass storyScenes correctly
      dialogues={{ idle: [], correct: [], wrong: [] }}
      onStateChange={onStateChange}
      studentId={""}
    />
  );
};

export default ShapeGame;
