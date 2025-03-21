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
  const backgroundOpacity = useRef(new Animated.Value(1)).current;

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

  const handleGameComplete = (timeTaken, score) => {
    setFinalTime(timeTaken);
    setFinalScore(score);
    setGamePhase("completed");
  };

  const handleGameStateChange = (state) => {
    console.log(`Game State Changed: ${state}`);
    setGameState(state);
  };

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
                pointerEvents: gameState === 'question' ? 'none' : 'auto',
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
              onGameComplete={handleGameComplete} 
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