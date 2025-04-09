//EasyBaseGame.tsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  Vibration,
} from "react-native";
import Stopwatch from "../stopWatch";
import SettingsModal from "../setting";
import AudioPlayer from "../../component/audio/AudioPlayer";
import axios from "axios"; // NEW: import axios for RFID calls
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";

const pauseBtn = require("../../../assets/buttons/pause.png");
const pauseHeader = require("../../../assets/headerText/pause-header.png");
const correctImg = require("../../../assets/validation/correct.png");
const wrongImg = require("../../../assets/validation/wrong.png");
const modalBg = require("../../../assets/gameBackground/setting-bg.png");

// Import sound files
const correctSound = require("../../../assets/voiceOver/misc/answerValidation/correct.mp3");
const wrongSound = require("../../../assets/voiceOver/misc/answerValidation/wrong.mp3");

interface GameItem {
  name: string;
  image: any;
}

interface GameProps {
  studentId: string;
  items: GameItem[];
  onGameComplete: (score: number, time: number) => void;
  navigation: any;
  npcConfig: {
    idle: any;
    correct: any;
    wrong: any;
    name: string;
  };
  dialogues: {
    idle: string[];
    correct: string[];
    wrong: string[];
  };
  numRounds?: number;
}

export const BaseGame: React.FC<GameProps> = ({
  items,
  onGameComplete,
  navigation,
  npcConfig,
  dialogues,
  numRounds = 5,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [rounds, setRounds] = useState<GameItem[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [options, setOptions] = useState<GameItem[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isClickable, setIsClickable] = useState(true);
  const [feedbackText, setFeedbackText] = useState(
    dialogues?.idle?.[Math.floor(Math.random() * dialogues.idle.length)] ||
      "Let's begin!"
  );
  const [npcImage, setNpcImage] = useState(npcConfig.idle);
  const [isGameRunning, setIsGameRunning] = useState(true);
  const correctFirstTryRef = useRef(0); // ✅ Track latest score
  const [correctFirstTry, setCorrectFirstTry] = useState(0);
  const [hasTried, setHasTried] = useState(false);

  // Add state for audio playback
  const [currentSound, setCurrentSound] = useState<any>(null);
  const [playSound, setPlaySound] = useState(false);

  const elapsedTimeRef = useRef(0);
  const fadeAnim = useState(new Animated.Value(1))[0];
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const npcBounceAnim = useRef(new Animated.Value(1)).current;

  // NEW: RFID-related state variables
  const [rfidReceived, setRfidReceived] = useState(false);
  const [latestRFID, setLatestRFID] = useState<string | null>(null);
  const [fetchingRFID, setFetchingRFID] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [lastProcessedRFID, setLastProcessedRFID] = useState<string | null>(
    null
  );
  const [roundStartTime, setRoundStartTime] = useState<Date>(new Date());

  // Fetch StudentId
  const route = useRoute();
  const { studentId } = route.params as { studentId: string };

  //Stopwatch
  const [stopwatchRunning, setStopwatchRunning] = useState(true); // Changes

  useEffect(() => {
    console.log("Student ID received as prop:", studentId);
  }, [studentId]);

  const generateRounds = useCallback(() => {
    // Generate exactly numRounds rounds
    let roundsArray = [...items]
      .sort(() => Math.random() - 0.5)
      .slice(0, numRounds);

    // If we don't have enough items, repeat some to reach numRounds
    while (roundsArray.length < numRounds) {
      const remainingNeeded = numRounds - roundsArray.length;
      const additionalItems = [...items]
        .sort(() => Math.random() - 0.5)
        .slice(0, remainingNeeded);
      roundsArray = [...roundsArray, ...additionalItems];
    }

    setRounds(roundsArray);
    setCurrentRound(0);
    resetGameState();
  }, [items, numRounds]);

  const resetGameState = () => {
    setIsCorrect(null);
    setIsClickable(true);
    setFeedbackText(
      dialogues?.idle?.[Math.floor(Math.random() * dialogues.idle.length)] ||
        "Let's begin!"
    );
    setNpcImage(npcConfig.idle);
    setIsGameRunning(true);
    setCorrectFirstTry(0);
    elapsedTimeRef.current = 0;
    setHasTried(false);
    setLatestRFID(null); // Reset RFID for new game
    setRfidReceived(false); // Ready for new RFID tap
  };

  // NEW: Reset RFID state on each round change
  useEffect(() => {
    setRoundStartTime(new Date());
    setLatestRFID(null);
    setRfidReceived(false);
  }, [currentRound]);

  // Audio playback status handler
  const handlePlaybackStatusUpdate = useCallback((status) => {
    if (status.didJustFinish) {
      setPlaySound(false);
    }
  }, []);

  useEffect(() => {
    if (dialogues && items) {
      generateRounds();
    }
  }, [generateRounds, dialogues, items]);

  useEffect(() => {
    if (rounds.length > 0 && items.length > 0) {
      let allOptions = [...items].sort(() => Math.random() - 0.5);
      setOptions(allOptions);
      setIsCorrect(null);
      setIsClickable(true);
      setFeedbackText(
        dialogues?.idle?.[Math.floor(Math.random() * dialogues.idle.length)] ||
          "Let's continue!"
      );
      setNpcImage(npcConfig.idle);
      setHasTried(false);
    }
  }, [currentRound, rounds, items, dialogues?.idle, npcConfig.idle]);

  // ========== HANDLING SELECTION ==========
  const handleSelection = useCallback(
    (selectedName: string) => {
      if (!isClickable) return;

      if (selectedName === rounds[currentRound].name) {
        handleCorrectAnswer();
      } else {
        handleWrongAnswer();
      }
    },
    [currentRound, rounds, isClickable]
  );

  // Changes
  const handleGameEnd = () => {
    console.log("✅ BaseGame detected game end!");
    setStopwatchRunning(false); // ✅ This will trigger onStop

    setTimeout(() => {
      const finalScore = correctFirstTryRef.current;
      const finalTime =
        typeof elapsedTimeRef.current === "number" &&
        !isNaN(elapsedTimeRef.current) //changes
          ? elapsedTimeRef.current
          : 0;
      console.log("🎯 Final time to submit:", elapsedTimeRef.current); // changes
      onGameComplete(finalScore, finalTime);
    }, 300); // wait a little to allow Stopwatch to trigger onStop
  };
  // Changes

  // ========== CORRECT / INCORRECT ANSWER HANDLERS ==========
  const handleCorrectAnswer = () => {
    setIsCorrect(true);
    const randomCorrectDialogue =
      dialogues?.correct?.[
        Math.floor(Math.random() * dialogues.correct.length)
      ] || "Correct!";
    setFeedbackText(randomCorrectDialogue);
    animateNpcBounce();
    setNpcImage(npcConfig.correct);
    fadeInAnimation();
    setIsClickable(false);

    // Play correct sound
    setCurrentSound(correctSound);
    setPlaySound(true);

    setCorrectFirstTry((prev) => {
      if (!hasTried) {
        const newScore = prev + 1;
        correctFirstTryRef.current = newScore;
        return newScore;
      }
      return prev;
    });

    setTimeout(() => {
      if (currentRound < numRounds - 1) {
        setCurrentRound(currentRound + 1);
      } else {
        setIsGameRunning(false);
        setStopwatchRunning(false); // Changes
        setTimeout(handleGameEnd, 500);
      }
    }, 1500);
  };

  // --- FIXED: Automatically proceed to the next round after a wrong answer ---
  const handleWrongAnswer = () => {
    setIsCorrect(false);
    const randomWrongDialogue =
      dialogues?.wrong?.[Math.floor(Math.random() * dialogues.wrong.length)] ||
      "Try again!";
    setFeedbackText(randomWrongDialogue);
    setNpcImage(npcConfig.wrong);
    fadeInAnimation();
    animateNpcBounce();
    triggerShake();
    Vibration.vibrate(100);
    setHasTried(true);

    // Play wrong sound
    setCurrentSound(wrongSound);
    setPlaySound(true);

    // Disable further input and move to the next round after a short delay
    setIsClickable(false);

    setTimeout(() => {
      if (currentRound < numRounds - 1) {
        setCurrentRound(currentRound + 1);
      } else {
        setIsGameRunning(false);
        setStopwatchRunning(false); // Changes
        setTimeout(handleGameEnd, 500);
      }
    }, 1500);
  };

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateNpcBounce = () => {
    Animated.sequence([
      Animated.timing(npcBounceAnim, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(npcBounceAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const fadeInAnimation = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  // ========== RFID FUNCTIONALITY ==========

  // Poll the RFID microservice for the latest answer every 3 seconds when the game is running
  const fetchLatestRFIDAnswer = useCallback(async () => {
    if (!isGameRunning || rfidReceived) return;
    if (fetchingRFID) return;
    setFetchingRFID(true);

    try {
      console.log("🔄 Fetching latest RFID answer...");
      const response = await axios.get(
        "http://10.0.2.2:5001/latest-rfid-answer"
      );
      if (response.data.success) {
        const { answer, timestamp } = response.data.data;
        console.log(`✅ Received RFID Answer: ${answer} at ${timestamp}`);

        // Process if the answer is new and the round has started
        const answerTime = new Date(timestamp);
        if (
          answer &&
          answerTime >= roundStartTime &&
          answer !== lastProcessedRFID
        ) {
          processRFIDAnswer(answer);
        } else {
          console.log("Stale RFID answer or already processed, ignoring.");
        }
      } else {
        console.warn("⚠️ No RFID data found. Retrying...");
      }
    } catch (error: any) {
      console.error("❌ Error fetching latest RFID answer:", error.message);
    } finally {
      setFetchingRFID(false);
    }
  }, [
    isGameRunning,
    rfidReceived,
    fetchingRFID,
    roundStartTime,
    lastProcessedRFID,
  ]);

  // Process the RFID answer by comparing it with the correct answer.
  // NOTE: Update score calls have been removed.
  const processRFIDAnswer = useCallback(
    async (rfidData: string) => {
      let validStudentId = studentId;
      if (!validStudentId || validStudentId.trim() === "") {
        validStudentId = (await AsyncStorage.getItem("studentId")) || "";
        if (!validStudentId || validStudentId.trim() === "") {
          console.error("Student ID is missing, cannot update score.");
          return;
        }
      }

      if (!isClickable || currentRound >= rounds.length) return;
      const currentQuestion = rounds[currentRound];
      const correctAnswer = currentQuestion.name;
      console.log(
        `🔍 Processing RFID Answer: ${rfidData} (Expected: ${correctAnswer})`
      );
      setIsClickable(false);
      setRfidReceived(true);
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      setLastProcessedRFID(rfidData);
      const isAnswerCorrect =
        rfidData.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
      console.log(`✅ Answer is ${isAnswerCorrect ? "Correct" : "Incorrect"}`);
      setIsCorrect(isAnswerCorrect);

      // Send result to RFID Microservice
      try {
        await axios.post("http://10.0.2.2:5001/rfid-result", {
          result: isAnswerCorrect ? "Correct" : "Incorrect",
        });
        console.log(
          `📡 Sent RFID Result: ${isAnswerCorrect ? "Correct" : "Incorrect"}`
        );
      } catch (error: any) {
        console.error("❌ Error sending RFID result:", error.message);
      }

      // Trigger the appropriate answer handler
      if (isAnswerCorrect) {
        handleCorrectAnswer();
      } else {
        handleWrongAnswer();
      }
    },
    [isClickable, currentRound, rounds, handleCorrectAnswer, handleWrongAnswer]
  );

  // Start polling for RFID input every 3 seconds when game is running
  useEffect(() => {
    if (isGameRunning && !rfidReceived) {
      pollingIntervalRef.current = setInterval(fetchLatestRFIDAnswer, 3000);
    }
    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, [isGameRunning, rfidReceived, fetchLatestRFIDAnswer]);

  if (!dialogues || !items || items.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Include AudioPlayer component */}
      {playSound && currentSound && (
        <AudioPlayer
          audioSource={currentSound}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          autoPlay={true}
        />
      )}

      <TouchableOpacity
        style={styles.pauseContainer}
        onPress={() => {
          setIsPaused(true);
          setIsGameRunning(false);
        }}
      >
        <Image source={pauseBtn} style={styles.pause} />
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <View style={styles.validationContainer}>
          {isCorrect !== null && (
            <Image
              source={isCorrect ? correctImg : wrongImg}
              style={styles.validationImage}
            />
          )}
        </View>

        <Stopwatch
          isRunning={stopwatchRunning} // Changes
          onStop={(finalTime) => {
            console.log("🔥 Elapsed Time from Stopwatch:", finalTime);
            elapsedTimeRef.current = finalTime; // ✅ Save total time
          }}
        />

        <Text style={styles.roundText}>
          Round {currentRound + 1} of {numRounds}
        </Text>

        {rounds.length > 0 && (
          <>
            <View style={styles.itemContainer}>
              <Animated.Image
                source={rounds[currentRound].image}
                style={[
                  styles.itemImage,
                  { transform: [{ translateX: shakeAnim }] },
                ]}
              />
            </View>
          </>
        )}
      </View>

      <Animated.View style={[styles.npcContainer, { opacity: fadeAnim }]}>
        <Animated.Image
          source={npcImage}
          style={[styles.npcImage, { transform: [{ scale: npcBounceAnim }] }]}
        />

        <View style={styles.dialogueContainer}>
          <Text style={styles.npcName}>{npcConfig.name}</Text>
          <Text style={styles.npcDialogue}>{feedbackText}</Text>
        </View>
      </Animated.View>

      <SettingsModal
        visible={isPaused}
        onClose={() => {
          setIsPaused(false);
          setIsGameRunning(true);
        }}
        headerImage={pauseHeader}
        backgroundImg={modalBg}
        buttonOneText="Resume"
        buttonTwoText="Quit"
        onButtonOnePress={() => {
          setIsPaused(false);
          setIsGameRunning(true);
        }}
        onButtonTwoPress={() => {
          navigation.navigate("Home", { studentId });
          setIsPaused(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pauseContainer: {
    zIndex: 100,
    position: "absolute",
    top: 40,
    left: 50,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingBottom: 150,
    zIndex: 10,
  },
  validationContainer: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  validationImage: {
    width: 44,
    height: 44,
    marginBottom: 15,
    resizeMode: "contain",
  },
  roundText: {
    backgroundColor: "rgba(0,0,0,0.7)",
    color: "white",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 15,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  itemContainer: {
    width: "100%",
    height: 270,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginBottom: 30,
  },
  itemImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    marginTop: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    zIndex: 100,
    elevation: 10,
    marginBottom: 30,
  },
  buttonText: {
    color: "white",
  },
  button: {
    backgroundColor: "#5A8EF4",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    width: 120,
    alignItems: "center",
    zIndex: 20,
  },
  npcContainer: {
    position: "absolute",
    bottom: -10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  npcImage: {
    width: 290,
    height: 290,
    resizeMode: "contain",
    marginRight: -90,
    marginBottom: -40,
    zIndex: 1,
  },
  dialogueContainer: {
    backgroundColor: "#E1F1FF",
    padding: 15,
    borderRadius: 15,
    width: "100%",
    maxWidth: 600,
    elevation: 3,
    borderWidth: 4,
    borderColor: "white",
  },
  npcName: {
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 5,
    paddingLeft: 60,
    fontSize: 18,
  },
  npcDialogue: {
    textAlign: "center",
    fontSize: 16,
    paddingLeft: 50,
    width: "100%",
  },
  disabledButton: {
    backgroundColor: "#A0A0A0",
  },
  pause: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
});
