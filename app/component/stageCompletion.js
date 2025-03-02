// StageCompletion.js
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const StageCompletion = ({ timeTaken, correctAnswers, onRestart, dialoguesData, completionNpc, navigation }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const typingSpeed = 30; // milliseconds per character

  useEffect(() => {
    const completeDialogues = dialoguesData?.complete || [];
    if (!completeDialogues.length) {
      setIsTyping(false);
      return;
    }

    // Pick a random message from the provided dialogues
    const randomIndex = Math.floor(Math.random() * completeDialogues.length);
    const message = completeDialogues[randomIndex] || "";

    const characters = Array.from(message);
    let currentIndex = 0;

    const typeNextChar = () => {
      if (currentIndex < characters.length) {
        setDisplayedText(message.slice(0, currentIndex + 1));
        currentIndex++;
        setTimeout(typeNextChar, typingSpeed);
      } else {
        setIsTyping(false);
      }
    };

    typeNextChar();

    return () => {
      setDisplayedText("");
      setIsTyping(false);
    };
  }, [dialoguesData]);

  return (
    <View style={styles.containerStage}>
      <View style={styles.containerContent}> 
        <Image source={require("../../assets/gameBackground/stage-completion-bg.png")} style={styles.completionBg}/>
        <Image source={require("../../assets/stageCompletion/completion-header.png")} style={styles.headerStage}/>
                
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
            <Image source={require("../../assets/stageCompletion/retry-btn.png")} style={styles.image}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => { if (navigation) {navigation.navigate('Home')}}}>
            <Image source={require("../../assets/stageCompletion/home-btn.png")} style={styles.image}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Image source={require("../../assets/stageCompletion/next-btn.png")} style={styles.image}/>
          </TouchableOpacity>
        </View>

        <View style={styles.chatContainer}>
          <Image source={completionNpc?.image} style={styles.stageNpcImage} />
          <View style={styles.chatBubble}>
            <Text style={styles.npcName}>{completionNpc?.name}</Text>
            <Text style={styles.npcMessage}>{displayedText}</Text>
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
        maxWidth: 570,
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