//pregameDialog.js
import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import AudioPlayer from "../audio/AudioPlayer";

const PregameDialog = ({ onDialogComplete, dialogData, onDialogNext, currentDialogIndex }) => {
  const { dialogues, npcNames, npcImages, audioFiles } = dialogData;
  
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [messageCompleted, setMessageCompleted] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const typingSpeed = 10;
  
  // Use a ref to track if component is mounted
  const isMounted = useRef(true);

  // Handle audio playback status updates
  const handlePlaybackStatusUpdate = (status) => {
    if (!isMounted.current) return;
    
    if (status.didJustFinish) {
      const currentAudioFile = audioFiles?.[currentDialogIndex];
      
      if (Array.isArray(currentAudioFile) && currentAudioIndex < currentAudioFile.length - 1) {
        setCurrentAudioIndex(prevIndex => prevIndex + 1);
        setTimeout(() => {
          if (isMounted.current) setIsPlayingAudio(true);
        }, 300);
      } else {
        setIsPlayingAudio(false);
        setMessageCompleted(true);
      }
    }
  };

  // Cleanup effect and track mounted state
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Reset audio index when changing messages
  useEffect(() => {
    if (!isMounted.current) return;
    
    setCurrentAudioIndex(0);
    setIsPlayingAudio(true);
    
    // Reset state for new dialog
    setIsTyping(true);
    setMessageCompleted(false);
    setDisplayedText("");
  }, [currentDialogIndex]);

  // Typing effect
  useEffect(() => {
    if (!isMounted.current) return;
    
    let text = dialogues[currentDialogIndex];
    let index = 0;
    setDisplayedText("");
    setIsTyping(true);
    setMessageCompleted(false);

    const interval = setInterval(() => {
      if (!isMounted.current) {
        clearInterval(interval);
        return;
      }
      
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        
        if (!audioFiles || !audioFiles[currentDialogIndex]) {
          setMessageCompleted(true);
        }
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [currentDialogIndex, dialogues]);

  const handlePress = () => {
    if (isTyping) {
      setDisplayedText(dialogues[currentDialogIndex]);
      setIsTyping(false);
      return;
    }
    
    if (isPlayingAudio && !isTyping) {
      setIsPlayingAudio(false);
      setMessageCompleted(true);
      return;
    }
    
    if (messageCompleted) {
      if (currentDialogIndex < dialogues.length - 1) {
        onDialogNext(currentDialogIndex);
      } else {
        onDialogComplete();
      }
    }
  };

  const getCurrentAudioSource = () => {
    const currentAudioFile = audioFiles?.[currentDialogIndex];
    
    if (!currentAudioFile) return null;
    
    if (Array.isArray(currentAudioFile)) {
      return currentAudioFile[currentAudioIndex];
    }
    
    return currentAudioFile;
  };

  return (
    <TouchableOpacity style={styles.fullScreen} activeOpacity={1} onPress={handlePress}>
      <View style={styles.container}>
        {getCurrentAudioSource() && isPlayingAudio && (
          <AudioPlayer
            audioSource={getCurrentAudioSource()}
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            autoPlay={true}
          />
        )}
        
        <Image
          source={npcImages[currentDialogIndex].image}
          style={{
            width: npcImages[currentDialogIndex].width,
            height: npcImages[currentDialogIndex].height,
          }}
        />
        
        <View style={styles.chatBubbleContainer}>
          <View style={styles.chatContent}>
            <Text style={styles.npcName}>{npcNames[currentDialogIndex]}</Text>
            <Text style={styles.npcMessage}>{displayedText}</Text>
          </View>
        </View>
        
        {messageCompleted && (
          <Text style={styles.nextTriggerText}>Tap anywhere to continue</Text>
        )}
        {!isTyping && isPlayingAudio && !messageCompleted && (
          <Text style={styles.nextTriggerText}>Tap to skip audio</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    width: "100%",
  },
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
