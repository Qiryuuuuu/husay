// stageCompletion.js
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import AudioPlayer from "../component/audio/AudioPlayer"; // Import AudioPlayer component
import { useNavigation } from "@react-navigation/native";

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
  mode, // ✅ Added mode prop ("practice" or "challenge")
  level, // ✅ Added level prop ("Shape", "Color", etc.")
  studentId, // ✅ Added studentId prop to be passed when navigating
  studentName, // ✅ Added studentName prop
}) => {
  const navigation = useNavigation();
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const typingSpeed = 30;
  const [playCompletionSound, setPlayCompletionSound] = useState(true);

  // ✅ Define the mapping for the next levels
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

  // ✅ Function to handle next button press
  const handleNext = () => {
    const currentScreen =
      mode === "challenge" ? `Challenge${level}` : `Practice${level}`;
    const nextScreen = nextLevelMap[currentScreen];

    if (nextScreen) {
      navigation.navigate(nextScreen, { studentId }); // ✅ Pass studentId if needed
    } else {
      console.log("🚫 No next level. This is the last stage.");
    }
  };

  // ✅ Handle audio playback status
  const handlePlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      setPlayCompletionSound(false);
    }
  };

  useEffect(() => {
    // Play completion sound when component mounts
    setPlayCompletionSound(true);

    const completeDialogues = dialoguesData?.complete || [];
    if (!completeDialogues.length) {
      setIsTyping(false);
      return;
    }

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
      setPlayCompletionSound(false);
    };
  }, [dialoguesData]);

  // ✅ Calculate mistakes
  const mistakes = totalRounds - correctAnswers;

  // ✅ Determine star count
  let starCount = 1; // Default: 1 star
  if (mistakes === 0) {
    starCount = 3;
  } else if (mistakes <= 3) {
    starCount = 2;
  }

  return (
    <View style={styles.containerStage}>
      {/* ✅ Add AudioPlayer component */}
      {playCompletionSound && (
        <AudioPlayer
          audioSource={completionSound}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
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

        {/* ✅ Star Display - Only for Challenge Mode */}
        {isChallengeMode && (
          <View style={styles.starContainer}>
            {[...Array(starCount)].map((_, index) => (
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
          {/* ✅ Retry Button */}
          <TouchableOpacity style={styles.button} onPress={onRestart}>
            <Image
              source={require("../../assets/stageCompletion/retry-btn.png")}
              style={styles.image}
            />
          </TouchableOpacity>

          {/* ✅ Home Button - Pass studentId */}
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("Home", { studentId, studentName })
            }
          >
            <Image
              source={require("../../assets/stageCompletion/home-btn.png")}
              style={styles.image}
            />
          </TouchableOpacity>

          {/* ✅ Next Button - Only show if there's a next level */}
          {nextLevelMap[
            mode === "challenge" ? `Challenge${level}` : `Practice${level}`
          ] && (
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Image
                source={require("../../assets/stageCompletion/next-btn.png")}
                style={styles.image}
              />
            </TouchableOpacity>
          )}
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
