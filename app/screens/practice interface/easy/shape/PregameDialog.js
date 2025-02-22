import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const evaExcited = require("../../../../../assets/eva/eva-excited.png");
const shaneGreet = require("../../../../../assets/shane/shane-greet.png");
const evaPointing = require("../../../../../assets/eva/eva-pointing.png");

const PregameDialog = ({ onDialogComplete }) => {
    const shapeDialog = [
        "Hey there, superstar! 🌟 Today, we’re playing a fun game all about SHAPES! Can you find circles, squares, rectangles, and triangles? Let’s see if you’re a shape expert.",
        "That’s right! I’m Shane, and I LOVE shapes! 😆 Get ready to match, sort, and play with all kinds of shapes. It’s easy-peasy, so don’t worry—I’ll guide you!",
        "Awesome! I know you’ll do great! 🎉 Let’s jump in and have some shape-tastic fun! Go, go, go!"
    ];
    
    const shapeNpcName = ["Eva", "Shane", "Eva"];

    const shapeNpc = [
        { image: evaExcited, width: 340, height: 480 },
        { image: shaneGreet, width: 460, height: 500 },
        { image: evaPointing, width: 601, height: 493 }
    ];

    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState(""); 
    const [isTyping, setIsTyping] = useState(true);
    const [messageCompleted, setMessageCompleted] = useState(false);
    const typingSpeed = 10;
    
    useEffect(() => {
        let text = shapeDialog[currentMessageIndex];
        let index = 0;
        setDisplayedText(""); // Reset displayed text correctly
        setIsTyping(true);
        setMessageCompleted(false);

        const interval = setInterval(() => {
            if (index < text.length) {
                setDisplayedText(text.slice(0, index + 1)); // Proper slicing to avoid duplication
                index++;
            } else {
                clearInterval(interval);
                setIsTyping(false);
                setMessageCompleted(true);
            }
        }, typingSpeed);

        return () => clearInterval(interval); // Clean up interval on message change
    }, [currentMessageIndex]);

    const handlePress = () => {
        if (!messageCompleted) return; // Ignore taps while typing (unskippable)

        if (currentMessageIndex < shapeDialog.length - 1) {
            setCurrentMessageIndex((prev) => prev + 1);
        } else {
            if (onDialogComplete) onDialogComplete();
        }
    };

    return (
      <TouchableOpacity style={{ flex: 1, width: "100%" }} activeOpacity={1} onPress={handlePress}>
        <View style={styles.container}>
            <Image 
                source={shapeNpc[currentMessageIndex].image} 
                style={{ 
                    width: shapeNpc[currentMessageIndex].width, 
                    height: shapeNpc[currentMessageIndex].height 
                }} 
            />
            <View style={styles.chatBubbleContainer}>
                <View style={styles.chatContent}>
                    <Text style={styles.npcName}>{shapeNpcName[currentMessageIndex]}</Text>
                    <Text style={styles.npcMessage}>{displayedText}</Text>
                </View>
            </View>
            {messageCompleted && (
                <Text style={styles.nextTriggerText}>Tap anywhere to continue</Text>
            )}
        </View> 
      </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  chatBubbleContainer: {
    width: "60%",
  },
  chatContent: {
    backgroundColor: "#E1F1FF",
    padding: 40,
    borderRadius: 30,
    borderWidth: 10,
    borderColor: "white",
  },
  npcName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  npcMessage: {
    fontSize: 20,
  },
  nextTriggerText: {
    color: "white",
    fontSize: 16,
    marginTop: 30,
    textAlign: "center",
  },
});

export default PregameDialog;