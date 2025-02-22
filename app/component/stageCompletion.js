import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const completionBg = require("../../assets/gameBackground/stage-completion-bg.png");
const headerStage = require("../../assets/stageCompletion/completion-header.png");
const retryBtn = require("../../assets/stageCompletion/retry-btn.png");
const homeBtn = require("../../assets/stageCompletion/home-btn.png");
const nextBtn = require("../../assets/stageCompletion/next-btn.png");



const StageCompletion = ({ timeTaken, correctAnswers, onRestart }) => {
    return (
        <View style={styles.containerStage}>
            <View style={styles.containerContent}> 
                <Image source={completionBg} style={styles.completionBg}/>
                <Image source={headerStage} style={styles.headerStage}/>
                
                <View style={styles.scoreContainer}>
                    <View style={[styles.timeContainer, styles.resultContainer]}>
                        <Text style={styles.stat}>Time Taken: </Text>
                        <Text style={styles.stat}>{timeTaken}</Text>
                    </View>
                    <View style={[styles.scoreContainer, styles.resultContainer]}>
                        <Text style={styles.stat}>Correct Answers: </Text>
                        <Text style={styles.stat}>{correctAnswers} / 5</Text>
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={onRestart}>
                        <Image source={retryBtn}style={styles.image}/>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.button}>
                        <Image source={homeBtn}style={styles.image}/>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.button}>
                        <Image source={nextBtn}style={styles.image}/>
                    </TouchableOpacity>
                </View>

            </View>


 
        </View>
    );
};

const styles = StyleSheet.create({
    containerStage: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    },
    containerContent:{
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
        zIndex: 10             
    },
    completionBg:{
        position: "absolute",
        width: "100%",
        height: "60%",
        resizeMode: "cover",
    },
    scoreContainer:{
        gap: 25,
    },
    resultContainer:{
        paddingVertical: 10,
        paddingHorizontal: 100,
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "#E1F1FF",
        borderWidth: 5,
        borderColor: "#69D4E7",
        borderRadius: 20
    },
    stat:{
        fontSize: 24,
        fontWeight: "bold",
    },
    buttonContainer:{
        position: "absolute",
        bottom: 180,
        flexDirection: "row",
        gap: 15
    }
});

export default StageCompletion;
