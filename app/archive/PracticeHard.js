//game.js
import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Text, Animated, Vibration } from "react-native";
import dialogues from "../data/evaDialogues";
import Stopwatch from "../component/stopWatch";
import SettingsModal from "../component/setting"; 
import figures from "../data/hardQuestions";

const pauseBtn = require("../../../../../assets/buttons/pause.png");
const pauseHeader = require("../../../../../assets/headerText/pause-header.png");

const correctImg = require("../../../../../assets/validation/correct.png");
const wrongImg = require("../../../../../assets/validation/wrong.png");

const evaIdleImg = require("../../../../../assets/eva/eva-guess.png");
const evaCorrectImg = require("../../../../../assets/eva/eva-correct.png");
const evaWrongImg = require("../../../../../assets/eva/eva-wrong.png");


// Options for shape and color rounds
const shapeOptions = ["Rectangle", "Triangle", "Square", "Circle"];
const colorOptions = ["Red", "Blue", "Green", "Yellow"];
const countOptions = [1, 2, 3, 4, 5]; // Count options for the count round

const HardGame = ({ onGameComplete, navigation }) => {
    const [isPaused, setIsPaused] = useState(false);
    const [rounds, setRounds] = useState([]);
    const [currentRound, setCurrentRound] = useState(0);
    const [options, setOptions] = useState([]);
    const [isCorrect, setIsCorrect] = useState(null);
    const [isClickable, setIsClickable] = useState(true);
    const [feedbackText, setFeedbackText] = useState(dialogues.idle[0]);
    const [npcImage, setNpcImage] = useState(evaIdleImg);
    const [isGameRunning, setIsGameRunning] = useState(true);
    const [correctFirstTry, setCorrectFirstTry] = useState(0);
    const elapsedTimeRef = useRef(0); 
    const [hasTried, setHasTried] = useState(false);
    const [selectedFigureType, setSelectedFigureType] = useState(null);
    const [questionType, setQuestionType] = useState(''); // 'shape', 'color', or 'count'

    const fadeAnim = useState(new Animated.Value(1))[0];
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const npcBounceAnim = useRef(new Animated.Value(1)).current;

    // Generate 11 rounds (5 shape, 5 color, 1 count)
    const generateRounds = useCallback(() => {
        // Get all available figure types
        const figureTypes = Object.keys(figures);
        const randomFigureType = figureTypes[Math.floor(Math.random() * figureTypes.length)];
        setSelectedFigureType(randomFigureType);
        
        const selectedFigures = figures[randomFigureType];
        if (!selectedFigures || !selectedFigures[0]?.properties) {
            console.error('Invalid figure data:', randomFigureType, selectedFigures);
            return;
        }
        
        // Create separate arrays for shape and color rounds
        const shapeRounds = [];
        const colorRounds = [];
        
        // Get all figures except the overall figure (index 0)
        const availableFigures = selectedFigures.slice(1);
        
        // Shuffle available figures
        const shuffledFigures = [...availableFigures].sort(() => Math.random() - 0.5);
        
        // Generate 5 shape rounds
        for (let i = 0; i < 5 && i < shuffledFigures.length; i++) {
            shapeRounds.push({
                ...shuffledFigures[i],
                questionType: 'shape',
                correctAnswer: shuffledFigures[i].properties.shape
            });
        }
        
        // Generate 5 color rounds using different figures when possible
        const remainingFigures = shuffledFigures.slice(5);
        const colorFigures = [...remainingFigures, ...shuffledFigures].slice(0, 5);
        
        for (let i = 0; i < 5 && i < colorFigures.length; i++) {
            colorRounds.push({
                ...colorFigures[i],
                questionType: 'color',
                correctAnswer: colorFigures[i].properties.color
            });
        }
        
        // Add the count round (using the overall figure)
        const countRound = {
            ...selectedFigures[0],
            questionType: 'count',
            correctAnswer: selectedFigures[0].properties.count.toString()
        };
        
        // Combine shape and color rounds and shuffle them
        const combinedRounds = [...shapeRounds, ...colorRounds]
            .sort(() => Math.random() - 0.5);
        
        // Add count round at the end
        const allRounds = [...combinedRounds, countRound];
        
        setRounds(allRounds);
        setCurrentRound(0);
        setIsCorrect(null);
        setIsClickable(true);
        setFeedbackText(dialogues.idle[Math.floor(Math.random() * dialogues.idle.length)]);
        setNpcImage(evaIdleImg);
        setIsGameRunning(true);
        setCorrectFirstTry(0);
        elapsedTimeRef.current = 0;
        setHasTried(false);
    }, []);

    useEffect(() => {
        generateRounds();
    }, [generateRounds]);

    useEffect(() => {
        if (rounds.length > 0 && currentRound < rounds.length) {
            const currentQuestion = rounds[currentRound];
            if (!currentQuestion) {
                console.error('Invalid round data:', currentRound, rounds);
                return;
            }
            
            setQuestionType(currentQuestion.questionType);
            
            let roundOptions = [];
            if (currentQuestion.questionType === 'shape') {
                roundOptions = [...shapeOptions].sort(() => Math.random() - 0.5);
            } else if (currentQuestion.questionType === 'color') {
                roundOptions = [...colorOptions].sort(() => Math.random() - 0.5);
            } else if (currentQuestion.questionType === 'count') {
                roundOptions = [...countOptions].sort(() => Math.random() - 0.5)
                    .map(count => count.toString());
            }
            
            setOptions(roundOptions);
            setIsCorrect(null);
            setIsClickable(true);
            setFeedbackText(dialogues.idle[Math.floor(Math.random() * dialogues.idle.length)]);
            setNpcImage(evaIdleImg);
            setHasTried(false);
        }
    }, [currentRound, rounds]);

    const handleSelection = useCallback((selectedAnswer) => {
        if (!isClickable || currentRound >= rounds.length) return;

        // Convert both to lowercase for case-insensitive comparison
        const normalizedSelection = selectedAnswer.toLowerCase();
        const normalizedCorrectAnswer = rounds[currentRound].correctAnswer.toLowerCase();

        if (normalizedSelection === normalizedCorrectAnswer) {
            setIsCorrect(true);
            setFeedbackText(dialogues.correct[Math.floor(Math.random() * dialogues.correct.length)]);
            animateNpcBounce();
            setNpcImage(evaCorrectImg);
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
            setNpcImage(evaWrongImg);
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

    const getQuestionText = () => {
        if (!rounds[currentRound]) return "";
        
        switch(questionType) {
            case 'shape':
                return "Identify the shape";
            case 'color':
                return "identify the color";
            case 'count':
                return "How MANY shapes are in this figure?";
            default:
                return "";
        }
    };

    return (
        <View style={styles.container}>
            {/* Pause Button */}
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
            
                {/* Stopwatch Component */}
                <Stopwatch 
                    isRunning={isGameRunning} 
                    onStop={(finalTime) => { 
                        elapsedTimeRef.current = finalTime; 
                    }} 
                />                
                <Text style={styles.roundText}>Round {currentRound + 1} of 11</Text>

                {rounds.length > 0 && currentRound < rounds.length && (
                    <>
                        <Text style={styles.questionText}>{getQuestionText()}</Text>
                        
                        <View style={styles.shapeContainer}>
                            <Animated.Image 
                                source={rounds[currentRound].source} 
                                style={[styles.shapeImage, { transform: [{ translateX: shakeAnim }] }]} 
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
            </View>

            <Animated.View style={[styles.npcContainer, { opacity: fadeAnim }]}>
                <Animated.Image 
                    source={npcImage} 
                    style={[styles.npcImage, { transform: [{ scale: npcBounceAnim }] }]} 
                />

                <View style={styles.dialogueContainer}>
                    <Text style={styles.npcName}>Eva</Text>
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
    questionText: {
        backgroundColor: "#5A8EF4",
        color: "white",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 15,
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    shapeContainer: {
        width: "100%",
        height: 270,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        marginBottom: 15,
    },
    shapeImage: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
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
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    button: {
        backgroundColor: "#5A8EF4",
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 10,
        width: 120,
        alignItems: "center",
        zIndex: 20,
        marginHorizontal: 5,
        marginVertical: 5,
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
        marginRight: -40,
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

export default HardGame;