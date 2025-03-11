//AudioPlayer.js
import { Audio } from 'expo-av';
import { useEffect, useRef } from 'react';

const AudioPlayer = ({ audioSource, onPlaybackStatusUpdate, autoPlay = false }) => {
  const sound = useRef(null);

  const loadSound = async () => {
    try {
      if (sound.current) {
        await sound.current.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        audioSource,
        { shouldPlay: autoPlay },
        onPlaybackStatusUpdate
      );
      
      sound.current = newSound;
    } catch (error) {
      console.error('Error loading sound:', error);
    }
  };

  const playSound = async () => {
    try {
      if (sound.current) {
        await sound.current.playAsync();
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const stopSound = async () => {
    try {
      if (sound.current) {
        await sound.current.stopAsync();
      }
    } catch (error) {
      console.error('Error stopping sound:', error);
    }
  };

  useEffect(() => {
    loadSound();

    return () => {
      if (sound.current) {
        sound.current.unloadAsync();
      }
    };
  }, [audioSource]);

  return null; // This is a non-visual component
};

export default AudioPlayer;