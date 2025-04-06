// ChallHardBase.tsx
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
import { FrameType } from "../game/challenge/HardMode/ChallengeHard";
import figures from "../../data/hardQuestions";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from '@react-navigation/native';

const pauseBtn = require("../../../assets/buttons/pause.png");
const pauseHeader = require("../../../assets/headerText/pause-header.png");
const correctImg = require("../../../assets/validation/correct.png");
const wrongImg = require("../../../assets/validation/wrong.png");
const modalBg = require("../../../assets/gameBackground/setting-bg.png");

const shapeOptions = ["Rectangle", "Triangle", "Square", "Circle"];
const colorOptions = ["Red", "Blue", "Green", "Yellow", "Black", "Gray", "White"];
const countOptions = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

// Import sound files
const correctSound = require("../../../assets/voiceOver/misc/answerValidation/correct.mp3");
const wrongSound = require("../../../assets/voiceOver/misc/answerValidation/wrong.mp3");

interface FigureProperties {
  shape: string;
  color: string;
  count: string;
}

interface Figure {
  source: any;
  properties: FigureProperties;
  questionType?: "shape" | "color" | "count";
  correctAnswer?: string;
}

export interface RoundData {
  correct: boolean;
  image?: number; // Assuming figures have an `image` field
  name: string;
  type: "shape" | "color" | "number";
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

interface NpcConfig {
  [key: string]: {
    idle: any;
    correct?: any;
    wrong?: any;
    name: string;
  };
}

interface BaseHardGameProps {
  studentId: string;
  figures: {
    house: Figure[];
    car: Figure[];
    rocket: Figure[];
    flower: Figure[];
    robot: Figure[];
  };
  onGameComplete: (time: number, score: number, structuredRounds: any) => void;
  navigation: any;
  npcConfig: NpcConfig;
  dialogues: {
    idle: string[];
    correct: string[];
    wrong: string[];
  };
  numShapeRounds?: number;
  numColorRounds?: number;
  includeCountRound?: boolean;
  numRounds?: number;
  storyScenes: any;
  outro: any;
  structuredRounds: RoundData[]; // ✅ New prop
  setStructuredRounds: React.Dispatch<React.SetStateAction<RoundData[]>>; // ✅ New prop
  recommendations?: RecommendationData; // NEW: recommendations prop
}

export const BaseHardGame: React.FC<BaseHardGameProps> = ({
  figures,
  onGameComplete,
  navigation,
  npcConfig,
  dialogues,
  storyScenes,
  numShapeRounds = 5,
  numColorRounds = 5,
  includeCountRound = true,
  numRounds = 11,
  structuredRounds,
  setStructuredRounds,
  recommendations,
}) => {
  const [npcImage, setNpcImage] = useState(npcConfig["EVA"].idle);
  const [totalTime, setTotalTime] = useState(0);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  const [currentAudioSources, setCurrentAudioSources] = useState([]);
  const [playSound, setPlaySound] = useState(false);
  const [currentSound, setCurrentSound] = useState<any>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(null);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isWaitingForTap, setIsWaitingForTap] = useState(false);
  const [isInOutroSequence, setIsInOutroSequence] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rounds, setRounds] = useState<Figure[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isClickable, setIsClickable] = useState(true);
  const [feedbackText, setFeedbackText] = useState(
    dialogues?.idle?.[Math.floor(Math.random() * dialogues.idle.length)] ||
      "Let's begin!"
  );
  const [isGameRunning, setIsGameRunning] = useState(true);
  const [correctFirstTry, setCorrectFirstTry] = useState(0);
  const [hasTried, setHasTried] = useState(false);
  const [selectedFigureType, setSelectedFigureType] = useState<string | null>(null);
  const [questionType, setQuestionType] = useState<"shape" | "color" | "count">(
    "shape"
  );
  const structuredRoundsRef = useRef(structuredRounds);

  const elapsedTimeRef = useRef(0);
  const fadeAnim = useState(new Animated.Value(1))[0];
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const npcBounceAnim = useRef(new Animated.Value(1)).current;
  const hasTriedRef = useRef(false);

  // RFID-related states
  const [rfidReceived, setRfidReceived] = useState(false); // Prevent multiple reads
  const [latestRFID, setLatestRFID] = useState<string | null>(null);
  const [fetchingRFID, setFetchingRFID] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [lastProcessedRFID, setLastProcessedRFID] = useState<string | null>(null);
  const [roundStartTime, setRoundStartTime] = useState<Date>(new Date());

  // Routes
  const route = useRoute();
  const { studentId } = route.params as { studentId: string };

  useEffect(() => {
    console.log("Student ID received as prop:", studentId);
  }, [studentId]);

  const generateRounds = useCallback(() => {
    if (
      recommendations &&
      recommendations.Hard &&
      recommendations.Hard.Mixed &&
      recommendations.Hard.Mixed.length >= numRounds
    ) {
      const recNames = recommendations.Hard.Mixed.slice(0, numRounds);
      const figureTypes = Object.keys(figures);
      let allRounds: Figure[] = [];

      recNames.forEach((recName) => {
        let found = false;
        for (const ft of figureTypes) {
          const matchingFigure = figures[ft].find(
            (f) =>
              f.correctAnswer &&
              f.correctAnswer.toLowerCase() === recName.toLowerCase()
          );
          if (matchingFigure) {
            allRounds.push(matchingFigure);
            found = true;
            break;
          }
        }
        if (!found) {
          console.warn(`Recommended figure "${recName}" not found; using fallback.`);
          allRounds.push({
            source: null,
            properties: { shape: recName, color: recName, count: recName },
            questionType: "shape",
            correctAnswer: recName,
          });
        }
      });

      setRounds(allRounds);
      setStructuredRounds(generateRoundsData(allRounds)); // ✅ pass generated rounds directly
      resetGameState();
      return;
    }

    const figureTypes = Object.keys(figures);
    if (figureTypes.length === 0) return;

    const randomFigureType = figureTypes[Math.floor(Math.random() * figureTypes.length)];
    setSelectedFigureType(randomFigureType);
    const selectedFigures = figures[randomFigureType];
    if (!selectedFigures || !selectedFigures[0]?.properties) {
      console.error("Invalid figure data:", randomFigureType, selectedFigures);
      return;
    }

    let allRounds: Figure[] = [];
    for (let i = 0; i < numShapeRounds; i++) {
      allRounds.push({
        ...selectedFigures[i + 1],
        questionType: "shape",
        correctAnswer: selectedFigures[i + 1].properties.shape,
      });
    }
    for (let i = 0; i < numColorRounds; i++) {
      allRounds.push({
        ...selectedFigures[i + 1],
        questionType: "color",
        correctAnswer: selectedFigures[i + 1].properties.color,
      });
    }
    if (includeCountRound) {
      allRounds.push({
        ...selectedFigures[0],
        questionType: "count",
        correctAnswer: selectedFigures[0].properties.count,
      });
    }

    setRounds(allRounds);
    resetGameState();
  }, [figures, numShapeRounds, numColorRounds, includeCountRound, numRounds, recommendations]);

  const generateRoundsData = useCallback((roundData: Figure[] = rounds): RoundData[] => {
    return roundData.map((round) => {
      let type: "shape" | "color" | "number";
      switch (round.questionType) {
        case "shape":
          type = "shape";
          break;
        case "color":
          type = "color";
          break;
        case "count":
          type = "number";
          break;
        default:
          type = "shape";
      }
  
      return {
        correct: false,
        image: round.source,
        name: round.correctAnswer || "Unknown",
        type,
      };
    });
  }, [rounds]);
  

  const fetchLatestRFIDAnswer = useCallback(async () => {
    if (!isGameRunning || gameEnded || rfidReceived) return;
    if (fetchingRFID) return;
    setFetchingRFID(true);

    try {
      console.log("🔄 Fetching latest RFID answer...");
      const response = await axios.get("http://10.0.2.2:5001/latest-rfid-answer");

      if (response.data.success) {
        const { category, answer, timestamp } = response.data.data;
        console.log(`✅ Received RFID Answer: ${answer} (Category: ${category}) at ${timestamp}`);

        const answerTime = new Date(timestamp);
        if (answerTime >= roundStartTime && answer !== lastProcessedRFID) {
          processRFIDAnswer(answer);
        } else {
          console.log("⚠️ Stale RFID answer or already processed, ignoring.");
        }
      } else {
        console.warn("⚠️ No RFID data found. Retrying...");
      }
    } catch (error: any) {
      console.error("❌ Error fetching latest RFID answer:", error.message);
    } finally {
      setFetchingRFID(false);
    }
  }, [fetchingRFID, isGameRunning, gameEnded, rfidReceived, roundStartTime, lastProcessedRFID]);

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
    elapsedTimeRef.current = 0;
    setHasTried(false);
  };

  useEffect(() => {
    if (structuredRounds.length === 0 && rounds.length > 0) {
      const newStructuredRounds: RoundData[] = generateRoundsData(rounds);
      console.log("✅ Initializing Structured Rounds:", newStructuredRounds);
      setStructuredRounds(newStructuredRounds);
    }
  }, [rounds]);

  useEffect(() => {
    console.log("📦 BaseHardGame structuredRounds passed up:", structuredRounds);
  }, [structuredRounds]);

  useEffect(() => {
    if (figures && Object.keys(figures).length > 0) {
      generateRounds();
      console.log("Initial Score:", correctFirstTry);
    }
  }, [generateRounds, figures]);

  // ─── PHASE 1: RESET RFID FLAGS AND ROUND TIMING AT THE START OF EACH ROUND ──────────────────────────────
  useEffect(() => {
    if (rounds.length > 0 && currentRound < rounds.length) {
      // Reset RFID-related states for the new round.
      setRfidReceived(false);
      setLastProcessedRFID(null);
      setRoundStartTime(new Date()); // Update round start time

      // ─── PHASE 2: SET UP THE ROUND (Question Type, Options, NPC, etc.) ──────────────────────────────
      const currentQuestion = rounds[currentRound];
      if (!currentQuestion) {
        console.error("Invalid round data:", currentRound, rounds);
        return;
      }

      setQuestionType(currentQuestion.questionType || "shape");

      let roundOptions: string[] = [];
      switch (currentQuestion.questionType) {
        case "shape":
          roundOptions = [...shapeOptions];
          break;
        case "color":
          roundOptions = [...colorOptions];
          break;
        case "count":
          roundOptions = [...countOptions];
          break;
      }

      setOptions(roundOptions.sort(() => Math.random() - 0.5));
      setIsCorrect(null);
      setIsClickable(true);
      setFeedbackText(
        dialogues?.idle?.[Math.floor(Math.random() * dialogues.idle.length)] ||
          "Let's continue!"
      );
      setNpcImage(npcConfig.idle);
      setHasTried(false);

      // Set the current frame based on the round number
      const roundKey = `round${currentRound + 1}`;
      if (storyScenes[roundKey]) {
        setCurrentFrame(storyScenes[roundKey][0]);
        setCurrentFrameIndex(0);
        setIsWaitingForTap(true);
      }
    }
  }, [currentRound, rounds, dialogues?.idle, npcConfig.idle, storyScenes]);
  // ─────────────────────────────────────────────────────────────────────────────────────────────────────────

  const handleSelection = useCallback(
    (selectedAnswer: string) => {
      if (!isClickable || currentRound >= rounds.length) return;

      const normalizedSelection = selectedAnswer.toLowerCase();
      const normalizedCorrectAnswer = (rounds[currentRound].correctAnswer || "").toLowerCase();

      if (normalizedSelection === normalizedCorrectAnswer) {
        handleCorrectAnswer();
      } else {
        handleWrongAnswer();
      }
    },
    [currentRound, rounds, isClickable]
  );

  const handleCorrectAnswer = () => {
    setIsCorrect(true);
    const randomCorrectDialogue =
      dialogues?.correct?.[Math.floor(Math.random() * dialogues.correct.length)] || "Correct!";
    setFeedbackText(randomCorrectDialogue);
    animateNpcBounce();
    const characterKey = currentFrame?.character?.toUpperCase();
    setNpcImage(npcConfig[characterKey]?.correct || npcConfig["EVA"].correct);
    fadeInAnimation();
    setIsClickable(false);

    // Play correct sound
    setCurrentSound(correctSound);
    setPlaySound(true);

    if (!hasTriedRef.current) {
      setStructuredRounds((prevRounds) =>
        prevRounds.map((round, index) =>
          index === currentRound ? { ...round, correct: true } : round
        )
      );

      setCorrectFirstTry((prevScore) => {
        console.log(`🎯 Round ${currentRound + 1}: Correct! Score: ${prevScore + 1}`);
        return prevScore + 1;
      });
    }

    console.log(`🚀 Correct answer! Preparing to move to round ${currentRound + 1}`);

    hasTriedRef.current = false;

    // For certain rounds, show a correct frame before moving on.
    if ([4, 9, 10].includes(currentRound)) {
      const roundKey = `round${currentRound + 1}`;
      const correctFrame = storyScenes[roundKey]?.find(
        (frame) => frame.type === FrameType.CORRECT_ANSWER
      );
      if (correctFrame) {
        console.log(`🟢 Showing correct frame before moving to next round.`);
        setCurrentFrame(correctFrame);
        setIsWaitingForTap(true);
        return;
      }
    }

    setTimeout(() => {
      if (currentRound + 1 === numRounds) {
        startOutroSequence(correctFirstTry); // ✅ triggers outro flow
      } else {
        setCurrentRound((prevRound) => prevRound + 1);
      }
    }, 1500);
  };

  const handleWrongAnswer = () => {
    setIsCorrect(false);
    setFeedbackText(
      dialogues?.wrong?.[Math.floor(Math.random() * dialogues.wrong.length)] ||
        "Try again!"
    );
    const characterKey = currentFrame?.character?.toUpperCase();
    setNpcImage(npcConfig[characterKey]?.wrong || npcConfig["EVA"].wrong);
    fadeInAnimation();
    animateNpcBounce();
    triggerShake();
    Vibration.vibrate(100);

    // Play wrong sound
    setCurrentSound(wrongSound);
    setPlaySound(true);

    hasTriedRef.current = true;
    console.log(`❌ Round ${currentRound + 1}: Wrong answer. Try again.`);

    setStructuredRounds((prevRounds) =>
      prevRounds.map((round, index) =>
        index === currentRound ? { ...round, correct: false } : round
      )
    );

    setTimeout(() => {
      if (currentRound + 1 === numRounds) {
        startOutroSequence(correctFirstTry); // ✅ triggers outro flow
      } else {
        setCurrentRound((prevRound) => prevRound + 1);
      }
      }, 1500);
  };

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
      const correctAnswer = (currentQuestion.correctAnswer || "").toLowerCase();

      console.log(`🔍 Processing RFID Answer: ${rfidData} (Expected: ${correctAnswer})`);

      setIsClickable(false);
      setRfidReceived(true);
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      setLastProcessedRFID(rfidData);

      const isAnswerCorrect = rfidData.trim().toLowerCase() === correctAnswer;
      console.log(`✅ Answer is ${isAnswerCorrect ? "Correct" : "Incorrect"}`);

      setIsCorrect(isAnswerCorrect);

      try {
        await axios.post("http://10.0.2.2:5001/rfid-result", {
          result: isAnswerCorrect ? "Correct" : "Incorrect",
        });
        console.log(`📡 Sent RFID Result: ${isAnswerCorrect ? "Correct" : "Incorrect"}`);
      } catch (error: any) {
        console.error("❌ Error sending RFID result:", error.message);
      }

      try {
        const authToken = await AsyncStorage.getItem("authToken");
        const response = await axios.put(
          "http://10.0.2.2:5000/api/students/update-score",
          {
            studentId: validStudentId,
            category: questionType,
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
        console.error("❌ Error updating student score:", error.message);
      }

      if (isAnswerCorrect) {
        handleCorrectAnswer();
      } else {
        handleWrongAnswer();
      }
    },
    [currentRound, rounds, isClickable, questionType, handleCorrectAnswer, handleWrongAnswer]
  );

  useEffect(() => {
    if (isGameRunning && !rfidReceived) {
      pollingIntervalRef.current = setInterval(fetchLatestRFIDAnswer, 3000);
    }
    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, [isGameRunning, currentRound, rfidReceived, fetchLatestRFIDAnswer]);

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

  const getQuestionText = () => {
    if (!rounds[currentRound]) return "";

    switch (questionType) {
      case "shape":
        return "Identify the shape";
      case "color":
        return "Identify the color";
      case "count":
        return "How many shapes do you see?";
      default:
        return "";
    }
  };

  const handleAudioPlaybackComplete = () => {
    console.log("Audio finished playing for this frame.");
  };

  const handlePlaybackStatusUpdate = useCallback((status) => {
    if (status.didJustFinish) {
      setPlaySound(false);
    }
  }, []);

  const startOutroSequence = (finalScore: number) => {
    setIsInOutroSequence(true);
    const outroScenes = storyScenes["outro"];

    if (outroScenes && outroScenes.length > 0) {
      setCurrentFrameIndex(0);
      setCurrentFrame(outroScenes[0]);
      setIsWaitingForTap(true);
    } else {
      endGame(finalScore);
    }
  };

  useEffect(() => {
    if (currentFrame?.type === FrameType.QUESTION) {
      startTimer();
    } else {
      stopTimer();
    }

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [currentFrame?.type]);

  const stopTimer = () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
  };

  const startTimer = () => {
    if (!timerInterval.current) {
      timerInterval.current = setInterval(() => {
        setTotalTime((prev) => prev + 1);
      }, 1000);
    }
  };

  const endGame = (finalScore: number) => {
    if (!gameEnded) {
      setGameEnded(true);
      setIsGameRunning(false);
      stopTimer();
      console.log("🚀 BEFORE SUBMISSION structuredRounds:", JSON.stringify(structuredRounds, null, 2));

      if (onGameComplete) {
        onGameComplete(totalTime, finalScore, structuredRounds);
      }
    }
  };

  if (!dialogues || !figures || Object.keys(figures).length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  useEffect(() => {
    if (currentFrame?.audio) {
      console.log("🎼 New Frame Audio Detected:", currentFrame.audio);
      setCurrentAudioSources([...currentFrame.audio]);
    } else {
      setCurrentAudioSources([]);
    }
  }, [currentFrame]);

  useEffect(() => {
    console.log(
      "🆕 Frame Changed:",
      currentFrame?.type,
      "Character:",
      currentFrame?.character
    );
    if (currentFrame?.audio) {
      console.log("🔊 Frame has audio files:", currentFrame.audio);
    }
  }, [currentFrame]);

  useEffect(() => {
    if (currentFrame?.character) {
      const characterKey = currentFrame.character.toUpperCase();
      setNpcImage(npcConfig[characterKey]?.idle || npcConfig["EVA"].idle);
    }
  }, [currentFrame]);

  return (
    <View style={styles.container}>
      {currentAudioSources.length > 0 && (
        <AudioChall
          audioSources={currentAudioSources}
          onPlaybackComplete={handleAudioPlaybackComplete}
        />
      )}

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

      <TouchableOpacity
        style={styles.fullScreenTouchable}
        onPress={() => {
          if (gameEnded) return;

          if (isWaitingForTap) {
            setIsWaitingForTap(false);

            if (
              currentFrame?.type === FrameType.CORRECT_ANSWER ||
              currentFrame?.type === FrameType.INCORRECT_ANSWER
            ) {
              const roundKey = `round${currentRound + 1}`;
              const followingFrames = storyScenes[roundKey].filter(
                (frame) => frame.type === FrameType.FOLLOWING
              );

              if (followingFrames.length > 0) {
                const nextIndex = storyScenes[roundKey].findIndex(
                  (frame) => frame.type === FrameType.FOLLOWING
                );
                setCurrentFrameIndex(nextIndex);
                setCurrentFrame(storyScenes[roundKey][nextIndex]);
                setIsWaitingForTap(true);
              } else {
                if (currentRound + 1 === numRounds) {
                  startOutroSequence(correctFirstTry);
                } else {
                  setCurrentRound(currentRound + 1);
                }
              }
              return;
            }

            if (currentFrame?.type === FrameType.FOLLOWING) {
              const roundKey = `round${currentRound + 1}`;
              const currentFrameIndex = storyScenes[roundKey].findIndex(
                (frame) => frame === currentFrame
              );
              const nextFollowingFrames = storyScenes[roundKey].filter(
                (frame, index) =>
                  frame.type === FrameType.FOLLOWING &&
                  index > currentFrameIndex
              );

              if (nextFollowingFrames.length > 0) {
                const nextIndex = storyScenes[roundKey].findIndex(
                  (frame, index) =>
                    frame.type === FrameType.FOLLOWING &&
                    index > currentFrameIndex
                );
                setCurrentFrameIndex(nextIndex);
                setCurrentFrame(storyScenes[roundKey][nextIndex]);
                setIsWaitingForTap(true);
              } else {
                if (currentRound + 1 === numRounds) {
                  startOutroSequence(correctFirstTry);
                } else {
                  setCurrentRound(currentRound + 1);
                }
              }
              return;
            }

            if (isInOutroSequence) {
              const outroScenes = storyScenes["outro"];

              if (currentFrameIndex < outroScenes.length - 1) {
                const nextIndex = currentFrameIndex + 1;
                setCurrentFrameIndex(nextIndex);
                setCurrentFrame(outroScenes[nextIndex]);
                setIsWaitingForTap(true);
              } else {
                setIsInOutroSequence(false);
                setGameEnded(true);
                setIsWaitingForTap(false);
                endGame(correctFirstTry);
              }
              return;
            }
          }

          if (currentFrame?.type === FrameType.QUESTION) {
            return;
          }

          if (!isInOutroSequence) {
            const roundKey = `round${currentRound + 1}`;
            const roundStory = storyScenes[roundKey];
            if (roundStory && currentFrameIndex < roundStory.length - 1) {
              const nextIndex = currentFrameIndex + 1;
              setCurrentFrameIndex(nextIndex);
              setCurrentFrame(roundStory[nextIndex]);
              setIsWaitingForTap(true);
            }
          }
        }}
      >
        <Image
          source={currentFrame?.background}
          style={styles.backgroundImage}
        />

        <Animated.View style={[styles.npcContainer, { opacity: fadeAnim }]}>
          <Animated.Image
            source={npcImage}
            style={[styles.npcImage, { transform: [{ scale: npcBounceAnim }] }]}
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

        {currentFrame?.type === FrameType.QUESTION && (
          <View style={styles.stopwatchContainer}>
            <Stopwatch 
              isRunning={true}
              onStop={(finalTime) => setTotalTime(finalTime)}
            />
          </View>
        )}

        {currentFrame?.type === FrameType.QUESTION && (
          <Text style={styles.roundText}>Round {currentRound + 1} of {numRounds}</Text>
        )}

        {currentFrame?.type === FrameType.QUESTION && (
          <>
            <View style={styles.itemContainer}>
              <Animated.Image
                source={rounds[currentRound]?.source}
                style={[
                  styles.itemImage,
                  { transform: [{ translateX: shakeAnim }] },
                ]}
              />
            </View>
          </>
        )}
      </TouchableOpacity>

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
    position: "absolute",
    top: "8%",
    width: "100%",
    alignItems: "center",
    zIndex: 30,
  },
  validationImage: {
    width: 44,
    height: 44,
    marginBottom: 15,
    resizeMode: "contain",
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
    paddingLeft: 85,
    paddingRight: 85,
    fontSize: 20,
  },
  npcDialogue: {
    lineHeight: 30,
    fontSize: 20,
    paddingLeft: 85,
    paddingRight: 85,
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
