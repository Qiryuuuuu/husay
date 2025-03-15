import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, ImageBackground, Animated, Easing } from "react-native";
import { Asset } from 'expo-asset';

// Preload all background images
const backgroundImages = {
  default: require('../../../assets/gameBackground/challenge/easy/default-easy.png'),
  correct: require('../../../assets/gameBackground/challenge/easy/correct-easy.png'),
  incorrect: require('../../../assets/gameBackground/challenge/easy/incorrect-easy.png'),
  outro: require('../../../assets/gameBackground/challenge/easy/outro-easy.png'),
};

// Preload function
const preloadImages = async () => {
  const imageAssets = Object.values(backgroundImages).map(image => Asset.fromModule(image).downloadAsync());
  await Promise.all(imageAssets);
};

const GameFlows = ({
  backgroundImg,
  DialogComponent,
  CountdownComponent,
  GameComponent,
  StageCompletionComponent,
  navigation
}) => {
  const [gamePhase, setGamePhase] = useState("loading");
  const [finalTime, setFinalTime] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [gameState, setGameState] = useState("question");
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  // Preload images when component mounts
  useEffect(() => {
    const loadAssets = async () => {
      await preloadImages();
      setGamePhase("dialog");
    };
    loadAssets();
  }, []);

  useEffect(() => {
    let toValue = 1;
    let duration = 1500;

    if (gamePhase === "countdown") {
      toValue = 0;
      duration = 2000;
    } 
    else if (gamePhase === "game") {
      toValue = gameState === "question" ? 0.7 : 0;
    }

    Animated.timing(overlayOpacity, {
      toValue,
      duration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [gamePhase, gameState, overlayOpacity]);

  const handleGameComplete = (timeTaken, score) => {
    setFinalTime(timeTaken);
    setFinalScore(score);
    setGamePhase("completed");
  };

  const handleGameStateChange = (state) => {
    setGameState(state);
  };

  if (gamePhase === "loading") {
    return (
      <View style={styles.loadingContainer}>
        <Animated.Text style={styles.loadingText}>Loading...</Animated.Text>
      </View>
    );
  }

  return (
    <ImageBackground source={backgroundImg} style={styles.background}>
      <Animated.View
        style={[
          styles.overlay,
          { opacity: overlayOpacity },
        ]}
      />
      <View style={[styles.overlayContainer, { zIndex: gameState === 'question' ? 2 : 1 }]}>
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    fontSize: 20,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
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