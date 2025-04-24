import React, { useState, useEffect, useRef } from "react";
import { View, Image, Animated, StyleSheet } from "react-native";
import { Audio } from "expo-av";

/* Countdown images */
const three = require(".././../assets/countdown/three.png");
const two = require(".././../assets/countdown/two.png");
const one = require(".././../assets/countdown/one.png");
const letsGo = require(".././../assets/countdown/letsGo.png");

// Import your sound files
const threeSound = require("../../assets/voiceOver/misc/countdown/countdown_1.mp3");
const twoSound = require("../../assets/voiceOver/misc/countdown/countdown_2.mp3");
const oneSound = require("../../assets/voiceOver/misc/countdown/countdown_3.mp3");
const letsGoSound = require("../../assets/voiceOver/misc/countdown/countdown_letsgo.mp3");

const Countdown = ({ onCountDownComplete }) => {
  const countDownImages = [three, two, one, letsGo];
  const countDownSounds = [threeSound, twoSound, oneSound, letsGoSound];

  const [currentCountdown, setCurrentCountdown] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const sound = useRef(null);

  // Function to play sound
  const playSound = async (soundFile) => {
    try {
      // Unload any existing sound
      if (sound.current) {
        await sound.current.unloadAsync();
      }

      // Create and play the new sound
      const { sound: newSound } = await Audio.Sound.createAsync(soundFile, {
        shouldPlay: true,
      });

      sound.current = newSound;
    } catch (error) {
      console.log("Error playing sound:", error);
    }
  };

  useEffect(() => {
    // Play the sound for the current countdown number
    playSound(countDownSounds[currentCountdown]);

    if (currentCountdown < countDownImages.length - 1) {
      const timer = setTimeout(() => {
        setCurrentCountdown(currentCountdown + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      console.log("Countdown Complete");
      setTimeout(() => {
        onCountDownComplete && onCountDownComplete();
      }, 1500);
    }
  }, [currentCountdown]);

  // Clean up sound when component unmounts
  useEffect(() => {
    return () => {
      if (sound.current) {
        sound.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.8);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentCountdown]);

  return (
    <Animated.View
      style={{
        ...styles.container,
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <Image source={countDownImages[currentCountdown]} style={styles.image} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  image: {
    width: "50%",
    height: "50%",
    resizeMode: "contain",
  },
});

export default Countdown;
