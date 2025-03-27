//GameFlowChallenge.js
import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, ImageBackground, Animated, Easing, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const GameFlows = ({
  backgroundImg,
  DialogComponent,
  CountdownComponent,
  GameComponent,
  StageCompletionComponent,
  navigation,
  studentId,
  subject,
  element,
  rounds = [],
}) => {
  const [gamePhase, setGamePhase] = useState("dialog");
  const [finalTime, setFinalTime] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [gameState, setGameState] = useState("question");
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const backgroundOpacity = useRef(new Animated.Value(1)).current;
  const [finalStars, setFinalStars] = useState(1);
  const totalRounds = rounds.length;

  
  const getAuthToken = async () => {
    return await AsyncStorage.getItem('authToken');
  };

  useEffect(() => {
    let overlayToValue = 1;
    let overlayDuration = 1500;

    if (gamePhase === "countdown") {
      overlayToValue = 0;
      overlayDuration = 2000;
    } else if (gamePhase === "game") {
      overlayToValue = 0;
      overlayDuration = 500;
      // Fade out background when transitioning to game phase
      Animated.timing(backgroundOpacity, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start();
    } else if (gamePhase === "completed") {
      // Instantly show background in completion phase
      backgroundOpacity.setValue(1);
    }

    console.log(`Game Phase: ${gamePhase}, Game State: ${gameState}, Opacity: ${overlayToValue}`);

    Animated.timing(overlayOpacity, {
      toValue: overlayToValue,
      duration: overlayDuration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [gamePhase, gameState, overlayOpacity, backgroundOpacity]);

  const handleGameComplete = async ( timeTaken, correctAnswers, incorrectAnswers = 0) => {


    // 🔹 Fetch token right before API call
    const authToken = await AsyncStorage.getItem("authToken");
    if (!authToken) {
        console.error("❌ No auth token found!");
        Alert.alert("Authentication Error", "You are not logged in.");
        return;
    }

    const subjectMapping = {
      "Shapes": ["Rectangle", "Triangle", "Square", "Circle"],
      "Colors": ["Red", "Yellow", "Green", "Blue", "Gray", "Black", "White"],
      "Numbers": ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"],
  };

    // ✅ Correctly determine subject from element
    const element = elementName || "Unknown";
    const subject = Object.keys(subjectMapping).find(sub => subjectMapping[sub].includes(element)) || "Unknown";

    // ✅ Ensure subject and element are defined before making API request
    if (subject === "Unknown" || element === "Unknown") {
      console.error("❌ Missing subject or element:", { subject, element });
      Alert.alert("Error", "Game subject or element is missing. Cannot save progress.");
      return;
  }

    // ✅ Calculate stars based on performance
    let calculatedStars = incorrectAnswers === 0 ? 3 : incorrectAnswers <= 3 ? 2 : 1;
    setFinalStars(calculatedStars);
    
    // ✅ API Call to Update Student Progress
    try {
        const response = await axios.put(
            "http://10.0.2.2:5000/api/students/update-score",
            {
                studentId,
                subject: subject,  // ✅ Use correct variable names
                element: element,  // ✅ Use correct variable names
                correct: correctAnswers,
                incorrect: incorrectAnswers,
                starsEarned: calculatedStars,
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,  // ✅ Ensure token is included
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("🔄 Transitioning to Stage Completion...");
         setFinalTime(timeTaken);
    setFinalScore(score);
          setGamePhase("completed"); // ✅ Only set completed after all validations
          
        console.log("✅ Game progress updated:", response.data);
    } catch (error) {
        console.error("❌ Error updating game progress:", error);
        Alert.alert("Error", "Failed to save game progress. Please try again.");
    }
};



  const handleGameStateChange = (state) => {
    console.log(`Game State Changed: ${state}`);
    setGameState(state);
  };

  useEffect(() => {
    console.log("🟢 Game Phase:", gamePhase);
    console.log("🟢 Final Time:", finalTime);
    console.log("🟢 Final Score:", finalScore);
    console.log("🟢 Final Stars:", finalStars);
  }, [gamePhase, finalTime, finalScore, finalStars]);

  
  return (
    <View style={styles.container}>
      {/* Background Image with Overlay */}
      <Animated.View style={[styles.backgroundContainer, { opacity: backgroundOpacity }]}>
        <ImageBackground source={backgroundImg} style={styles.background}>
          <Animated.View
            style={[
              styles.overlay,
              {
                opacity: overlayOpacity,
                pointerEvents: gameState === "question" ? "none" : "auto",
              },
            ]}
          />
        </ImageBackground>
      </Animated.View>

      {/* Game Content */}
      <View style={styles.contentContainer}>
        {gamePhase === "dialog" && (
          <View style={styles.fullscreenContainer}>
            <DialogComponent onDialogComplete={() => setGamePhase("countdown")} />
          </View>
        )}

        {gamePhase === "countdown" && (
          <View style={[styles.fullscreenContainer, { zIndex: 10 }]}>
            <CountdownComponent onCountDownComplete={() => setGamePhase("game")} />
          </View>
        )}

        {gamePhase === "game" && (
          <View style={styles.fullscreenContainer}>
            <GameComponent
              onGameComplete={(time, correct, incorrect) =>
                handleGameComplete(time, correct, incorrect)
              }
              navigation={navigation}
              onStateChange={handleGameStateChange}
            />
          </View>
        )}

        {gamePhase === "completed" && (
          <View style={styles.fullscreenContainer}>
            <StageCompletionComponent
              timeTaken={`${Math.floor(finalTime / 60)}:${finalTime % 60}`}
              correctAnswers={finalScore}
              totalRounds={totalRounds} // ✅ Ensure totalRounds is passed
              starsEarned={finalStars} // ✅ Ensure stars are passed to StageCompletion.js
              onRestart={() => setGamePhase("countdown")}
              navigation={navigation}
              subject={subject}  // ✅ Ensure subject is passed
              element={element}  // ✅ Ensure element is passed
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'white', // Add white background as default
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  contentContainer: {
    flex: 1,
    zIndex: 2,
  },
  fullscreenContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    flex: 1,
  },
});

export default GameFlows;