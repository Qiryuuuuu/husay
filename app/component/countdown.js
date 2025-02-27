import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Animated, StyleSheet } from 'react-native';

/* Countdown images */
const three = require(".././../assets/countdown/three.png");
const two = require(".././../assets/countdown/two.png");
const one = require(".././../assets/countdown/one.png");
const letsGo = require(".././../assets/countdown/letsGo.png");

const Countdown = ({ onCountDownComplete }) => {
    const countDownImages = [three, two, one, letsGo];

    const [currentCountdown, setCurrentCountdown] = useState(0);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;


    useEffect(() => {
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
                useNativeDriver: true
            })
        ]).start();
    }, [currentCountdown]);

    return (
        <Animated.View style={{ 
            ...styles.container, 
            opacity: fadeAnim, 
            transform: [{ scale: scaleAnim }]
        }}>
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
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10, 
    },
    image: {
        width: "50%",
        height: "50%",
        resizeMode: "contain",
    }
});



export default Countdown;
