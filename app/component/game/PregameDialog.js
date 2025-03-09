// PregameDialog.js 
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

const PregameDialog = ({ onDialogComplete, dialogData }) => {
  // Use dialogData which contains dialogues, npc names, images, etc.
  const { dialogues, npcNames, npcImages } = dialogData;
  
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [messageCompleted, setMessageCompleted] = useState(false);
  const typingSpeed = 10;

  useEffect(() => {
    let text = dialogues[currentMessageIndex];
    let index = 0;
    setDisplayedText("");
    setIsTyping(true);
    setMessageCompleted(false);

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setMessageCompleted(true);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [currentMessageIndex, dialogues]);

  const handlePress = () => {
    if (!messageCompleted) return;
    if (currentMessageIndex < dialogues.length - 1) {
      setCurrentMessageIndex((prev) => prev + 1);
    } else {
      onDialogComplete && onDialogComplete();
    }
  };

  return (
    <TouchableOpacity style={{ flex: 1, width: "100%" }} activeOpacity={1} onPress={handlePress}>
      <View style={styles.container}>
        <Image
          source={npcImages[currentMessageIndex].image}
          style={{
            width: npcImages[currentMessageIndex].width,
            height: npcImages[currentMessageIndex].height,
          }}
        />
        <View style={styles.chatBubbleContainer}>
          <View style={styles.chatContent}>
            <Text style={styles.npcName}>{npcNames[currentMessageIndex]}</Text>
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
