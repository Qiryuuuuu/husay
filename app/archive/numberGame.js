//numberGame.js
import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Text, Animated, Vibration } from "react-native";
import dialogues from "../data/numberDialogues";
import Stopwatch from "../component/stopWatch";
import SettingsModal from "../component/setting"; 

const pauseBtn = require("../../../assets/buttons/pause.png");
const pauseHeader = require("../../../assets/headerText/pause-header.png");

const correctImg = require("../../../assets/validation/correct.png");
const wrongImg = require("../../../assets/validation/wrong.png");

const amberIdleImg = require("../../../assets/amber/amber-guess.png");
const amberCorrectImg = require("../../../assets/amber/amber-correct.png");
const amberWrongImg = require("../../../assets/amber/amber-wrong.png");

const number = [
    { name: "One", image: require("../../../assets/numbers/one.png") },
    { name: "Two", image: require("../../../assets/numbers/two.png") },
    { name: "Three", image: require("../../../assets/numbers/three.png") },
    { name: "Four", image: require("../../../assets/numbers/four.png") },
    { name: "Five", image: require("../../../assets/numbers/five.png") },
    { name: "Six", image: require("../../../assets/numbers/six.png") },
    { name: "Seven", image: require("../../../assets/numbers/seven.png") },
    { name: "Eight", image: require("../../../assets/numbers/eight.png") },
    { name: "Nine", image: require("../../../assets/numbers/nine.png") },
    { name: "Ten", image: require("../../../assets/numbers/ten.png") },
];

const NumberGame = ({ onGameComplete, navigation }) => {
    const [isPaused, setIsPaused] = useState(false);

    const [rounds, setRounds] = useState([]);
    const [currentRound, setCurrentRound] = useState(0);
    const [options, setOptions] = useState([]);
    const [isCorrect, setIsCorrect] = useState(null);
    const [isClickable, setIsClickable] = useState(true);
    const [feedbackText, setFeedbackText] = useState(dialogues.idle[0]);
    const [npcImage, setNpcImage] = useState(amberIdleImg);
    const [isGameRunning, setIsGameRunning] = useState(true);
    const [correctFirstTry, setCorrectFirstTry] = useState(0);
    const elapsedTimeRef = useRef(0); 
    const [hasTried, setHasTried] = useState(false);

    const fadeAnim = useState(new Animated.Value(1))[0];
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const npcBounceAnim = useRef(new Animated.Value(1)).current;

    const generateRounds = useCallback(() => {
        let roundsArray = [...number].sort(() => Math.random() - 0.5).slice(0, 5);
        setRounds(roundsArray);
        setCurrentRound(0);
        setIsCorrect(null);
        setIsClickable(true);
        setFeedbackText(dialogues.idle[Math.floor(Math.random() * dialogues.idle.length)]);
        setNpcImage(amberIdleImg);
        setIsGameRunning(true);
        setCorrectFirstTry(0);
        elapsedTimeRef.current = 0; 
        setHasTried(false);
    }, []);

    useEffect(() => {
        generateRounds();
    }, [generateRounds]);

    useEffect(() => {
        if (rounds.length > 0) {
            let allOptions = [...number].sort(() => Math.random() - 0.5);
            setOptions(allOptions);
            setIsCorrect(null);
            setIsClickable(true);
            setFeedbackText(dialogues.idle[Math.floor(Math.random() * dialogues.idle.length)]);
            setNpcImage(amberIdleImg);
            setHasTried(false);
        }
    }, [currentRound, rounds]);

    const handleSelection = useCallback((selectedName) => {
        if (!isClickable) return;

        if (selectedName === rounds[currentRound].name) {
            setIsCorrect(true);
            setFeedbackText(dialogues.correct[Math.floor(Math.random() * dialogues.correct.length)]);
            animateNpcBounce();
            setNpcImage(amberCorrectImg);
            fadeInAnimation();
            setIsClickable(false);

            let updatedScore = correctFirstTry;
            if (!hasTried) {
                updatedScore += 1;
                setCorrectFirstTry(updatedScore); 
            }

            setTimeout(() => {
                if (currentRound < rounds.length - 1) {
                    setCurrentRound(currentRound + 1);
                } else {
                    setIsGameRunning(false); 

                    setTimeout(() => {
                        console.log("Final Time Captured:", elapsedTimeRef.current); 
                        console.log("Final Score Captured:", updatedScore); 

                        if (onGameComplete) {
                            onGameComplete(elapsedTimeRef.current, updatedScore);
                        }
                    }, 500);
                }
            }, 1500);
        } else {
            setIsCorrect(false);
            setFeedbackText(dialogues.wrong[Math.floor(Math.random() * dialogues.wrong.length)]);
            setNpcImage(amberWrongImg);
            fadeInAnimation();
            animateNpcBounce();
            triggerShake();
            Vibration.vibrate(100);
            setHasTried(true);
        }
    }, [currentRound, rounds, isClickable, correctFirstTry, hasTried]);

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

    return (
        <View style={styles.container}>
            {/* Pause Button */}
            <TouchableOpacity 
                style={styles.pauseContainer} 
                onPress={() => {
                    setIsPaused(true);
                    setIsGameRunning(false); // Pause the stopwatch
                }}>
                <Image source={pauseBtn} style={styles.pause} />
            </TouchableOpacity>

            <View style={styles.contentContainer}>
                <View style={styles.validationContainer}>
                    {isCorrect !== null && (
                        <Image source={isCorrect ? correctImg : wrongImg} style={styles.validationImage} />
                    )}
                </View>
            
                {/* Stopwatch Component */}
                <Stopwatch 
                    isRunning={isGameRunning} 
                    onStop={(finalTime) => { 
                        elapsedTimeRef.current = finalTime; 
                    }} 
                />                
                <Text style={styles.roundText}>Round {currentRound + 1} of 5</Text>

                {rounds.length > 0 && (
                    <>
                        <View style={styles.numberContainer}>
                            <Animated.Image 
                                source={rounds[currentRound].image} 
                                style={[styles.numberImage, { transform: [{ translateX: shakeAnim }] }]} 
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
                    <Text style={styles.npcName}>Amber</Text>
                    <Text style={styles.npcDialogue}>{feedbackText}</Text>
                </View>
            </Animated.View>

            {/* Pause Modal */}
            <SettingsModal 
                visible={isPaused} 
                onClose={() => {
                    setIsPaused(false);
                    setIsGameRunning(true); 
                }}
                headerImage={pauseHeader}
                buttonOneText="Resume"
                buttonTwoText="Quit"
                onButtonOnePress={() => {
                    setIsPaused(false);
                    setIsGameRunning(true);
                }}
                onButtonTwoPress={() => {
                    // Navigate to Home screen
                    navigation.navigate('Home');
                    setIsPaused(false);
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    pauseContainer:{
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
        marginBottom: 15,
        textAlign: "center",
    },
    numberContainer: {
        width: "100%",
        height: 270,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        marginBottom: 30,
    },
    numberImage: {
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
    buttonText:{
        color: "white"
    },
    button: {
        backgroundColor: "#5A8EF4",
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 10,
        width: 100,
        alignItems: "center",
        zIndex: 20
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
});

export default NumberGame;
