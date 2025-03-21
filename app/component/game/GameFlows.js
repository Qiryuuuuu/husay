// GameFlow.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Animated,
  Easing,
} from "react-native";

const GameFlows = ({
  backgroundImg,
  DialogComponent,
  CountdownComponent,
  GameComponent,
  StageCompletionComponent,
  navigation,
}) => {
  const [gamePhase, setGamePhase] = useState("dialog");
  const [finalTime, setFinalTime] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const overlayOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let toValue = 1;
    let duration = 1500;

    if (gamePhase === "countdown") {
      toValue = 0;
      duration = 2000;
    }
    if (gamePhase === "game") {
      toValue = 0.9;
    }

    Animated.timing(overlayOpacity, {
      toValue,
      duration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [gamePhase, overlayOpacity]);

  const handleGameComplete = (timeTaken, score) => {
    console.log("✅ Transitioning to Stage Completion...");
    setFinalTime(timeTaken);
    setFinalScore(score);
    setGamePhase("completed"); // ✅ Ensure the game phase updates properly
  };

  return (
    <ImageBackground source={backgroundImg} style={styles.background}>
      <Animated.View
        style={[
          styles.overlay,
          gamePhase === "game"
            ? styles.lightOverlay
            : gamePhase === "dialog" || gamePhase === "completed"
            ? styles.darkOverlay
            : styles.noOverlay,
          { opacity: overlayOpacity },
        ]}
      />

      {gamePhase === "dialog" && (
        <View style={styles.fullscreenContainer}>
          <DialogComponent onDialogComplete={() => setGamePhase("countdown")} />
        </View>
      )}

      {gamePhase === "countdown" && (
        <View style={[styles.fullscreenContainer, { zIndex: 10 }]}>
          <CountdownComponent
            onCountDownComplete={() => setGamePhase("game")}
          />
        </View>
      )}

      {gamePhase === "game" && (
        <View style={styles.fullscreenContainer}>
          <GameComponent
            onGameComplete={handleGameComplete}
            setGamePhase={setGamePhase} // ✅ Pass setGamePhase to GameComponent
            navigation={navigation}
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  darkOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  lightOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  noOverlay: {
    backgroundColor: "transparent",
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
