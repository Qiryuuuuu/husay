// BaseGame.tsx
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
import AudioChall from "../audio/ChallAudio";
import { FrameType } from "../game/challenge/EasyMode/ChallengeShape"; // Import FrameType from ChallengeShape
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from '@react-navigation/native';

const pauseBtn = require("../../../assets/buttons/pause.png");
const pauseHeader = require("../../../assets/headerText/pause-header.png");
const correctImg = require("../../../assets/validation/correct.png");
const wrongImg = require("../../../assets/validation/wrong.png");
const modalBg = require("../../../assets/gameBackground/setting-bg.png");

export interface CategoryItem {
  name: string;
  image: any;
  type?: string;
  correct?: boolean;
}

export interface RecommendationData {
  Easy: {
    Shapes: string[];
    Colors: string[];
    Numbers: string[];
  };
  Medium: {
    Mixed: string[];
  };
  Hard: {
    Mixed: string[];
  };
}

interface CategoryData {
  [key: string]: CategoryItem[];
}

interface BaseGameProps {
  studentId: string;
  categories: CategoryData;
  recommendations?: RecommendationData; // new prop
  onGameComplete: (
    time: number,
    score: number,
    currentCategoryType: string,
    rounds: CategoryItem[]
  ) => void;
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
  storyScenes: any;
  onStateChange: (state: any) => void;
  numRounds?: number;
  rounds: CategoryItem[];
  currentCategoryType: string;
}

export const BaseGame: React.FC<BaseGameProps> = ({
  categories,
  onGameComplete,
  navigation,
  npcConfig,
  dialogues,
  storyScenes,
  onStateChange,
  numRounds = 5,
  recommendations,
}) => {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(null);
  const [isWaitingForTap, setIsWaitingForTap] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [currentAudioSources, setCurrentAudioSources] = useState([]);
  const [playSound, setPlaySound] = useState(false);
  const [currentSound, setCurrentSound] = useState<any>(null);

  const [totalTime, setTotalTime] = useState(0);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  const elapsedTimeRef = useRef(0);
  const [currentCategoryType, setCurrentCategoryType] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [rounds, setRounds] = useState<CategoryItem[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [options, setOptions] = useState<CategoryItem[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isClickable, setIsClickable] = useState(true);
  const [feedbackText, setFeedbackText] = useState(
    dialogues?.idle?.[Math.floor(Math.random() * dialogues.idle.length)] ||
      "Let's begin!"
  );
  const [npcImage, setNpcImage] = useState(npcConfig.idle);
  const [isGameRunning, setIsGameRunning] = useState(true);
  const [correctFirstTry, setCorrectFirstTry] = useState(0);
  const [hasTried, setHasTried] = useState(false);
  const [stopwatchRunning, setStopwatchRunning] = useState(true);
  

  // NEW: Tracks if an RFID answer has been processed for the current round
  const [rfidReceived, setRfidReceived] = useState(false);

  const [latestRFID, setLatestRFID] = useState<string | null>(null);
  const [fetchingRFID, setFetchingRFID] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [lastProcessedRFID, setLastProcessedRFID] = useState<string | null>(null);
  const [roundStartTime, setRoundStartTime] = useState<Date>(new Date());

  const route = useRoute();
  const { studentId } = route.params as { studentId: string };
  
  const fadeAnim = useState(new Animated.Value(1))[0];
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const npcBounceAnim = useRef(new Animated.Value(1)).current;

  // Counters (optional)
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  
  useEffect(() => {
    console.log("Student ID received as prop:", studentId);
  }, [studentId]);

  const generateRounds = useCallback(() => {
    const categoryTypes = Object.keys(categories);
    if (categoryTypes.length === 0) {
      console.error("❌ ERROR: No categories available!");
      return;
    }

    const categoryName = categoryTypes[0];
    const categoryItems = categories[categoryName] || [];

    if (categoryItems.length === 0) {
      console.error("❌ ERROR: No items found in category:", categoryName);
      return;
    }

    let selectedRounds = [];
    if (recommendations?.Easy?.[categoryName]?.length > 0) {
      const recommendedNames = recommendations.Easy[categoryName];
      selectedRounds = recommendedNames
        .map(name => {
          const foundItem = categoryItems.find(
            item => item.name.toLowerCase() === name.toLowerCase()
          );
          return foundItem
            ? { ...foundItem, type: categoryName }
            : { name, image: null, type: categoryName };
        })
        .slice(0, numRounds);
    } else {
      selectedRounds = categoryItems
        .sort(() => Math.random() - 0.5)
        .slice(0, numRounds)
        .map(item => ({ ...item, type: categoryName }));
    }

    if (selectedRounds.length < numRounds) {
      console.warn(
        `⚠️ Warning: Only ${selectedRounds.length} rounds available instead of ${numRounds}.`
      );
    }

    console.log("✅ Generated Rounds:", selectedRounds);
    setRounds(selectedRounds);
    resetGameState();
  }, [categories, numRounds, recommendations]);

  /**
   * Handles RFID scanning and answer submission:
   * - Reads the scanned answer from the RFID card
   * - Sends the answer to the backend for validation
   * - Updates game state based on correctness
   */
  const fetchLatestRFIDAnswer = useCallback(async () => {
    if (!isGameRunning || gameEnded || rfidReceived) return;
    if (fetchingRFID) return;
    setFetchingRFID(true);
  
    try {
      console.log("🔄 Fetching latest RFID answer...");
      const response = await axios.get("http://10.0.2.2:5001/latest-rfid-answer");
  
      if (response.data.success) {
        const { category, answer, timestamp } = response.data.data;
        console.log(
          `✅ Received RFID Answer: ${answer} (Category: ${category}) at ${timestamp}`
        );
  
        // Always process if an answer is received
        if (answer) {
          const answerTime = new Date(timestamp);
          if (answerTime >= roundStartTime && answer !== lastProcessedRFID) {
            processRFIDAnswer(answer);
          } else {
            console.log("Stale RFID answer or already processed, ignoring.");
          }
        }
  
      } else {
        console.warn("⚠️ No RFID data found. Retrying...");
      }
    } catch (error: any) {
      console.error("❌ Error fetching latest RFID answer:", error.message);
    } finally {
      setFetchingRFID(false);
    }
  }, [fetchingRFID, isGameRunning, gameEnded, rfidReceived]);
  
  
  const resetGameState = () => {
    setCurrentRound(0);
    setIsCorrect(null);
    setIsClickable(true);
    setFeedbackText(
      dialogues?.idle?.[Math.floor(Math.random() * dialogues.idle.length)] ||
        "Let's begin!"
    );
    setNpcImage(npcConfig.idle);
    setIsGameRunning(true);
    setCorrectFirstTry(0);
    setHasTried(false);
    setLatestRFID(null); // Reset RFID for new game
    setRfidReceived(false); // Ready for new RFID tap
  };

  // Start/stop the question timer
  const startTimer = () => {
    if (!timerInterval.current) {
      timerInterval.current = setInterval(() => {
        setTotalTime((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
  };

  // On mount, generate the random set of rounds
  useEffect(() => {
    if (Object.keys(categories).length > 0) {
      generateRounds();
    }
  }, [generateRounds]);

  // Reset RFID and related flags on each round change
  useEffect(() => {
    if (rounds.length > 0) {
      setRoundStartTime(new Date());
      setLatestRFID(null);
      setRfidReceived(false); // Ready for a new RFID tap
      // Load frames for the new round
      const roundStory = storyScenes[`round${currentRound + 1}`];
      if (roundStory) {
        setCurrentFrame(roundStory[0]);
        setCurrentFrameIndex(0);
      }

      if (!rounds[currentRound]) {
        console.log(`Error: rounds[${currentRound}] is undefined!`, rounds);
        return;
      }

      const currentType = rounds[currentRound]?.type;
      setCurrentCategoryType(currentType);
      generateOptions(currentType, rounds[currentRound]?.name);

      // Reset states
      setNpcImage(npcConfig.idle);
      setIsCorrect(null);
      setIsClickable(true);
      setHasTried(false);
    }
  }, [currentRound, rounds]);

  // Generate the multiple‐choice options for each round
  const generateOptions = (type: string, correctAnswer: string) => {
    if (!type || !categories[type]) {
      console.error(`Error: Invalid category type '${type}'`);
      return;
    }

    const categoryArray = categories[type];
    const otherOptions = categoryArray.filter(
      (item) => item.name !== correctAnswer
    );

    // Shuffle and pick up to 6 wrong options
    const shuffledOptions = otherOptions.sort(() => Math.random() - 0.5);
    const wrongOptions = shuffledOptions.slice(
      0,
      Math.min(6, shuffledOptions.length)
    );

    // Add correct answer, then shuffle
    const allOptions = [
      ...wrongOptions,
      categoryArray.find((item) => item.name === correctAnswer) || {
        name: correctAnswer,
        image: null,
      },
    ];
    setOptions(allOptions.sort(() => Math.random() - 0.5));
  };

  const handleSelection = useCallback(
    (selectedName: string) => {
      if (!isClickable) return;
      if (selectedName === rounds[currentRound].name) {
        handleCorrectAnswer();
      } else {
        handleWrongAnswer();
      }
    },
    [currentRound, rounds, isClickable, correctFirstTry, hasTried]
  );

  // Sync totalTime changes
  useEffect(() => {
    elapsedTimeRef.current = totalTime;
  }, [totalTime]);

  // Move to next round or end the game
  const moveToNextRound = (updatedScore: number) => {
    if (currentRound < numRounds - 1) {
      setCurrentRound(currentRound + 1);
    } else {
      setIsGameRunning(false);
      setTimeout(() => {
        if (onGameComplete) {
          onGameComplete(
            elapsedTimeRef.current,
            updatedScore,
            currentCategoryType,
            rounds
          );
        }
      }, 500);
    }
  };
  
  // ========== CORRECT / INCORRECT ANSWER HANDLERS ==========
  const handleCorrectAnswer = () => {
    setIsCorrect(true);
    setCorrectCount((prev) => prev + 1);

    setRounds((prevRounds) => {
      const updated = [...prevRounds];
      updated[currentRound] = {
        ...updated[currentRound],
        correct: true, // mark round as correct
      };
      return updated;
    });

    // Show correct answer feedback if available
    const roundStory = storyScenes[`round${currentRound + 1}`];
    const correctFrame = roundStory.find(
      (frame) => frame.type === FrameType.CORRECT_ANSWER
    );

    if (correctFrame) {
      setCurrentFrame(correctFrame);
      setIsWaitingForTap(true);
    }

    setNpcImage(npcConfig.correct);
    fadeInAnimation();
    setIsClickable(false);

    let updatedScore = correctFirstTry;
    if (!hasTried) {
      updatedScore += 1;
      setCorrectFirstTry(updatedScore);
    }
    moveToNextRound(updatedScore);
  };

  const handleWrongAnswer = () => {
    setIsCorrect(false);
    setIncorrectCount((prev) => prev + 1);

    setRounds((prevRounds) => {
      const updated = [...prevRounds];
      updated[currentRound] = {
        ...updated[currentRound],
        correct: false, // mark round as incorrect
      };
      return updated;
    });

    const roundStory = storyScenes[`round${currentRound + 1}`];
    const incorrectFrame = roundStory.find(
      (frame) => frame.type === FrameType.INCORRECT_ANSWER
    );

    if (incorrectFrame) {
      setCurrentFrame(incorrectFrame);
      setIsWaitingForTap(true);
    }

    setNpcImage(npcConfig.wrong);
    fadeInAnimation();
    triggerShake();
    Vibration.vibrate(100);
    setHasTried(true);
    moveToNextRound(correctFirstTry);
  };

  // Process the received RFID answer
  const processRFIDAnswer = useCallback(
    async (rfidData: string) => {
      let validStudentId = studentId;
      if (!validStudentId || validStudentId.trim() === "") {
        validStudentId = await AsyncStorage.getItem("studentId");
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
  
      // Prevent further processing for this round
      setIsClickable(false);
      setRfidReceived(true);
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      setLastProcessedRFID(rfidData);
  
      // Check if RFID answer is correct
      const isAnswerCorrect =
        rfidData.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
      console.log(
        `✅ Answer is ${isAnswerCorrect ? "Correct" : "Incorrect"}`
      );
      setIsCorrect(isAnswerCorrect);
  
      // Send result to RFID Microservice (port 5001)
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
  
      // Update Student Score in Main Server (port 5000)
      try {
        const authToken = await AsyncStorage.getItem("authToken");
        const response = await axios.put(
          "http://10.0.2.2:5000/api/students/update-score",
          {
            studentId: validStudentId,
            category: currentCategoryType,
            isCorrect: isAnswerCorrect,
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
  
        if (response.status === 200) {
          console.log("✅ Student score updated successfully.");
        } else {
          console.error(`⚠️ Unexpected response: ${response.status}`);
        }
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          console.error(
            "❌ API endpoint not found! Check if the server is running."
          );
        } else {
          console.error("❌ Error updating student score:", error.message);
        }
      }
  
      // Instead of using setTimeout to advance the round,
      // directly call the appropriate answer handler.
      if (isAnswerCorrect) {
        handleCorrectAnswer();
      } else {
        handleWrongAnswer();
      }
    },
    [
      currentRound,
      rounds,
      isClickable,
      studentId,
      currentCategoryType,
      handleCorrectAnswer,
      handleWrongAnswer,
    ]
  );
  

  // Start polling for RFID input every 3 seconds when game is running
  useEffect(() => {
    if (isGameRunning && !rfidReceived) {
      pollingIntervalRef.current = setInterval(fetchLatestRFIDAnswer, 3000);
    }
    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
    
  }, [isGameRunning, currentRound, rfidReceived, fetchLatestRFIDAnswer]);
 
  

  // End the game
  const endGame = async (finalScore: number) => {
    if (!gameEnded) {
      console.log("🎉 Ending Game with Score:", finalScore, "Elapsed Time:", totalTime);
      console.log(
        "🔍 Checking rounds before sending to onGameComplete:",
        rounds
      );
  
      if (!rounds || rounds.length === 0) {
        console.error("❌ ERROR: Rounds array is empty or undefined!");
      }
  
      setGameEnded(true);
      setIsGameRunning(false);
      setStopwatchRunning(false); // Stop the Stopwatch
      stopTimer();
  
      if (onGameComplete) {
        onGameComplete(finalScore, totalTime, currentCategoryType, [...rounds]);
      }
    }
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


  if (Object.keys(categories).length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleAudioPlaybackComplete = () => {
    console.log("🎧 Audio finished playing for this frame.");
  };

  return (
    <View style={styles.container}>
      {/* Audio Player */}
      {currentAudioSources.length > 0 && (
        <AudioChall
          audioSources={currentAudioSources}
          onPlaybackComplete={handleAudioPlaybackComplete}
        />
      )}

      {/* Pause Button */}
      <TouchableOpacity
        style={styles.pauseContainer}
        onPress={() => {
          setIsPaused(true);
          setIsGameRunning(false);
        }}
      >
        <Image source={pauseBtn} style={styles.pause} />
      </TouchableOpacity>

      {/* Full-Screen Touchable for Progression */}
      <TouchableOpacity
        style={styles.fullScreenTouchable}
        onPress={() => {
          if (gameEnded || currentFrame?.type === FrameType.QUESTION) {
            return; // Prevent progression during question phase or after game ends
          }

          if (isWaitingForTap) {
            setIsWaitingForTap(false);
            // After feedback, progress to next round
            if (
              currentFrame?.type === FrameType.CORRECT_ANSWER ||
              currentFrame?.type === FrameType.INCORRECT_ANSWER
            )  {if (currentRound < numRounds - 1) {
              moveToNextRound(correctFirstTry);
            } else {
              endGame(correctFirstTry); // Call endGame on the last round
            }
            return;
            }
          }

          // Default: progress to the next frame
          const roundStory = storyScenes[`round${currentRound + 1}`];
          if (roundStory && currentFrameIndex < roundStory.length - 1) {
            const nextIndex = currentFrameIndex + 1;
            setCurrentFrameIndex(nextIndex);
            setCurrentFrame(roundStory[nextIndex]);
            setIsWaitingForTap(true);
          } else if (currentRound === numRounds - 1) {
            endGame(correctFirstTry); // Ensure game ends if it's the last round
          }
        }}
      >
        {/* Background Image */}
        <Image
          source={currentFrame?.background}
          style={styles.backgroundImage}
        />

        {/* NPC & Dialogue Box */}
        <Animated.View style={[styles.npcContainer, { opacity: fadeAnim }]}>
          <Animated.Image
            source={currentFrame?.character === "EVA" ? npcImage : null}
            style={[styles.npcImage,  { transform: [{ scale: npcBounceAnim }] }]}
          />
          <View style={styles.dialogueContainer}>
            <Text style={styles.npcName}>
              {currentFrame?.character || "Unknown"}
            </Text>
            <Text style={styles.npcDialogue}>
              {currentFrame?.dialogues?.[0] || ""}
            </Text>
          </View>
        </Animated.View>

        {/* Validation Feedback (Correct / Incorrect) */}
        {currentFrame?.type === FrameType.QUESTION && (
          <View style={styles.validationContainer}>
            {isCorrect !== null && (
              <Image
                source={isCorrect ? correctImg : wrongImg}
                style={styles.validationImage}
              />
            )}
          </View>
        )}

        {/* Stopwatch - Positioned above itemContainer */}
        {currentFrame?.type === FrameType.QUESTION && (
          <View style={styles.stopwatchContainer}>
            <Stopwatch 
              isRunning={stopwatchRunning}
              onStop={(finalTime) => setTotalTime(finalTime)}
            />
          </View>
        )}

        {/* Round Info */}
        {currentFrame?.type === FrameType.QUESTION && (
          <Text style={styles.roundText}>
            Round {currentRound + 1} of {numRounds}
          </Text>
        )}

        {/* Show Question & Answers */}
        {currentFrame?.type === FrameType.QUESTION && (
          <View style={styles.itemContainer}>
            <Animated.Image
              source={rounds[currentRound]?.image}
              style={[
                styles.itemImage,
                { transform: [{ translateX: shakeAnim }] },
              ]}
            />
          </View>
        )}
      </TouchableOpacity>

      {/* Pause Menu */}
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
          navigation.navigate("Home");
          setIsPaused(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  fullScreenTouchable: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    flex: 1,
  },
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
  categoryTitle: {
    backgroundColor: "#5A8EF4",
    color: "white",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 15,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  stopwatchContainer: {
    position: "absolute",
    top: "15%",
    width: "100%",
    alignItems: "center",
    zIndex: 20,
  },
  roundText: {
    position: "absolute",
    top: "25%",
    backgroundColor: "rgba(0,0,0,0.7)",
    color: "white",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 15,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    zIndex: 20,
  },
  itemContainer: {
    width: "100%",
    height: 270,
    position: "absolute",
    top: "35%",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
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
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#5A8EF4",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    width: 120,
    alignItems: "center",
    zIndex: 20,
    marginBottom: 10,
  },
  npcContainer: {
    position: "absolute",
    bottom: -10,
    left: -90,
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
    marginRight: -80,
    marginBottom: -40,
    zIndex: 1,
  },
  dialogueContainer: {
    backgroundColor: "rgba(225, 241, 255, 0.9)",
    padding: 15,
    borderRadius: 15,
    width: "100%",
    maxWidth: 800,
    elevation: 3,
    borderWidth: 4,
    borderColor: "white",
  },
  npcName: {
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 5,
    paddingLeft: 50,
    fontSize: 20,
  },
  npcDialogue: {
    lineHeight: 30,
    fontSize: 20,
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
