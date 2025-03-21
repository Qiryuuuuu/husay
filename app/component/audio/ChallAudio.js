import { Audio } from 'expo-av';
import { useEffect, useRef, useState } from 'react';

const AudioChall = ({ audioSources = [], onPlaybackComplete }) => {
  const sound = useRef(null);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);

  const loadAndPlaySound = async (index) => {
    try {
      if (sound.current) {
        await sound.current.unloadAsync(); // Ensure previous sound is unloaded
      }

      if (index < audioSources.length) {
        console.log(`🎧 Playing audio ${index + 1} of ${audioSources.length}`);

        const { sound: newSound } = await Audio.Sound.createAsync(
          audioSources[index],
          { shouldPlay: true }
        );

        sound.current = newSound;

        // Set listener for when the audio finishes playing
        newSound.setOnPlaybackStatusUpdate(async (status) => {
          if (status.didJustFinish) {
            console.log(`✅ Finished playing audio ${index + 1}`);

            await newSound.unloadAsync();
            const nextIndex = index + 1;

            if (nextIndex < audioSources.length) {
              setCurrentAudioIndex(nextIndex); // ✅ Move to next audio
            } else {
              console.log("🔊 All audios for this frame have finished.");
              onPlaybackComplete?.();
            }
          }
        });

        await newSound.playAsync();
      }
    } catch (error) {
      console.error('❌ Error loading sound:', error);
    }
  };

  useEffect(() => {
    if (audioSources.length > 0) {
      console.log("🔄 Resetting audio playback for new frame.");
      setCurrentAudioIndex(0); // ✅ Reset index for each new frame
      loadAndPlaySound(0);
    }

    return () => {
      if (sound.current) {
        sound.current.unloadAsync();
      }
    };
  }, [audioSources]);

  // Watch for index changes and load the next sound
  useEffect(() => {
    if (currentAudioIndex > 0 && currentAudioIndex < audioSources.length) {
      loadAndPlaySound(currentAudioIndex);
    }
  }, [currentAudioIndex]);

  return null; // Non-visual component
};

export default AudioChall;
