// GameFlowChallenge.js
import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, ImageBackground, Animated, Easing } from "react-native";

const GameFlows = ({
  backgroundImg,
  DialogComponent,
  CountdownComponent,
  GameComponent,
  StageCompletionComponent,
  navigation
}) => {
  const [gamePhase, setGamePhase] = useState("dialog");
  const [finalTime, setFinalTime] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [gameState, setGameState] = useState("question"); 
  const overlayOpacity = useRef(new Animated.Value(0)).current; 

  useEffect(() => {
    let toValue = 1;
    let duration = 1500;
  
    if (gamePhase === "countdown") {
      toValue = 0;
      duration = 2000;
    } else if (gamePhase === "game") {
      toValue = 0; // Ensure opacity is always 0 during the game phase
      duration = 500;
    }
  

    console.log(`Game Phase: ${gamePhase}, Game State: ${gameState}, Opacity: ${toValue}`); // Debugging

    Animated.timing(overlayOpacity, {
      toValue,
      duration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false, // Ensure this is false for opacity
    }).start();
  }, [gamePhase, gameState, overlayOpacity]);

  const handleGameComplete = (timeTaken, score) => {
    setFinalTime(timeTaken);
    setFinalScore(score);
    setGamePhase("completed");
  };

  // Add this handler to receive state changes from BaseGame
  const handleGameStateChange = (state) => {
    console.log(`Game State Changed: ${state}`); // Debugging
    setGameState(state);
  };

  return (
    <View style={styles.container}>
      {/* Background Image with Overlay */}
      <View style={styles.backgroundContainer}>
        <ImageBackground source={backgroundImg} style={styles.background}>
          <Animated.View
            style={[
              styles.overlay,
              { 
                opacity: overlayOpacity,
                pointerEvents: gameState === 'question' ? 'none' : 'auto', // Allow touch events to pass through
              },
            ]}
          />
        </ImageBackground>
      </View>

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
              onGameComplete={handleGameComplete} 
              navigation={navigation}
              onStateChange={handleGameStateChange} // Pass the handler
            />
          </View>
        )}

        {gamePhase === "completed" && (
          <View style={styles.fullscreenContainer}>
            <StageCompletionComponent
              timeTaken={`${Math.floor(finalTime / 60)}:${finalTime % 60}`}
              correctAnswers={finalScore}
              onRestart={() => setGamePhase("countdown")}
              navigation={navigation}
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
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject, // Fill the entire screen
    zIndex: 1, // Ensure the background is behind the content
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Default overlay color
  },
  contentContainer: {
    flex: 1,
    zIndex: 2, // Ensure the content is above the background
  },
  fullscreenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default GameFlows;