import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigate } from "../component/navigationRef";
import PopupModal from "../component/PopupModal"; 

const TimerContext = createContext();
export const useTimer = () => useContext(TimerContext);

export const TimerProvider = ({ children }) => {
  const [studentId, setStudentId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showPopup, setShowPopup] = useState(false); // 🔔 state to control modal

  const timeLeftRef = useRef(60);
  const studentIdRef = useRef(null);
  const intervalRef = useRef(null);

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
    console.log("📦 Loaded timeLeft from DB:", currentLeft);
  };

  const startTimer = async (id) => {
    await stopTimer(); // clear any previous
    if (!id) return;

    console.log("▶️ Starting timer for:", id);
    setStudentId(id);
    studentIdRef.current = id;
    await loadTimerData(id);
    setElapsedTime(0);

    intervalRef.current = setInterval(() => {
      setElapsedTime((prev) => {
        const updated = prev + 1;
        const remaining = timeLeftRef.current - updated;

        timeLeftRef.current = remaining;
        setTimeLeft(remaining);

        console.groupCollapsed("⏳ Timer Tick");
        console.log("Student:", studentIdRef.current);
        console.log("Elapsed:", updated);
        console.log("Remaining:", remaining);
        console.groupEnd();

        if (remaining <= 0) {
          stopTimer(true);
        }

        return updated;
      });
    }, 60000);
  };

  const stopTimer = async (expired = false) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log("🛑 Timer stopped.");
    }

    const id = studentIdRef.current;

    if (id && (elapsedTime > 0 || timeLeftRef.current <= 0)) {
      await saveElapsedTimeToBackend(id, elapsedTime);
    }

    if (expired && id) {
      console.log("⏱️ Student reached max time DURING session:", id);
      navigate("StudentProfile");

      setTimeout(() => {
        console.log("📣 Showing modal after redirect");
        setShowPopup(true);
      }, 500);
    }

    setStudentId(null);
    studentIdRef.current = null;
    setElapsedTime(0);
  };

  const saveElapsedTimeToBackend = async (id, minutes) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const baseUrl = Platform.OS === "web" ? "http://localhost:5000" : "http://10.0.2.2:5000";

      const timeSpent = Math.min(60, 60 - timeLeftRef.current + minutes);
      const updatedTimeLeft = Math.max(0, 60 - timeSpent);

      console.log(`💾 Saving to /update-time for student ${id} → Spent: ${timeSpent}, Left: ${updatedTimeLeft}`);

      const res = await fetch(`${baseUrl}/api/students/update-time/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ timeSpent, timeLeft: updatedTimeLeft }),
      });

      const result = await res.json();
      console.log("✅ Save response:", result);

      timeLeftRef.current = updatedTimeLeft;
    } catch (err) {
      console.error("❌ Failed to save game time:", err);
    }
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <TimerContext.Provider value={{ startTimer, stopTimer, timeLeft }}>
      {children}
      <PopupModal
        visible={showPopup}
        message="You have reached the maximum screen time limit."
        onClose={() => setShowPopup(false)}
      />
    </TimerContext.Provider>
  );
};
