import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';

const backgroundImg = require("../../../../../assets/gameBackground/practice-shape-bg.webp");
const evaExcited = require("../../../../../assets/eva/eva-excited.png");
const shaneGreet = require("../../../../../assets/shane/shane-greet.png");
const evaPointing = require("../../../../../assets/eva/eva-pointing.png");
const PregameDialog = ({ onDialogComplete }) => {
    const shapeDialog = [
        "Hey there, superstar! 🌟 Today, we’re playing a fun game all about SHAPES! Can you find circles, squares, rectangle and triangles? Let’s see if you’re a shape expert",
        "That’s right! I’m Shane, and I LOVE shapes! 😆 Get ready to match, sort, and play with all kinds of shapes. It’s easy-peasy, so don’t worry—I’ll guide you!",
        "Awesome! I know you’ll do great! 🎉 Let’s jump in and have some shape-tastic fun! Go, go, go!"
    ];
    
    const shapeNpcName = ["Eva", "Shane", "Eva"];

    // Dynamic image styles
    const npcImageStyles = {
        evaExcited: { width: 340, height: 480 },
        shaneGreet: { width: 500, height: 540 },
        evaPointing: { width: 601, height: 493 },
    };

    // Store images with corresponding styles
    const shapeNpc = [
        { image: evaExcited, style: npcImageStyles.evaExcited },
        { image: shaneGreet, style: npcImageStyles.shaneGreet },
        { image: evaPointing, style: npcImageStyles.evaPointing }
    ];

    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [currentNpcImage, setCurrentNpcImageIndex] = useState(0);
    const [currentShapeNpcName, setcurrentShapeNpcNameIndex] = useState(0);

    const handlePress = () => {
        if (currentMessageIndex < shapeDialog.length - 1) {
            setCurrentMessageIndex(prev => prev + 1);
            setCurrentNpcImageIndex(prev => prev + 1);
            setcurrentShapeNpcNameIndex(prev => prev + 1);
        } else {
            if (onDialogComplete) onDialogComplete();
        }
    };

    return (
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={handlePress}>
            <ImageBackground source={backgroundImg} style={styles.background}> 
                <View style={styles.overlay}>
                    <View style={styles.container}>
                        {/* ✅ Use the correct `source` and `style` dynamically */}
                        <Image source={shapeNpc[currentNpcImage].image} style={shapeNpc[currentNpcImage].style} />
                        <View style={styles.chatBubbleContainer}>
                            <View style={styles.chatContent}>
                                <Text style={styles.npcName}>{shapeNpcName[currentShapeNpcName]}</Text>
                                <Text style={styles.npcMessage}>{shapeDialog[currentMessageIndex]}</Text>
                            </View>
                        </View>
                        <View style={styles.nextTrigger}>
                            <Text style={styles.nextTriggerText}>Tap anywhere to continue</Text>
                        </View>
                    </View> 
                </View> 
            </ImageBackground>
        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  container:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
  },
  overlay:{
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)"
  },
  evaExcited:{
    width: 340,
    height: 480,
  },
  chatBubbleContainer:{
    width: "60%"
  },
  chatContent:{
    backgroundColor: "#E1F1FF",
    padding: 40,
    borderRadius: 30,
    borderWidth: 10,
    borderColor: "white",
  },
  npcName:{
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10
  },
  npcMessage:{
    fontSize: 20
  },
  nextTrigger:{
    marginTop: 50,
  },
  nextTriggerText:{
    color: "white",
    fontSize: 16
  }
});

export default PregameDialog;
