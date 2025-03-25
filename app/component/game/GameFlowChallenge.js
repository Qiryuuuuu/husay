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
  const [gameState, setGameState] = useState("question"); // ✅ Challenge-specific logic retained
  const overlayOpacity = useRef(new Animated.Value(1)).current;
  const backgroundOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let toValue = 1;
    let duration = 1500;

    if (gamePhase === "countdown") {
      toValue = 0;
      duration = 2000;
    } else if (gamePhase === "game") {
      toValue = 0;
      duration = 500;
      Animated.timing(backgroundOpacity, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start();
    } else if (gamePhase === "completed") {
      backgroundOpacity.setValue(1);
    }

    console.log(`Game Phase: ${gamePhase}, Game State: ${gameState}`);

    Animated.timing(overlayOpacity, {
      toValue,
      duration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [gamePhase, gameState]);

  const handleGameComplete = (timeTaken, score) => {
    console.log("✅ Transitioning to Stage Completion...");
    setFinalTime(timeTaken);
    setFinalScore(score);
    setGamePhase("completed"); // ✅ Ensures proper transition
  };

  const handleGameStateChange = (state) => {
    console.log(`Game State Changed: ${state}`);
    setGameState(state);
  };

  return (
    <View style={styles.container}>
      {/* ✅ Background Image with Overlay */}
      <Animated.View
        style={[styles.backgroundContainer, { opacity: backgroundOpacity }]}
      >
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

      {/* ✅ Game Content */}
      <View style={styles.contentContainer}>
        {gamePhase === "dialog" && (
          <View style={styles.fullscreenContainer}>
            <DialogComponent
              onDialogComplete={() => setGamePhase("countdown")}
            />
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
              setGamePhase={setGamePhase} // ✅ Ensures game phase updates properly
              navigation={navigation}
              onStateChange={handleGameStateChange} // ✅ Keeps challenge-specific state tracking
            />
          </View>
        )}

        {gamePhase === "completed" && (
          <View style={styles.fullscreenContainer}>
            <StageCompletionComponent
              timeTaken={`${Math.floor(finalTime / 60)}:${finalTime % 60}`}
              correctAnswers={finalScore}
              onRestart={() => setGamePhase("countdown")} // ✅ Restart works properly
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
    position: "relative",
    backgroundColor: "white", // Add white background as default
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
