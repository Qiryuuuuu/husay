// stageCompletion.js
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import AudioPlayer from "../component/audio/AudioPlayer"; // Import AudioPlayer component
import { useNavigation } from "@react-navigation/native";
import axios from "axios"; // ✅ Import axios for API calls
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import the completion sound effect
const completionSound = require("../../assets/voiceOver/misc/stage-complete.wav"); // Update this path to match your sound file location

const StageCompletion = ({
  timeTaken,
  correctAnswers,
  totalRounds,
  onRestart,
  dialoguesData,
  completionNpc,
  isChallengeMode,
  currentScreen,
  studentId,  // ✅ Ensure studentId is received from props
  subject,     // ✅ Ensure subject (e.g., "Shapes", "Numbers") is received
  element,     // ✅ Ensure element (e.g., "Rectangle", "One") is received
  starsEarned,
}) => {
  const navigation = useNavigation();
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const typingSpeed = 30;
  const [playCompletionSound, setPlayCompletionSound] = useState(true);

  // Define the mapping for the next levels
  const nextLevelMap = {
    // Practice mode levels
    PracticeShape: "PracticeColor",
    PracticeColor: "PracticeNumber",
    PracticeNumber: "PracticeMedium",
    PracticeMedium: "PracticeHard",
    PracticeHard: null, // No Next button for last stage

    // Challenge mode levels
    ChallengeShape: "ChallengeColor",
    ChallengeColor: "ChallengeNumber",
    ChallengeNumber: "ChallengeMedium",
    ChallengeMedium: "ChallengeHard",
    ChallengeHard: null, // No Next button for last stage
  };

  // Function to handle next button press
  const handleNext = () => {
    const nextScreen = nextLevelMap[currentScreen];
    if (nextScreen && navigation) {
      navigation.navigate(nextScreen);
    }
  };

  // Handle audio playback status
  const handlePlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      setPlayCompletionSound(false);
    }
  };

  
  // Calculate mistakes
  const mistakes = totalRounds - correctAnswers;

  // Determine star count
  let starCount = 1; // Default: 1 star
  if (mistakes === 0) {
    starCount = 3;
  } else if (mistakes <= 3) {
    starCount = 2;
  }
  

  // ✅ Function to send game results to backend
  const updateStudentProgress = async () => {
   // 🔹 Fetch token right before making the API call
   const authToken = await AsyncStorage.getItem("authToken");
    
   if (!authToken) {
     console.error("❌ No token available, blocking API request.");
     Alert.alert("Authentication Error", "You must log in to save game progress.");
     return;
   }
    
    try {
      const response = await axios.put("http://10.0.2.2:5000/api/students/update-score", {
        studentId,
        subject,  // ✅ Subject category (e.g., "Shapes", "Colors", "Numbers")
        element,  // ✅ Specific game element (e.g., "Rectangle", "Red", "One")
        correct: correctAnswers,
        incorrect: mistakes,  // ✅ Mistakes count as incorrect answers
        starsEarned: starsEarned, // ✅ Pass the actual value
        totalRounds, // ✅ Add totalRounds to track the game rounds
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,  // ✅ Fetch token dynamically
          "Content-Type": "application/json",
        },
      }
    );

      console.log("✅ Student progress updated:", response.data);
    } catch (error) {
      console.error("❌ Error updating student progress:", error);
      Alert.alert("Error", "Failed to save game progress. Please try again.");
    }
  };

  useEffect(() => {
    console.log("🛠️ StageCompletion Props Received:");
    console.log("➡️ timeTaken:", timeTaken);
    console.log("➡️ correctAnswers:", correctAnswers);
    console.log("➡️ totalRounds:", totalRounds);
    console.log("➡️ starsEarned:", starsEarned);
    console.log("➡️ studentId:", studentId);
    console.log("➡️ subject:", subject);
    console.log("➡️ element:", element);
  }, []);
  
  useEffect(() => {
    if (studentId && subject && element && starsEarned !== undefined && totalRounds > 0) {
      console.log("🚀 Updating student progress...");
      updateStudentProgress();
    } else {
      console.log("⚠️ Not updating progress: Missing required data.");
    }
  }, [studentId,subject, element, starsEarned, totalRounds, ]);
  

  
  return (
    <View style={styles.containerStage}>
      {/* Add AudioPlayer component */}
      {playCompletionSound && (
        <AudioPlayer
          audioSource={completionSound}
          onPlaybackStatusUpdate={() => setPlayCompletionSound(false)}
          autoPlay={true}
        />
      )}

      <View style={styles.containerContent}>
        <Image
          source={require("../../assets/gameBackground/stage-completion-bg.png")}
          style={styles.completionBg}
        />
        <Image
          source={require("../../assets/stageCompletion/completion-header.png")}
          style={styles.headerStage}
        />

        {/* Star Display */}
        {isChallengeMode && (
          <View style={styles.starContainer}>
            {[...Array(starsEarned || 1)].map((_, index) => (
              <Image
                key={index}
                source={require("../../assets/stageCompletion/star.png")}
                style={styles.starImage}
              />
            ))}
          </View>
        )}

        <View style={styles.scoreContainer}>
          <View style={[styles.resultContainer, styles.timeContainer]}>
            <Text style={styles.stat}>Time Taken: </Text>
            <Text style={styles.stat}>{timeTaken}</Text>
          </View>
          <View style={[styles.resultContainer, styles.scoreDetails]}>
            <Text style={styles.stat}>Correct Answers: </Text>
            <Text style={styles.stat}>{correctAnswers}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onRestart}>
            <Image
              source={require("../../assets/stageCompletion/retry-btn.png")}
              style={styles.image}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate("Home", {studentId});
            }}
          >
            <Image
              source={require("../../assets/stageCompletion/home-btn.png")}
              style={styles.image}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate("PracMainScreen", {studentId});
            }}
          >
            <Image
              source={require("../../assets/stageCompletion/next-btn.png")}
              style={styles.image}
            />
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
  // Styles remain unchanged
  containerStage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  containerContent: {
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
    zIndex: 10,
  },
  completionBg: {
    position: "absolute",
    width: "100%",
    height: "60%",
    resizeMode: "cover",
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  starImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginHorizontal: 5,
  },
  scoreContainer: {
    gap: 25,
  },
  resultContainer: {
    paddingVertical: 10,
    paddingHorizontal: 100,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#E1F1FF",
    borderWidth: 5,
    borderColor: "#69D4E7",
    borderRadius: 20,
  },
  stat: {
    fontSize: 24,
    fontWeight: "bold",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 160,
    flexDirection: "row",
    gap: 15,
  },
  chatContainer: {
    position: "absolute",
    bottom: 0,
    left: "30%",
    transform: [{ translateX: -50 }],
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
    alignSelf: "center",
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
