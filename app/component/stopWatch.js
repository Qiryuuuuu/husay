import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

const Stopwatch = ({ isRunning, onStop }) => {
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        let timer;
        if (isRunning) {
            timer = setInterval(() => {
                setElapsedTime(prevTime => prevTime + 1);
            }, 1000);
        } else {
            clearInterval(timer);
            if (elapsedTime > 0 && onStop) {
                onStop(elapsedTime); 
            }
        }
        return () => clearInterval(timer);
    }, [isRunning]);

    // Format time (mm:ss)
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    return (
        <View style={styles.stopwatchContainer}>
            <Text style={styles.stopwatchText}>⏱ Time: {formatTime(elapsedTime)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    stopwatchContainer: {
        marginBottom: 15,
        backgroundColor: "rgba(0,0,0,0.7)",
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
    },
    stopwatchText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default Stopwatch;
