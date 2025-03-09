import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Text, Animated, Vibration } from "react-native";
import Stopwatch from "../stopWatch";
import SettingsModal from "../setting";

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
  numRounds?: number;
}

export const BaseMediumGame: React.FC<BaseMediumGameProps> = ({
  categories,
  onGameComplete,
  navigation,
  npcConfig,
  dialogues,
  numRounds = 5
}) => {
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
    elapsedTimeRef.current = 0;
    setHasTried(false);
  };

  useEffect(() => {
    if (Object.keys(categories).length > 0) {
      generateRounds();
    }
  }, [generateRounds]);

  useEffect(() => {
    if (rounds.length > 0) {
      // Set current category type
      const currentType = rounds[currentRound].type || "";
      setCurrentCategoryType(currentType);
      
      // Generate options based on the current round's category
      generateOptions(currentType, rounds[currentRound].name);
      
      setIsCorrect(null);
      setIsClickable(true);
      setFeedbackText(dialogues?.idle?.[Math.floor(Math.random() * dialogues.idle.length)] || "Let's continue!");
      setNpcImage(npcConfig.idle);
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

  const handleCorrectAnswer = () => {
    setIsCorrect(true);
    const randomCorrectDialogue = dialogues?.correct?.[Math.floor(Math.random() * dialogues.correct.length)] || "Correct!";
    setFeedbackText(randomCorrectDialogue);
    animateNpcBounce();
    setNpcImage(npcConfig.correct);
    fadeInAnimation();
    setIsClickable(false);
  
    let updatedScore = correctFirstTry;
    if (!hasTried) {
      updatedScore += 1;
      setCorrectFirstTry(updatedScore);
    }
  
    setTimeout(() => {
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
    }, 1500);
  };

  const handleWrongAnswer = () => {
    setIsCorrect(false);
    const randomWrongDialogue = dialogues?.wrong?.[Math.floor(Math.random() * dialogues.wrong.length)] || "Try again!";
    setFeedbackText(randomWrongDialogue);
    setNpcImage(npcConfig.wrong);
    fadeInAnimation();
    animateNpcBounce();
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

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.pauseContainer} 
        onPress={() => {
          setIsPaused(true);
          setIsGameRunning(false);
        }}>
        <Image source={pauseBtn} style={styles.pause} />
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <View style={styles.validationContainer}>
          {isCorrect !== null && (
            <Image source={isCorrect ? correctImg : wrongImg} style={styles.validationImage} />
          )}
        </View>
      
        <Stopwatch 
          isRunning={isGameRunning} 
          onStop={(finalTime) => { 
            elapsedTimeRef.current = finalTime;
          }} 
        />
        <Text style={styles.roundText}>Round {currentRound + 1} of {numRounds}</Text>
        
        {rounds.length > 0 && currentCategoryType && (
          <Text style={styles.categoryTitle}>
            {getCategoryTitle(currentCategoryType)}
          </Text>
        )}

        {rounds.length > 0 && (
          <>
            <View style={styles.itemContainer}>
              <Animated.Image 
                source={rounds[currentRound].image} 
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
          navigation.navigate('Home');
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
    borderColor: "white"
  },
  npcName: {
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 5,
    paddingLeft: 60,
    fontSize: 18
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
    resizeMode: "contain"
  }
});