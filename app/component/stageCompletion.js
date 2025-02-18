import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const StageCompletion = ({ timeTaken, correctAnswers, onRestart }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>🎉 Stage Completed! 🎉</Text>

            <View style={styles.scoreContainer}>
                <Text style={styles.stat}>⏱ Time Taken: {timeTaken}</Text>
                <Text style={styles.stat}>✅ Correct Answers: {correctAnswers} / 5</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={onRestart}>
                <Text style={styles.buttonText}>🔄 Play Again</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        padding: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    scoreContainer: {
        backgroundColor: "#E1F1FF",
        padding: 20,
        borderRadius: 15,
        width: "80%",
        alignItems: "center",
        marginBottom: 20,
    },
    stat: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    button: {
        backgroundColor: "#5A8EF4",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default StageCompletion;
