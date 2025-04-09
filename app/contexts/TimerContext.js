import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const TimerContext = createContext();
export const useTimer = () => useContext(TimerContext);

export const TimerProvider = ({ children }) => {
  const [studentId, setStudentId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [sessionStart, setSessionStart] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const timeLeftRef = useRef(60);
  const intervalRef = useRef(null);
  const navigation = useNavigation();

  const loadTimerData = async (id) => {
    const token = await AsyncStorage.getItem("authToken");
    const baseUrl = Platform.OS === "web" ? "http://localhost:5000" : "http://10.0.2.2:5000";

    const res = await fetch(`${baseUrl}/api/students/get/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    const currentLeft = data?.student?.gameTime?.timeLeft ?? 60;
    timeLeftRef.current = currentLeft;
    setTimeLeft(currentLeft);
  };

  const startTimer = async (id) => {
    await stopTimer(); // stop any existing timer
    if (!id) return;

    console.log("▶️ Starting timer for:", id);
    setStudentId(id);
    await loadTimerData(id);
    setSessionStart(Date.now());
    setElapsedTime(0);

    intervalRef.current = setInterval(() => {
      setElapsedTime((prev) => {
        const updated = prev + 1;
        const remaining = timeLeftRef.current - updated;

        console.groupCollapsed("⏳ Timer Tick");
        console.log("Student:", studentId);
        console.log("Elapsed:", updated);
        console.log("Remaining:", remaining);
        console.groupEnd();

        setTimeLeft(remaining);

        if (remaining <= 0) {
          stopTimer(true);
        }

        return updated;
      });
    }, 60 * 1000); // Every 1 minute
  };

  const stopTimer = async (expired = false) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log("🛑 Timer stopped.");
    }

    if (studentId && elapsedTime > 0) {
      await saveElapsedTimeToBackend(elapsedTime);
    }

    if (expired) {
      Alert.alert("⏰ Time's up!", "You have spent 1 hour of screen time.");
      navigation.navigate("StudentProfile");
    }

    // Reset all
    setStudentId(null);
    setElapsedTime(0);
    setSessionStart(null);
  };

  const saveElapsedTimeToBackend = async (minutes) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const baseUrl = Platform.OS === "web" ? "http://localhost:5000" : "http://10.0.2.2:5000";
  
      console.log(`💾 Saving ${minutes} minutes for student: ${studentId}`);
  
      await fetch(`${baseUrl}/api/students/update-time/${studentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          timeSpent: 60 - timeLeftRef.current + minutes,
          timeLeft: Math.max(0, timeLeftRef.current - minutes),
        }),
      });
    } catch (err) {
      console.error("❌ Failed to save game time:", err);
    }
  };
  

  // Optional: Clean up on unmount
  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <TimerContext.Provider value={{ startTimer, stopTimer, timeLeft }}>
      {children}
    </TimerContext.Provider>
  );
};
