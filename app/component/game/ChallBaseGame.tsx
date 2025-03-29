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

interface CategoryData {
  [key: string]: CategoryItem[];
}

interface BaseGameProps {
  categories: CategoryData;
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

  const fadeAnim = useState(new Animated.Value(1))[0];
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Counters if you want them, not mandatory
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  const generateRounds = useCallback(() => {
    const categoryTypes = Object.keys(categories);

    if (categoryTypes.length === 0) {
      console.error("❌ ERROR: No categories available!");
      return;
    }

    let selectedRounds: CategoryItem[] = [];

    // If there’s only one category, just pull from it directly
    const categoryName = categoryTypes[0]; // ✅ Always use "color" (or whatever is the only category)
    const categoryItems = categories[categoryName];

    if (!categoryItems || categoryItems.length === 0) {
      console.error(`❌ ERROR: No items in category '${categoryName}'`);
      return;
    }

    // Shuffle the category items and select `numRounds`
    let shuffledItems = [...categoryItems].sort(() => Math.random() - 0.5);

    // Ensure we have exactly `numRounds` items
    while (selectedRounds.length < numRounds && shuffledItems.length > 0) {
      const item = shuffledItems.pop();
      if (item && item.name) {
        selectedRounds.push({ ...item, type: categoryName }); // ✅ Always set `type` correctly
      } else {
        console.error("❌ ERROR: Item is missing a valid name.");
      }
    }

    if (selectedRounds.length < numRounds) {
      console.warn(
        `⚠️ Warning: Only ${selectedRounds.length} rounds available instead of ${numRounds}.`
      );
    }

    console.log("✅ Generated Rounds:", selectedRounds);
    setRounds(selectedRounds);
    resetGameState();
  }, [categories, numRounds]);

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
  };

  // On mount, generate the random set of rounds
  useEffect(() => {
    if (Object.keys(categories).length > 0) {
      generateRounds();
    }
  }, [generateRounds]);

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

  useEffect(() => {
    if (rounds.length > 0) {
      // Load frames
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

    // Add correct, shuffle
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

  // Whenever totalTime changes, sync the ref:
  useEffect(() => {
    elapsedTimeRef.current = totalTime;
  }, [totalTime]);

  // Move to next round or end
  const moveToNextRound = (updatedScore: number) => {
    if (currentRound < numRounds) {
      setCurrentRound(currentRound + 1);
    } else {
      setIsGameRunning(false);
      setTimeout(() => {
        if (onGameComplete) {
          // We pass updatedScore as the final score
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
        correct: true, // ✅ set round as correct
      };
      return updated;
    });

    // Show correct answer feedback if it exists
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

    // If the user hasn't tried yet, increment updatedScore
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
        correct: false, // ✅ set round as incorrect
      };
      return updated;
    });

    // Show incorrect answer feedback if it exists
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

  // End entire game
  const endGame = async (finalScore: number) => {
    if (!gameEnded) {
      console.log(
        "🎉 Ending Game with Score:",
        finalScore,
        "Elapsed Time:",
        totalTime
      );
      console.log(
        "🔍 Checking rounds before sending to onGameComplete:",
        rounds
      );

      if (!rounds || rounds.length === 0) {
        console.error("❌ ERROR: Rounds array is empty or undefined!");
      }

      setGameEnded(true);
      setIsGameRunning(false);
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
            return; // Prevent progression during the question phase or after the game ends
          }

          if (isWaitingForTap) {
            setIsWaitingForTap(false);

            // Handle progression after correct/incorrect feedback
            if (
              currentFrame?.type === FrameType.CORRECT_ANSWER ||
              currentFrame?.type === FrameType.INCORRECT_ANSWER
            ) {
              moveToNextRound(correctFirstTry);
              return;
            }
          }

          // Default behavior: Progress to the next frame
          const roundStory = storyScenes[`round${currentRound + 1}`];
          if (roundStory && currentFrameIndex < roundStory.length - 1) {
            const nextIndex = currentFrameIndex + 1;
            setCurrentFrameIndex(nextIndex);
            setCurrentFrame(roundStory[nextIndex]);
            setIsWaitingForTap(true);
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
            style={[styles.npcImage]}
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

        {/* Show Stopwatch Only During Question Frames */}
        {currentFrame?.type === FrameType.QUESTION && (
          <Stopwatch
            isRunning={true} // Ensure it runs
            onStop={(finalTime) => setTotalTime(finalTime)} // Store elapsed time
          />
        )}

        {/* Round Info */}
        {currentFrame?.type === FrameType.QUESTION && (
          <Text style={styles.roundText}>Round {currentRound + 1} of 5</Text>
        )}

        {/* Show Question & Answers ONLY if it's the question phase */}
        {currentFrame?.type === FrameType.QUESTION && (
          <>
            <View style={styles.itemContainer}>
              <Animated.Image
                source={rounds[currentRound]?.image}
                style={[
                  styles.itemImage,
                  { transform: [{ translateX: shakeAnim }] },
                ]}
              />
            </View>

            <View style={styles.buttonContainer}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelection(option.name)}
                  style={[styles.button, !isClickable && styles.disabledButton]}
                  disabled={!isClickable}
                >
                  <Text style={styles.buttonText}>{option.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
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
    zIndex: 1, // Ensures it receives taps
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
  roundText: {
    backgroundColor: "rgba(0,0,0,0.7)",
    color: "white",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 15,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
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
