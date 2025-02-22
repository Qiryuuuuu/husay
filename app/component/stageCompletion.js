import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import dialogues from "../data/shapeDialogues";

const completionBg = require("../../assets/gameBackground/stage-completion-bg.png");
const headerStage = require("../../assets/stageCompletion/completion-header.png");
const retryBtn = require("../../assets/stageCompletion/retry-btn.png");
const homeBtn = require("../../assets/stageCompletion/home-btn.png");
const nextBtn = require("../../assets/stageCompletion/next-btn.png");
const shaneCompletionImg = require("../../assets/shane/shane-greet.png");

const StageCompletion = ({ timeTaken, correctAnswers, onRestart }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [currentMessage, setCurrentMessage] = useState("");
  const typingSpeed = 30; // milliseconds per character

  useEffect(() => {
    // Reset states when component mounts
    setDisplayedText("");
    setIsTyping(true);

    // Get completion messages and select a random one
    const completeDialogues = dialogues.complete || [];
    if (!completeDialogues.length) {
      setIsTyping(false);
      return;
    }

    const randomIndex = Math.floor(Math.random() * completeDialogues.length);
    const message = completeDialogues[randomIndex] || "";
    setCurrentMessage(message);

    let charIndex = 0;
    const intervalId = setInterval(() => {
      if (charIndex < message.length) {
        setDisplayedText((prev) => prev + message[charIndex]);
        charIndex++;
      } else {
        clearInterval(intervalId);
        setIsTyping(false);
      }
    }, typingSpeed);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.containerStage}>
      <View style={styles.containerContent}> 
        <Image source={completionBg} style={styles.completionBg}/>
        <Image source={headerStage} style={styles.headerStage}/>
                
        <View style={styles.scoreContainer}>
          <View style={[styles.resultContainer, styles.timeContainer]}>
            <Text style={styles.stat}>Time Taken: </Text>
            <Text style={styles.stat}>{timeTaken}</Text>
          </View>
          <View style={[styles.resultContainer, styles.scoreDetails]}>
            <Text style={styles.stat}>Correct Answers: </Text>
            <Text style={styles.stat}>{correctAnswers} / 5</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onRestart}>
            <Image source={retryBtn} style={styles.image}/>
          </TouchableOpacity>
                    
          <TouchableOpacity style={styles.button}>
            <Image source={homeBtn} style={styles.image}/>
          </TouchableOpacity>
                    
          <TouchableOpacity style={styles.button}>
            <Image source={nextBtn} style={styles.image}/>
          </TouchableOpacity>
        </View>

        <View style={styles.chatContainer}>
          <Image source={shaneCompletionImg} style={styles.stageNpcImage} />
          <View style={styles.chatBubble}>
            <Text style={styles.npcName}>Shane</Text>
            <Text style={styles.npcMessage}>
              {isTyping ? displayedText : currentMessage}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    containerStage: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    },
    containerContent:{
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    headerStage: {
        position: "absolute",  
        top: 50,              
        width: "70%",        
        resizeMode: "contain", 
        zIndex: 10             
    },
    completionBg:{
        position: "absolute",
        width: "100%",
        height: "60%",
        resizeMode: "cover",
    },
    scoreContainer:{
        gap: 25,
    },
    resultContainer:{
        paddingVertical: 10,
        paddingHorizontal: 100,
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "#E1F1FF",
        borderWidth: 5,
        borderColor: "#69D4E7",
        borderRadius: 20
    },
    stat:{
        fontSize: 24,
        fontWeight: "bold",
    },
    buttonContainer:{
        position: "absolute",
        bottom: 180,
        flexDirection: "row",
        gap: 15
    },

    chatContainer: {
        position: "absolute",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        flexDirection: "row-reverse",
        alignItems: "flex-start",
      },
      stageNpcImage: {
        width: 170,
        height: 170,
        resizeMode: "contain",
        marginRight: 10,
      },
      chatBubble: {
        flex: 1,
        backgroundColor: "#E1F1FF",
        padding: 15,
        borderRadius: 15,
        borderWidth: 4,
        borderColor: "white",
        maxWidth: 500,
        alignSelf: "center"
      },
      npcName: {
        fontWeight: "bold",
        marginBottom: 5,
        fontSize: 18,
      },
      npcMessage: {
        fontSize: 16,
      },
});

export default StageCompletion;