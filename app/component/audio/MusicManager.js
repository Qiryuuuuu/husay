// MusicManager.js
import { Audio } from "expo-av";

const musicFiles = {
  appBg: require("../../../assets/bgMusic/appBg.mp3"),
  gameInterfaceBg: require("../../../assets/bgMusic/gameInterfaceBg.mp3"),
  easyBg: require("../../../assets/bgMusic/easyBg.mp3"),
  mediumBg: require("../../../assets/bgMusic/mediumBg.mp3"),
  hardBg: require("../../../assets/bgMusic/hardBg.mp3"),
};

let soundObject = null; // For background music
let voiceObject = null; // For voice audio (e.g., dialog)
let fadeDuration = 1000; // 1 second fade

const volumeLevels = {
  appBg: 0.8,
  gameInterfaceBg: 0.6,
  easyBg: 0.7,
  mediumBg: 0.7,
  hardBg: 0.5,
};

// Fade out background music
const fadeOut = async () => {
  if (soundObject) {
    for (let volume = await soundObject.getStatusAsync().then(status => status.volume); volume >= 0; volume -= 0.1) {
      await soundObject.setVolumeAsync(volume);
      await new Promise((resolve) => setTimeout(resolve, fadeDuration / 10));
    }
    await soundObject.stopAsync();
    await soundObject.unloadAsync();
    soundObject = null;
  }
};

// Fade in background music
const fadeIn = async (musicKey) => {
  if (soundObject) {
    await fadeOut(); // Ensure old music fades out first
  }

  soundObject = new Audio.Sound();
  try {
    await soundObject.loadAsync(musicFiles[musicKey]);
    await soundObject.setIsLoopingAsync(true);
    await soundObject.setVolumeAsync(0); // Start with zero volume
    await soundObject.playAsync();

    const targetVolume = volumeLevels[musicKey] || 1.0; // Default to full volume if not specified

    // Gradually increase the volume
    for (let volume = 0; volume <= targetVolume; volume += 0.1) {
      await soundObject.setVolumeAsync(volume);
      await new Promise((resolve) => setTimeout(resolve, fadeDuration / 10));
    }
  } catch (error) {
    console.error("Error playing music:", error);
  }
};

// Stop background music
const stopMusic = async () => {
  await fadeOut();
};

// Play background music
const playMusic = async (musicKey) => {
  await fadeIn(musicKey);
};

// Play individual audio files (e.g., voiceovers)
const playAudio = async (audioFile) => {
  if (voiceObject) {
    await voiceObject.unloadAsync(); // Unload any previous audio
  }

  voiceObject = new Audio.Sound();
  try {
    await voiceObject.loadAsync(audioFile);
    await voiceObject.playAsync();
  } catch (error) {
    console.error("Error playing audio:", error);
  }
};

export { playMusic, stopMusic, playAudio }; // Export playAudio