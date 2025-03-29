// ChallengeHard.js
import React, { useEffect, useState } from "react";
import GameFlows from "../../../component/game/GameFlowChallenge";
import PregameDialog from "../../../component/game/PregameDialog";
import Countdown from "../../../component/countdown";
import HardGame from "../../../component/game/challenge/HardMode/ChallengeHard";
import StageCompletion from "../../../component/stageCompletion";
import EvaDialouges from "../../../data/evaDialogues";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { playMusic, stopMusic } from "../../../component/audio/MusicManager";

const bg = require("../../../../assets/gameBackground/challenge/hard/chall-hard-bg.webp");

const DialogData = {
  dialogues: [
    "Waaahhh",
    "*laughs menacingly* WAHAHAHAHAHAHAA welcome. You will not foil my plan. I already have your friend’s memories erased. There’s no turning back.",
    "Noooo—Shane, Dolor, Amber. I have to save them.",
  ],
  npcNames: ["Eva", "Evil Inventor", "Eva"],
  npcImages: [
    {
      image: require("../../../../assets/eva/eva-sad.png"),
      width: 344,
      height: 566,
    },
    {
      image: require("../../../../assets/inventor/inventor-laughing.png"),
      width: 600,
      height: 500,
    },
    {
      image: require("../../../../assets/eva/eva-sad.png"),
      width: 344,
      height: 566,
    },
  ],
  audioFiles: [
    [
      require("../../../../assets/gameBackground/challenge/hard/audio/pregame/pregame-1.mp3"),
    ],
    [
      require("../../../../assets/gameBackground/challenge/hard/audio/pregame/pregame-2.mp3"),
    ],
    [
      require("../../../../assets/gameBackground/challenge/hard/audio/pregame/pregame-3.mp3"),
    ],
  ],
};

const CompletionNpc = {
  name: "Eva",
  image: require("../../../../assets/eva/eva-excited.png"),
};

const customCompletionDialog = [
  "I'm truly grateful for your help! We have now successfully rescued our friends and defeated the Evil Inventor. If you ever need help, you're always welcome here in Techtopia.",
];

const HardModeScreen = ({ route }) => {
  const navigation = useNavigation();
  const [scores, setScores] = useState(null);

  const [gameFinished, setGameFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const [finalTimeTaken, setFinalTimeTaken] = useState(null);
  const [finalSetGamePhase, setFinalSetGamePhase] = useState(() => null);
  const [updatedRecommendations, setUpdatedRecommendations] = useState(null);

  const { studentId, rounds, currentCategoryType } = route.params || {};
  const [gameRounds, setGameRounds] = useState(rounds || []);

  console.log("📦 Received structuredRounds in HardModeScreen:", rounds);
  console.log("🔄 Defaulting gameRounds to structuredRounds:", rounds || []);

  useEffect(() => {
    playMusic("hardBg");
    return () => stopMusic();
  }, []);

  useEffect(() => {
    if (rounds && rounds.length > 0) {
      console.log("🔄 ChallengeHard.js receiving structuredRounds...");
      setGameRounds((prevRounds) => {
        console.log("✅ Updating gameRounds from structuredRounds:", rounds);
        return [...rounds]; // Ensure new rounds overwrite previous state
      });
    } else {
      console.log("⚠️ WARNING: Received empty structuredRounds!");
    }
  }, [rounds]);

  console.log("Challenge Hard received studentID:", studentId);

  if (!studentId) {
    console.error("❌ ERROR: studentId is undefined!");
  }

  const handleGameComplete = async (
    timeTaken,
    score,
    structuredRounds,
    setGamePhase
  ) => {
    console.log("🚀 Submitting game results...");
    console.log("📌 Student ID:", studentId);
    console.log("🎯 Score:", score);
    console.log("⏳ Time Taken:", timeTaken);

    if (!studentId) {
      console.error("❌ ERROR: studentId is missing!");
      return;
    }

    if (!structuredRounds || structuredRounds.length === 0) {
      console.error(
        "❌ ERROR: structuredRounds is empty before submission! Check data flow."
      );
      return;
    }

    console.log(
      "✅ Final structuredRounds before submission:",
      structuredRounds
    );

    const correctAnswers = structuredRounds.filter(
      (round) => round.correct === true
    ).length;
    console.log("🟢 Counted Correct Answers:", correctAnswers);

    const incorrectAnswers = structuredRounds.filter(
      (round) => !round.correct
    ).length;

    console.log("✅ Final Incorrect Count:", incorrectAnswers);

    if (score != correctAnswers) {
      console.log("❌ ERROR: Score does not match correct answers count!");
    }

    const totalRounds = structuredRounds.length;
    const mistakes = incorrectAnswers;
    const stars = mistakes === 0 ? 3 : mistakes <= 3 ? 2 : 1;
    console.log("🌟 Stars earned:", stars);

    // ✅ Initialize scoresByCategory to prevent missing categories
    const scoresByCategory = { shape: {}, color: {}, number: {} };

    structuredRounds.forEach((round) => {
      const category = round.type;
      const subcategory = round.name;

      if (!scoresByCategory[category]) {
        scoresByCategory[category] = {};
      }
      if (!scoresByCategory[category][subcategory]) {
        scoresByCategory[category][subcategory] = { correct: 0, incorrect: 0 };
      }

      if (round.correct) {
        scoresByCategory[category][subcategory].correct += 1;
      } else {
        scoresByCategory[category][subcategory].incorrect += 1;
      }
    });

    console.log("📊 Scores structured by category:", scoresByCategory);

    try {
      console.log("🌍 Sending data to API...");
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        console.error("❌ ERROR: No auth token found.");
        return;
      }
      console.log("🔍 Data being sent in PUT request:", {
        studentId: studentId,
        category: scoresByCategory,
        stars: stars,
        correctCount: correctAnswers,
        incorrectCount: incorrectAnswers,
        rounds: structuredRounds,
      });
      const response = await fetch(
        "http://10.0.2.2:5000/api/students/update-score",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            studentId: studentId,
            category: scoresByCategory,
            stars: stars,
            correctCount: correctAnswers, // Ensure this matches correct answers
            incorrectCount: incorrectAnswers,
            rounds: structuredRounds, // ✅ Ensure structuredRounds is passed instead of gameRounds
            time: timeTaken, // Send time taken to the backend
          }),
        }
      );

      console.log("📥 Response received, status:", response.status);

      if (!response.ok) {
        console.error(
          "❌ ERROR: Server returned an error status:",
          response.status
        );
        return;
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("❌ ERROR: Failed to parse JSON response:", jsonError);
        return;
      }

      console.log("✅ Score update response:", JSON.stringify(data, null, 2));

      if (response.status === 200) {
        setUpdatedRecommendations(data.student?.recommendations || []);
        setGamePhase("completed");
      } else {
        console.error("⚠️ Unexpected server response:", data.message);
      }

      setFinalTimeTaken(timeTaken);
      setFinalScore(score);
      setFinalSetGamePhase(() => setGamePhase);
      setGameFinished(true); // Now safely trigger game completion
    } catch (error) {
      console.error("❌ ERROR: Handle game complete failed:", error);
    }
  };

  return (
    <GameFlows
      backgroundImg={bg}
      DialogComponent={(props) => (
        <PregameDialog {...props} dialogData={DialogData} />
      )}
      CountdownComponent={Countdown}
      GameComponent={(props) => (
        <HardGame
          {...props}
          onGameComplete={(timeTaken, score, structuredRounds) =>
            handleGameComplete(
              timeTaken,
              score,
              structuredRounds,
              props.setGamePhase
            )
          }
          studentId={studentId}
          gameRounds={gameRounds} // ✅ Pass structuredRounds to HardGame
        />
      )}
      navigation={navigation}
      StageCompletionComponent={(props) => (
        <StageCompletion
          mode="challenge"
          level=""
          dialoguesData={{ complete: customCompletionDialog }}
          completionNpc={CompletionNpc}
          navigation={navigation}
          studentId={studentId}
          isChallengeMode={true}
          timeTaken={finalTimeTaken} // ✅ Pass correct final time
          correctAnswers={finalScore} // ✅ Pass correct final score
          totalRounds={11} // ✅ Ensure correct total rounds are passed
          onRestart={() => {
            setGameFinished(false);
            setFinalScore(null);
            setFinalTimeTaken(null);
            setGameRounds(rounds || []);
            navigation.replace("ChallengeHard", {
              studentId,
              rounds,
              currentCategoryType, // ✅ Keep the same category
            });
          }}
        />
      )}
    />
  );
};

export default HardModeScreen;
