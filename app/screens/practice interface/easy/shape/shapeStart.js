import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ImageBackground, Animated, Easing } from 'react-native';
import PregameDialog from './PregameDialog';
import Countdown from '../../../../component/countdown';
import ShapeGame from '../../../../component/game/shapeGame';
import StageCompletion from '../../../../component/stageCompletion'; 

const backgroundImg = require("../../../../../assets/gameBackground/practice-shape-bg.webp");

const GameScreen = () => {
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
            toValue = 0.7; 
        }

        Animated.timing(overlayOpacity, {
            toValue,
            duration,
            easing: Easing.out(Easing.quad), 
            useNativeDriver: true
        }).start();
    }, [gamePhase]);

    const handleGameComplete = (timeTaken, score) => {
        setFinalTime(timeTaken);
        setFinalScore(score);
        setGamePhase("completed");
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
                    <PregameDialog onDialogComplete={() => setGamePhase("countdown")} />
                </View>
            )}

            {gamePhase === "countdown" && (
                <View style={[styles.fullscreenContainer, { zIndex: 10 }]}>
                    <Countdown onCountDownComplete={() => setGamePhase("game")} />
                </View>
            )}

            {gamePhase === "game" && (
                <View style={styles.fullscreenContainer}>
                    <ShapeGame onGameComplete={handleGameComplete} />
                </View>
            )}

            {gamePhase === "completed" && (
                <View style={styles.fullscreenContainer}>
                    <StageCompletion 
                        timeTaken={`${Math.floor(finalTime / 60)}:${finalTime % 60}`} 
                        correctAnswers={finalScore} 
                        onRestart={() => setGamePhase("countdown")}
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
        backgroundColor: "rgba(0, 0, 0, 0.7)", 
    },
    lightOverlay: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
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
        justifyContent: "center",
        alignItems: "center",
        width: "100%",  
        height: "100%", 
        flex: 1,        
    }
});

export default GameScreen;
