//ChallMediumBase.tsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Text, Animated, Vibration } from "react-native";
import Stopwatch from "../stopWatch";
import SettingsModal from "../setting";
import AudioPlayer from "../../component/audio/AudioPlayer"; 
import AudioChall from "../audio/ChallAudio";
import { FrameType } from "../game/challenge/MediumMode/ChallengeMedium"

const pauseBtn = require("../../../assets/buttons/pause.png");
const pauseHeader = require("../../../assets/headerText/pause-header.png");
const correctImg = require("../../../assets/validation/correct.png");
const wrongImg = require("../../../assets/validation/wrong.png");
const modalBg = require("../../../assets/gameBackground/setting-bg.png");

interface CategoryItem {
  name: string;
  image: any;
  type?: string;
}

interface CategoryData {
  [key: string]: CategoryItem[];
}

interface NpcConfig {
  idle: any;
  correct: any;
  wrong: any;
  name: string;
}

interface Dialogues {
  idle: string[];
  correct: string[];
  wrong: string[];
}

interface BaseMediumGameProps {
  categories: CategoryData;
  onGameComplete: (time: number, score: number) => void;
  navigation: any;
  npcConfig: NpcConfig;
  dialogues: Dialogues;
  storyScenes: any;
  outro: any;
  numRounds?: number;
}

export const BaseMediumGame: React.FC<BaseMediumGameProps> = ({
  categories,
  onGameComplete,
  navigation,
  npcConfig,
  dialogues,
  storyScenes,
  outro,
  numRounds = 5
}) => {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);  // Track which frame of the story is active
  const [currentFrame, setCurrentFrame] = useState(null);  // Stores current frame details
  const [isWaitingForTap, setIsWaitingForTap] = useState(false); // Tracks if the game is waiting for user tap
  const [isInOutroSequence, setIsInOutroSequence] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  // Add state for audio playback
  const [currentSound, setCurrentSound] = useState<any>(null);
  const [playSound, setPlaySound] = useState(false);

  const [currentAudioSources, setCurrentAudioSources] = useState([]);

  const [totalTime, setTotalTime] = useState(0);  // ✅ Track total elapsed time
  const timerInterval = useRef<NodeJS.Timeout | null>(null);  // ✅ Timer reference

  const [isPaused, setIsPaused] = useState(false);
  const [rounds, setRounds] = useState<CategoryItem[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [options, setOptions] = useState<CategoryItem[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isClickable, setIsClickable] = useState(true);
  const [feedbackText, setFeedbackText] = useState(
    dialogues?.idle?.[Math.floor(Math.random() * dialogues.idle.length)] || "Let's begin!"
  );
  const [npcImage, setNpcImage] = useState(npcConfig.idle);
  const [isGameRunning, setIsGameRunning] = useState(true);
  const [correctFirstTry, setCorrectFirstTry] = useState(0);
  const [currentCategoryType, setCurrentCategoryType] = useState("");
  const [hasTried, setHasTried] = useState(false);

  const [totalElapsedTime, setTotalElapsedTime] = useState(0);

  const elapsedTimeRef = useRef(0);
  const fadeAnim = useState(new Animated.Value(1))[0];
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const npcBounceAnim = useRef(new Animated.Value(1)).current;

  const generateRounds = useCallback(() => {
    // Get all category types
    const categoryTypes = Object.keys(categories);
    
    // Select one category to be guaranteed in the game
    const guaranteedCategoryIndex = Math.floor(Math.random() * categoryTypes.length);
    const guaranteedCategory = categoryTypes[guaranteedCategoryIndex];
    
    // Create an array to hold the remaining categories
    const remainingCategories = categoryTypes.filter(cat => cat !== guaranteedCategory);
    
    // Create empty rounds array
    let selectedRounds: CategoryItem[] = [];
    
    // Ensure we have one round from the guaranteed category
    const guaranteedCategoryItems = categories[guaranteedCategory];
    const guaranteedItem = {
      ...guaranteedCategoryItems[Math.floor(Math.random() * guaranteedCategoryItems.length)],
      type: guaranteedCategory
    };
    
    selectedRounds.push(guaranteedItem);
    
    // Create a pool of all possible items from remaining categories
    let itemPool: CategoryItem[] = [];
    
    remainingCategories.forEach(category => {
      // Add items with their category
      categories[category].forEach(item => {
        itemPool.push({ ...item, type: category });
      });
    });
    
    // Shuffle the item pool
    itemPool.sort(() => Math.random() - 0.5);
    
    // Select remaining items to complete our rounds
    const additionalItems = itemPool.slice(0, numRounds - 1);
    selectedRounds = [...selectedRounds, ...additionalItems];
    
    // Final shuffle of the rounds to randomize order
    selectedRounds.sort(() => Math.random() - 0.5);
    
    setRounds(selectedRounds);
    resetGameState();
  }, [categories, numRounds]);

  const resetGameState = () => {
    setCurrentRound(0);
    setIsCorrect(null);
    setIsClickable(true);
    setFeedbackText(dialogues?.idle?.[Math.floor(Math.random() * dialogues.idle.length)] || "Let's begin!");
    setNpcImage(npcConfig.idle);
    setIsGameRunning(true);
    setCorrectFirstTry(0);
    setHasTried(false);
  };
  

  useEffect(() => {
    if (currentFrame?.type === FrameType.QUESTION) {
      startTimer();  // ✅ Start when in a question
    } else {
      stopTimer();   // ✅ Stop when leaving a question
    }
  
    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [currentFrame?.type]);  // ✅ Runs only when frame type changes
  
  const startTimer = () => {
    if (!timerInterval.current) {
      timerInterval.current = setInterval(() => {
        setTotalTime(prev => prev + 1);  // ✅ Increment every second
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
    if (Object.keys(categories).length > 0) {
      generateRounds();
    }
  }, [generateRounds]);

  useEffect(() => {
    if (rounds.length > 0) {
      // Fetch the story sequence for the current round
      const roundStory = storyScenes[`round${currentRound + 1}`];  
      if (roundStory) {
        setCurrentFrame(roundStory[0]); // Start with the first frame of the round
        setCurrentFrameIndex(0);
      }

      const currentType = rounds[currentRound]?.type || "";
      setCurrentCategoryType(currentType);
      
      generateOptions(currentType, rounds[currentRound]?.name);
  
      // Set initial NPC and state
      setNpcImage(npcConfig.idle);
      setIsCorrect(null);
      setIsClickable(true);
      setHasTried(false);
    }
  }, [currentRound, rounds]);
  
  const generateOptions = (type: string, correctAnswer: string) => {
    if (!type || !categories[type]) {
      console.error(`Error: Invalid category type '${type}'`);
      return;
    }

    const categoryArray = categories[type];
    
    // Filter out the correct answer
    const otherOptions = categoryArray.filter(item => item.name !== correctAnswer);
    
    // Shuffle and select wrong options (up to 6)
    const shuffledOptions = otherOptions.sort(() => Math.random() - 0.5);
    const wrongOptions = shuffledOptions.slice(0, Math.min(6, shuffledOptions.length));
    
    // Add the correct answer and shuffle again
    const allOptions = [
      ...wrongOptions, 
      categoryArray.find(item => item.name === correctAnswer) || { name: correctAnswer, image: null }
    ];
    
    setOptions(allOptions.sort(() => Math.random() - 0.5));
  };

  const getCategoryTitle = (type: string) => {
    switch (type) {
      case "shape": return "Identify the Shape";
      case "color": return "Identify the Color";
      case "number": return "Identify the Number";
      default: return `Identify the ${type}`;
    }
  };

  const handleSelection = useCallback((selectedName: string) => {
    if (!isClickable) return;

    if (selectedName === rounds[currentRound].name) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
    }
  }, [currentRound, rounds, isClickable, correctFirstTry, hasTried]);

  const moveToNextRound = (updatedScore: number) => {
    if (currentRound < numRounds - 1) {
      setCurrentRound(currentRound + 1);
    } else {
      setIsGameRunning(false);
      setTimeout(() => {
        if (onGameComplete) {
          onGameComplete(elapsedTimeRef.current, updatedScore);
        }
      }, 500);
    }
  };
  

  const showFollowingFrame = (updatedScore: number) => {
    const roundStory = storyScenes[`round${currentRound + 1}`];
    const followingFrame = roundStory.find(frame => frame.type === FrameType.FOLLOWING);
  
    if (followingFrame) {
      setCurrentFrame(followingFrame);
      setIsWaitingForTap(true);
      return;
    }
  
    if (currentRound + 1 === numRounds) {
      console.log("🎬 Transitioning to Outro...");
      startOutroSequence(updatedScore); // ✅ Start outro after the last round
      return;
    }
  
    moveToNextRound(updatedScore);
  };
  
    // Audio playback status handler
    const handlePlaybackStatusUpdate = useCallback((status) => {
      if (status.didJustFinish) {
        setPlaySound(false);
      }
    }, []);
  
  const startOutroSequence = (updatedScore: number) => {
    setIsInOutroSequence(true); // ✅ Mark that we are now in the outro sequence
    const outroScenes = storyScenes["outro"];
  
    if (outroScenes && outroScenes.length > 0) {
      console.log("🚀 Starting Outro Sequence");
      setCurrentFrameIndex(0);
      setCurrentFrame(outroScenes[0]);
      setIsWaitingForTap(true);
    } else {
      console.log("❌ No Outro Scenes Found - Ending Game");
      endGame(updatedScore);
    }
  };
  
  const endGame = (finalScore: number) => {
    if (!gameEnded) {
      console.log("🎉 Ending Game with Score:", finalScore, "Elapsed Time:", totalTime);
      setGameEnded(true);
      setIsGameRunning(false);
      stopTimer();  // ✅ Ensure timer stops
  
      if (onGameComplete) {
        onGameComplete(totalTime, finalScore);  // ✅ Pass correct elapsed time
      }
    }
  };
  
  

  const showPostRoundNarration = (updatedScore: number) => {
    const roundStory = storyScenes[`round${currentRound + 1}`];
    const animalReactionFrame = roundStory.find(frame => frame.type === FrameType.ANIMAL_REACTION);
  
    if (animalReactionFrame) {
      setCurrentFrame(animalReactionFrame);
      setIsWaitingForTap(true); // ✅ Wait for tap to show FOLLOWING
      return;
    }
  
    showFollowingFrame(updatedScore); // ✅ Pass updatedScore to next function
  };
  
  


  const handleCorrectAnswer = () => {
    setIsCorrect(true);
  
    // Get correct answer feedback frame
    const roundStory = storyScenes[`round${currentRound + 1}`];
    const correctFrame = roundStory.find(frame => frame.type === FrameType.CORRECT_ANSWER);
    
    if (correctFrame) {
      setCurrentFrame(correctFrame);
      setIsWaitingForTap(true); // ✅ Wait for tap instead of using setTimeout
    }
  
    setNpcImage(npcConfig.correct);
    fadeInAnimation();
    setIsClickable(false);
  
    let updatedScore = correctFirstTry;
    if (!hasTried) {
      updatedScore += 1;
      setCorrectFirstTry(updatedScore);
    }
  };
  
  
  const handleWrongAnswer = () => {
    setIsCorrect(false);
  
    // Get incorrect answer feedback frame
    const roundStory = storyScenes[`round${currentRound + 1}`];
    const incorrectFrame = roundStory.find(frame => frame.type === FrameType.INCORRECT_ANSWER);
    
    if (incorrectFrame) {
      setCurrentFrame(incorrectFrame);
      setIsWaitingForTap(true); // ✅ Wait for tap instead of using setTimeout
    }
  
    setNpcImage(npcConfig.wrong);
    fadeInAnimation();
    triggerShake();
    Vibration.vibrate(100);
    setHasTried(true);
  };
  

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const animateNpcBounce = () => {
    Animated.sequence([
      Animated.timing(npcBounceAnim, { toValue: 1.1, duration: 150, useNativeDriver: true }),
      Animated.timing(npcBounceAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
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

  useEffect(() => {
    if (currentFrame?.audio) {
        console.log("🎼 New Frame Audio Detected:", currentFrame.audio);
        setCurrentAudioSources([...currentFrame.audio]); // ✅ Ensure all audios are set
    } else {
        setCurrentAudioSources([]); // ✅ Clear audio if the frame has no sound
    }
}, [currentFrame]);


useEffect(() => {
  console.log("🆕 Frame Changed:", currentFrame?.type, "Character:", currentFrame?.character);
  if (currentFrame?.audio) {
      console.log("🔊 Frame has audio files:", currentFrame.audio);
  }
}, [currentFrame]);


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


        {/* Include AudioPlayer component */}
        {playSound && currentSound && (
          <AudioPlayer 
            audioSource={currentSound}
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            autoPlay={true}
          />
        )}
  
      {/* Pause Button */}
      <TouchableOpacity 
        style={styles.pauseContainer} 
        onPress={() => {
          setIsPaused(true);
          setIsGameRunning(false);
        }}>
        <Image source={pauseBtn} style={styles.pause} />
      </TouchableOpacity>
  
      {/* Full-Screen Touchable for Progression */}
      <TouchableOpacity 
  style={styles.fullScreenTouchable} 
  onPress={() => {
    if (gameEnded) {
      return; // ✅ Prevent interactions if the game has ended
    }

    console.log("📌 Current Frame Type:", currentFrame?.type);
    console.log("🔹 Current Frame Index:", currentFrameIndex);
    console.log("🔹 Current Character:", currentFrame?.character);

    if (isWaitingForTap) {
      setIsWaitingForTap(false);

      // Handle Correct/Incorrect Feedback -> Move to Post-Round Narration
      if (currentFrame?.type === FrameType.CORRECT_ANSWER || currentFrame?.type === FrameType.INCORRECT_ANSWER) {
        showPostRoundNarration(correctFirstTry);
        return;
      }

      // Handle Post-Round Narration -> Move to Following Scene
      if (currentFrame?.type === FrameType.ANIMAL_REACTION) {
        showFollowingFrame(correctFirstTry);
        return;
      }

      // Handle Following Scene -> Move to Outro (if last round) or Next Round
      if (currentFrame?.type === FrameType.FOLLOWING) {
        if (currentRound + 1 === numRounds) {
          startOutroSequence(correctFirstTry);
        } else {
          moveToNextRound(correctFirstTry);
        }
        return;
      }

      // Handle Outro Sequence Properly
      if (isInOutroSequence) {
        const outroScenes = storyScenes["outro"];
        console.log("🎬 Outro Progression - Current Index:", currentFrameIndex, "/", outroScenes.length - 1);
        
        if (currentFrameIndex < outroScenes.length - 1) {
          const nextIndex = currentFrameIndex + 1;
          console.log("🔄 Moving to next outro frame:", nextIndex);
          setCurrentFrameIndex(nextIndex);
          setCurrentFrame(outroScenes[nextIndex]);
          setIsWaitingForTap(true);
        } else {
          console.log("🎉 Outro Complete - Ending Game");
          setIsInOutroSequence(false);
          setGameEnded(true); // ✅ Prevent extra taps
          setIsWaitingForTap(false);
          endGame(correctFirstTry);
        }
        return;
      }
    }

    // Prevent skipping the question phase
    if (currentFrame?.type === FrameType.QUESTION) {
      return;
    }

    // Default Behavior: Progress to Next Story Frame
    if (!isInOutroSequence) {
      const roundStory = storyScenes[`round${currentRound + 1}`];
      if (roundStory && currentFrameIndex < roundStory.length - 1) {
        const nextIndex = currentFrameIndex + 1;
        setCurrentFrameIndex(nextIndex);
        setCurrentFrame(roundStory[nextIndex]);
        setIsWaitingForTap(true);
      }
    }
  }}
>


        {/* Background Image */}
        <Image source={currentFrame?.background} style={styles.backgroundImage} />
  
        {/* NPC & Dialogue Box */}
        <Animated.View style={[styles.npcContainer, { opacity: fadeAnim }]}>
          <Animated.Image 
            source={currentFrame?.character === "EVA" ? npcImage : null} 
            style={[styles.npcImage, { transform: [{ scale: npcBounceAnim }] }]} 
          />
          <View style={styles.dialogueContainer}>
            <Text style={styles.npcName}>{currentFrame?.character || "Unknown"}</Text>
            <Text style={styles.npcDialogue}>{currentFrame?.dialogues?.[0] || ""}</Text>
          </View>
        </Animated.View>
  
        {/* Validation Feedback (Correct / Incorrect) */}
        {currentFrame?.type === FrameType.QUESTION && (
          <View style={styles.validationContainer}>
            {isCorrect !== null && (
              <Image source={isCorrect ? correctImg : wrongImg} style={styles.validationImage} />
            )}
          </View>
        )}

      {/* Show Stopwatch Only During Question Frames */}
      {currentFrame?.type === FrameType.QUESTION && (
        <Stopwatch 
          isRunning={true}  // ✅ Ensure it runs
          onStop={(finalTime) => setTotalTime(finalTime)}  // ✅ Store elapsed time
        />
      )}



        {/* Round Info */}
        {currentFrame?.type === FrameType.QUESTION && (
          <Text style={styles.roundText}>Round {currentRound + 1} of {numRounds}</Text>
        )}
  
        {/* Show Question & Answers ONLY if it's the question phase */}
        {currentFrame?.type === FrameType.QUESTION && (
        <>
          <View style={styles.itemContainer}>
            <Animated.Image 
              source={rounds[currentRound]?.image} 
              style={[styles.itemImage, { transform: [{ translateX: shakeAnim }] }]} 
            />
          </View>

          <View style={styles.buttonContainer}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelection(option.name)}
                style={[
                  styles.button,
                  !isClickable && styles.disabledButton
                ]}
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
          navigation.navigate('Home');
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
    zIndex: 1,  // Ensures it receives taps
    flex: 1
  },
  pauseContainer: {
    zIndex: 100,
    position: "absolute",
    top: 40,
    left: 50
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
    zIndex: 10
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
    fontWeight: "bold"
  },
  button: {
    backgroundColor: "#5A8EF4",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    width: 120,
    alignItems: "center",
    zIndex: 20,
    marginBottom: 10
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
    borderColor: "white"
  },
  npcName: {
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 5,
    paddingLeft: 50,
    fontSize: 20
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
    resizeMode: "contain"
  }
});