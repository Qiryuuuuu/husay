//ChallHardBase.tsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Text, Animated, Vibration } from "react-native";
import Stopwatch from "../stopWatch";
import SettingsModal from "../setting";
import AudioPlayer from "../../component/audio/AudioPlayer"; 
import AudioChall from "../audio/ChallAudio";
import { FrameType } from "../game/challenge/HardMode/ChallengeHard";
import figures from "../../data/hardQuestions";

const pauseBtn = require("../../../assets/buttons/pause.png");
const pauseHeader = require("../../../assets/headerText/pause-header.png");
const correctImg = require("../../../assets/validation/correct.png");
const wrongImg = require("../../../assets/validation/wrong.png");
const modalBg = require("../../../assets/gameBackground/setting-bg.png");

const shapeOptions = ["Rectangle", "Triangle", "Square", "Circle"];
const colorOptions = ["Red", "Blue", "Green", "Yellow"];
const countOptions = ["1", "2", "3", "4", "5"]; 

interface FigureProperties {
  shape: string;
  color: string;
  count: string;
}

interface Figure {
  source: any;
  properties: FigureProperties;
  questionType?: 'shape' | 'color' | 'count';
  correctAnswer?: string;
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
  figures: {
    house: Figure[];
    car: Figure[];
    rocket: Figure[];
    flower: Figure[];
    robot: Figure[];
  };
  onGameComplete: (time: number, score: number) => void;
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
    dialogues?.idle?.[Math.floor(Math.random() * dialogues.idle.length)] || "Let's begin!"
  );
  const [isGameRunning, setIsGameRunning] = useState(true);
  const [correctFirstTry, setCorrectFirstTry] = useState(0);
  const [hasTried, setHasTried] = useState(false);
  const [selectedFigureType, setSelectedFigureType] = useState<string | null>(null);
  const [questionType, setQuestionType] = useState<'shape' | 'color' | 'count'>('shape');

  const elapsedTimeRef = useRef(0);
  const fadeAnim = useState(new Animated.Value(1))[0];
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const npcBounceAnim = useRef(new Animated.Value(1)).current;
  const hasTriedRef = useRef(false);

  const generateRounds = useCallback(() => {
    const figureTypes = Object.keys(figures);
    if (figureTypes.length === 0) return;
    
    const randomFigureType = figureTypes[Math.floor(Math.random() * figureTypes.length)];
    setSelectedFigureType(randomFigureType);
    
    const selectedFigures = figures[randomFigureType];
    if (!selectedFigures || !selectedFigures[0]?.properties) {
      console.error('Invalid figure data:', randomFigureType, selectedFigures);
      return;
    }
    
    let allRounds: Figure[] = [];

    // Generate shape rounds (1-5)
    for (let i = 0; i < numShapeRounds; i++) {
      allRounds.push({
        ...selectedFigures[i + 1],
        questionType: 'shape',
        correctAnswer: selectedFigures[i + 1].properties.shape
      });
    }

    // Generate color rounds (6-10)
    for (let i = 0; i < numColorRounds; i++) {
      allRounds.push({
        ...selectedFigures[i + 1],
        questionType: 'color',
        correctAnswer: selectedFigures[i + 1].properties.color
      });
    }

    // Add count round (11)
    if (includeCountRound) {
      allRounds.push({
        ...selectedFigures[0],
        questionType: 'count',
        correctAnswer: selectedFigures[0].properties.count
      });
    }
    
    setRounds(allRounds);
    resetGameState();
  }, [figures, numShapeRounds, numColorRounds, includeCountRound]);

  const resetGameState = () => {
    setCurrentRound(0);
    setIsCorrect(null);
    setIsClickable(true);
    setFeedbackText(dialogues?.idle?.[Math.floor(Math.random() * dialogues.idle.length)] || "Let's begin!");
    setNpcImage(npcConfig.idle);
    setIsGameRunning(true);
    setCorrectFirstTry(0);
    elapsedTimeRef.current = 0;
    setHasTried(false);
  };

  useEffect(() => {
    if (figures && Object.keys(figures).length > 0) {
      generateRounds();
      console.log("Initial Score:", correctFirstTry); // Add this line
    }
  }, [generateRounds, figures]);

  useEffect(() => {
    if (rounds.length > 0 && currentRound < rounds.length) {
      const currentQuestion = rounds[currentRound];
      if (!currentQuestion) {
        console.error('Invalid round data:', currentRound, rounds);
        return;
      }
      
      setQuestionType(currentQuestion.questionType || 'shape');
      
      let roundOptions: string[] = [];
      switch (currentQuestion.questionType) {
        case 'shape':
          roundOptions = [...shapeOptions];
          break;
        case 'color':
          roundOptions = [...colorOptions];
          break;
        case 'count':
          roundOptions = [...countOptions];
          break;
      }
      
      setOptions(roundOptions.sort(() => Math.random() - 0.5));
      setIsCorrect(null);
      setIsClickable(true);
      setFeedbackText(dialogues?.idle?.[Math.floor(Math.random() * dialogues.idle.length)] || "Let's continue!");
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

const handleSelection = useCallback((selectedAnswer: string) => {
  if (!isClickable || currentRound >= rounds.length) return;

  const normalizedSelection = selectedAnswer.toLowerCase();
  const normalizedCorrectAnswer = (rounds[currentRound].correctAnswer || '').toLowerCase();

  if (normalizedSelection === normalizedCorrectAnswer) {
    handleCorrectAnswer();
  } else {
    handleWrongAnswer();
  }
}, [currentRound, rounds, isClickable]);

const handleCorrectAnswer = () => {
  setIsCorrect(true);
  const randomCorrectDialogue = dialogues?.correct?.[Math.floor(Math.random() * dialogues.correct.length)] || "Correct!";
  setFeedbackText(randomCorrectDialogue);
  animateNpcBounce();
  const characterKey = currentFrame?.character.toUpperCase();
  setNpcImage(npcConfig[characterKey]?.correct || npcConfig["EVA"].correct);
  fadeInAnimation();
  setIsClickable(false);

  // Check the ref instead of state
  if (!hasTriedRef.current) {
    setCorrectFirstTry(prevScore => {
      console.log(`Round ${currentRound + 1}: Correct on first try! Score: ${prevScore + 1}`);
      return prevScore + 1;
    });
  }

  // Reset the ref for the next round
  hasTriedRef.current = false;

  if (currentRound === 4 || currentRound === 9 || currentRound === 10) {
    const roundKey = `round${currentRound + 1}`;
    const correctFrame = storyScenes[roundKey].find(frame => frame.type === FrameType.CORRECT_ANSWER);
    if (correctFrame) {
      setCurrentFrame(correctFrame);
      setIsWaitingForTap(true);
      return;
    }
  } else {
    if (!hasTriedRef.current) {
      setTimeout(() => {
        setCurrentRound(prevRound => {
          console.log(`Moving to Round ${prevRound + 2}`);
          hasTriedRef.current = false;
          return prevRound + 1;
        });
      }, 1500);
    } else {
      console.log(`Round ${currentRound + 1}: Correct but not first try. Restarting round.`);
      setTimeout(() => {
        setIsClickable(true);
        setIsCorrect(null);
        hasTriedRef.current = false;
        const roundKey = `round${currentRound + 1}`;
        const questionFrame = storyScenes[roundKey].find(frame => frame.type === FrameType.QUESTION);
        if (questionFrame) {
          setCurrentFrame(questionFrame);
        }
      }, 1500);
    }
  }
};


const handleWrongAnswer = () => {
  setIsCorrect(false);
  setFeedbackText(dialogues?.wrong?.[Math.floor(Math.random() * dialogues.wrong.length)] || "Try again!");
  const characterKey = currentFrame?.character.toUpperCase();
  setNpcImage(npcConfig[characterKey]?.wrong || npcConfig["EVA"].wrong);
  fadeInAnimation();
  animateNpcBounce();
  triggerShake();
  Vibration.vibrate(100);

  // Mark that the player has tried using the ref
  hasTriedRef.current = true;
  console.log(`Round ${currentRound + 1}: Wrong answer. hasTriedRef set to true.`);
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

  const getQuestionText = () => {
    if (!rounds[currentRound]) return "";
    
    switch(questionType) {
      case 'shape':
        return "Identify the shape";
      case 'color':
        return "Identify the color";
      case 'count':
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
    
  const startOutroSequence = (finalScore) => {
    setIsInOutroSequence(true);
    const outroScenes = storyScenes["outro"];
  
    if (outroScenes && outroScenes.length > 0) {
      setCurrentFrameIndex(0);
      setCurrentFrame(outroScenes[0]);
      setIsWaitingForTap(true);
    } else {
      // If there are no outro scenes, end the game immediately
      endGame(finalScore);
    }
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
        setTotalTime(prev => prev + 1);
      }, 1000);
    }
  };
  
  const endGame = (finalScore) => {
    if (!gameEnded) {
      setGameEnded(true);
      setIsGameRunning(false);
      stopTimer();
  
      if (onGameComplete) {
        // Use the score passed to this function
        onGameComplete(totalTime, finalScore);
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
        }}>
        <Image source={pauseBtn} style={styles.pause} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.fullScreenTouchable} 
        onPress={() => {
          if (gameEnded) return;
        
          if (isWaitingForTap) {
            setIsWaitingForTap(false);
        
            if (currentFrame?.type === FrameType.CORRECT_ANSWER || currentFrame?.type === FrameType.INCORRECT_ANSWER) {
              const roundKey = `round${currentRound + 1}`;
              const followingFrames = storyScenes[roundKey].filter(frame => frame.type === FrameType.FOLLOWING);
              
              if (followingFrames.length > 0) {
                // Find the first FOLLOWING frame
                const nextIndex = storyScenes[roundKey].findIndex(frame => frame.type === FrameType.FOLLOWING);
                setCurrentFrameIndex(nextIndex);
                setCurrentFrame(storyScenes[roundKey][nextIndex]);
                setIsWaitingForTap(true);
              } else {
                // No FOLLOWING frames, move to next round
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
              const currentFrameIndex = storyScenes[roundKey].findIndex(frame => frame === currentFrame);
              const nextFollowingFrames = storyScenes[roundKey].filter((frame, index) => 
                frame.type === FrameType.FOLLOWING && index > currentFrameIndex
              );
              
              if (nextFollowingFrames.length > 0) {
                // Find the next FOLLOWING frame
                const nextIndex = storyScenes[roundKey].findIndex((frame, index) => 
                  frame.type === FrameType.FOLLOWING && index > currentFrameIndex
                );
                setCurrentFrameIndex(nextIndex);
                setCurrentFrame(storyScenes[roundKey][nextIndex]);
                setIsWaitingForTap(true);
              } else {
                // No more FOLLOWING frames, move to next round
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
                // Use the current score state when ending the game after outro
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
        }}>

        <Image source={currentFrame?.background} style={styles.backgroundImage} />

        <Animated.View style={[styles.npcContainer, { opacity: fadeAnim }]}>
          <Animated.Image 
            source={npcImage} 
            style={[styles.npcImage, { transform: [{ scale: npcBounceAnim }] }]} 
          />
          <View style={styles.dialogueContainer}>
            <Text style={styles.npcName}>{currentFrame?.character || "Unknown"}</Text>
            <Text style={styles.npcDialogue}>{currentFrame?.dialogues?.[0] || ""}</Text>
          </View>
        </Animated.View>

        {currentFrame?.type === FrameType.QUESTION && (
          <View style={styles.validationContainer}>
            {isCorrect !== null && (
              <Image source={isCorrect ? correctImg : wrongImg} style={styles.validationImage} />
            )}
          </View>
        )}

        {currentFrame?.type === FrameType.QUESTION && (
          <Stopwatch 
            isRunning={true}
            onStop={(finalTime) => setTotalTime(finalTime)}
          />
        )}

        {currentFrame?.type === FrameType.QUESTION && (
          <Text style={styles.roundText}>Round {currentRound + 1} of {numRounds}</Text>
        )}

        {currentFrame?.type === FrameType.QUESTION && (
          <>
            <View style={styles.itemContainer}>
              <Animated.Image 
                source={rounds[currentRound]?.source} 
                style={[styles.itemImage, { transform: [{ translateX: shakeAnim }] }]} 
              />
            </View>

            <View style={styles.buttonContainer}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelection(option)}
                  style={[
                    styles.button,
                    !isClickable && styles.disabledButton
                  ]}
                  disabled={!isClickable}
                >
                  <Text style={styles.buttonText}>{option}</Text>
                </TouchableOpacity>
              ))}
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
    paddingLeft: 85,
    paddingRight: 85,
    fontSize: 20
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
    resizeMode: "contain"
  }
});