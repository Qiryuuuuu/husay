//PregameDialog.js
import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import AudioPlayer from "../audio/AudioPlayer";

const PregameDialog = ({ onDialogComplete, dialogData }) => {
  const { dialogues, npcNames, npcImages, audioFiles } = dialogData;
  
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
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
      const currentAudioFile = audioFiles?.[currentMessageIndex];
      
      // Check if the current audio is an array and if there are more to play
      if (Array.isArray(currentAudioFile) && currentAudioIndex < currentAudioFile.length - 1) {
        // Move to the next audio in the sequence
        setCurrentAudioIndex(prevIndex => prevIndex + 1);
        // Set a small delay to prevent overlap
        setTimeout(() => {
          if (isMounted.current) setIsPlayingAudio(true);
        }, 300);
      } else {
        // Either there's no more audio to play or it wasn't an array
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
  }, [currentMessageIndex]);

  // Typing effect
  useEffect(() => {
    if (!isMounted.current) return;
    
    let text = dialogues[currentMessageIndex];
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
        
        // If there's no audio file, mark message as completed immediately
        if (!audioFiles || !audioFiles[currentMessageIndex]) {
          setMessageCompleted(true);
        }
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [currentMessageIndex, dialogues]);

  const handlePress = () => {
    // If still typing, complete the text immediately
    if (isTyping) {
      setDisplayedText(dialogues[currentMessageIndex]);
      setIsTyping(false);
      return;
    }
    
    // If audio is playing but the text is complete, allow skipping the audio
    if (isPlayingAudio && !isTyping) {
      setIsPlayingAudio(false);
      setMessageCompleted(true);
      return;
    }
    
    // Move to next message or complete dialog if message is completed
    if (messageCompleted) {
      if (currentMessageIndex < dialogues.length - 1) {
        setCurrentMessageIndex((prev) => prev + 1);
      } else {
        onDialogComplete && onDialogComplete();
      }
    }
  };

  // Get the current audio source to play
  const getCurrentAudioSource = () => {
    const currentAudioFile = audioFiles?.[currentMessageIndex];
    
    // If no audio file exists for this message
    if (!currentAudioFile) return null;
    
    // If the current audio entry is an array, get the current one
    if (Array.isArray(currentAudioFile)) {
      return currentAudioFile[currentAudioIndex];
    }
    
    // Otherwise return the audio file directly
    return currentAudioFile;
  };

  return (
    <TouchableOpacity style={{ flex: 1, width: "100%" }} activeOpacity={1} onPress={handlePress}>
      <View style={styles.container}>
        {/* Render AudioPlayer only if there's an audio to play and we should be playing it */}
        {getCurrentAudioSource() && isPlayingAudio && (
          <AudioPlayer
            audioSource={getCurrentAudioSource()}
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            autoPlay={true}
          />
        )}
        
        {/* Character image */}
        <Image
          source={npcImages[currentMessageIndex].image}
          style={{
            width: npcImages[currentMessageIndex].width,
            height: npcImages[currentMessageIndex].height,
          }}
        />
        
        {/* Dialog bubble */}
        <View style={styles.chatBubbleContainer}>
          <View style={styles.chatContent}>
            <Text style={styles.npcName}>{npcNames[currentMessageIndex]}</Text>
            <Text style={styles.npcMessage}>{displayedText}</Text>
          </View>
        </View>
        
        {/* "Tap to continue" prompt */}
        {messageCompleted && (
          <Text style={styles.nextTriggerText}>Tap anywhere to continue</Text>
        )}
        {/* Show skipping message when audio is playing but text is finished */}
        {!isTyping && isPlayingAudio && !messageCompleted && (
          <Text style={styles.nextTriggerText}>Tap to skip audio</Text>
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