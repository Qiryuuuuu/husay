// ChallengeColor.js
import React, { useEffect, useState } from "react";
import GameFlows from "../../../../component/game/GameFlowChallenge";
import PregameDialog from "../../../../component/game/PregameDialog";
import Countdown from "../../../../component/countdown";
import ColorGame from "../../../../component/game/challenge/EasyMode/ChallengeColor";
import StageCompletion from "../../../../component/stageCompletion";
import { useNavigation } from "@react-navigation/native";
import { playMusic, stopMusic } from "../../../../component/audio/MusicManager";
import AsyncStorage from "@react-native-async-storage/async-storage";


const bg = require("../../../../../assets/gameBackground/challenge/easy/default-easy.webp");

const DialogData = {
  dialogues: [
    "Woahhh, there’s a river we must cross to reach the lair. But, as you know it, I’m a robot hihihihi I’m not sure I’m waterproof. How silly of me. My friend, will you help me cross the river?",
  ],
  npcNames: ["Eva"],
  npcImages: [
    {
      image: require("../../../../../assets/eva/eva-happy.png"),
      width: 340,
      height: 480,
    },
  ],
  audioFiles: [
    [require("../../../../../assets/voiceOver/eva/challengEasy/1-pregame.mp3")],
  ],
};

const CompletionNpc = {
  name: "Eva",
  image: require("../../../../../assets/eva/eva-happy.png"),
};

const customCompletionDialog = [
  "Thank you. We crossed the river safely. I can see the lair but we have to pass through the forest first.",
];

const ChallengeColorScreen = ({ route }) => {
  const [gameRounds, setGameRounds] = useState(rounds || []); // Fallback to empty array if rounds is undefined
  const [gameFinished, setGameFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const [finalTimeTaken, setFinalTimeTaken] = useState(null);
  const [finalSetGamePhase, setFinalSetGamePhase] = useState(() => null);
  const [updatedRecommendations, setUpdatedRecommendations] = useState(null); // Initialize state for updated recommendations

  const navigation = useNavigation();

  useEffect(() => {
    playMusic("easyBg");
    return () => stopMusic();
  }, []);

  const { studentId, rounds, currentCategoryType } = route.params || {};
  console.log("Challenge Color easy received studentID:", studentId);

  if (!studentId) {
    console.error("❌ ERROR: studentId is undefined!");
  }

  useEffect(() => {
    if (gameFinished && finalScore !== null && finalTimeTaken !== null) {
      console.log("✅ Game finished! Triggering game completion...");

      if (typeof finalSetGamePhase === "function") {
        finalSetGamePhase("completed"); // Ensure this triggers correctly
        handleGameComplete(
          finalScore,
          finalTimeTaken,
          finalSetGamePhase,
          currentCategoryType
        );
      } else {
        console.error("❌ ERROR: setGamePhase is not a function.");
      }
    }
  }, [gameFinished, finalScore, finalTimeTaken, finalSetGamePhase]);

  const handleGameComplete = async (
    score,
    timeTaken,
    setGamePhase,
    currentCategoryType
  ) => {
    console.log("Submitting game results...");
    console.log("Time Taken:", timeTaken);
    if (!studentId) {
      console.error("❌ ERROR: Cannot submit score, studentId is missing.");
      return;
    }

    if (!gameRounds || gameRounds.length === 0) {
      console.error("❌ ERROR: Cannot submit score, rounds are missing.");
      return;
    }

    const totalRounds = 5;
    const mistakes = totalRounds - score;
    const stars = mistakes === 0 ? 3 : mistakes <= 3 ? 2 : 1;
    const token = await AsyncStorage.getItem("authToken");

    if (!token) {
      console.error("No auth token found");
      return;
    }

    // Grouping score data by category and subcategory
    const scoresByCategory = {};
    gameRounds.forEach((round) => {
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

    console.log("Scores structured by category:", scoresByCategory);

    try {
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
            correctCount: score,
            incorrectCount: gameRounds.length - score,
            rounds: gameRounds, // Send rounds data to the backend
            time: timeTaken, // Send time taken to the backend
          }),
        }
      );

      console.log("Correct score data:", score);
      console.log("Incorrect count:", gameRounds.length - score);

      const data = await response.json();
      console.log("Score update response: ", JSON.stringify(data, null, 2));

      if (response.status === 200) {
        setUpdatedRecommendations(data.student.recommendations);
      } else {
        console.error("Error updating score:", data.message);
      }

      // ✅ Wait until API call is done before marking the game as finished
      setFinalScore(score);
      setFinalTimeTaken(timeTaken);
      setFinalSetGamePhase(() => setGamePhase);
      setGameFinished(true); // Now safely trigger game completion
    } catch (error) {
      console.error("Error updating score:", error);
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
        <ColorGame
          {...props}
          rounds={gameRounds} // Use state-tracked rounds
          studentId={studentId} // Ensure studentId is passed
          updatedRecommendations={updatedRecommendations} // Pass updated recommendations to game component
          onGameComplete={(time, score, categoryType, updatedRounds) => {
            console.log(
              "🔍 Updating rounds at game completion:",
              updatedRounds
            );

            if (!Array.isArray(updatedRounds)) {
              console.error(
                "❌ ERROR: Received invalid rounds data:",
                updatedRounds
              );
              return;
            }
            setGameRounds(updatedRounds);
            setFinalScore(score);
            setFinalTimeTaken(time);
            setFinalSetGamePhase(() => props.setGamePhase); // Store function reference
            setGameFinished(true);
          }}
        />
      )}
      navigation={navigation}
      StageCompletionComponent={(props) => (
        <StageCompletion
          mode="challenge" // ✅ Indicates Challenge Mode
          level="Color" // ✅ Current Level
          completionNpc={CompletionNpc}
          navigation={navigation}
          studentId={studentId}
          isChallengeMode={true}
          timeTaken={finalTimeTaken}
          correctAnswers={finalScore}
          totalRounds={5}
          // For the "Retry" button in StageCompletion:
          onRestart={() => {
            // Example "retry" behavior:
            setGameFinished(false);
            setFinalScore(null);
            setFinalTimeTaken(null);
            setGameRounds(rounds || []);
            // Then either go back or re-mount:
            navigation.replace("ChallengeColor", {
              studentId,
              rounds,
              currentCategoryType,
            });
          }}
        />
      )}
    />
  );
};

export default ChallengeColorScreen;
