import React from "react";
import { BaseMediumGame } from "../../MediumBaseGame";
import dialogues from "../../../../data/evaDialogues"; 

// Import NPC (character) assets
const evaIdleImg = require("../../../../../assets/eva/eva-guess.png");
const evaCorrectImg = require("../../../../../assets/eva/eva-correct.png");
const evaWrongImg = require("../../../../../assets/eva/eva-wrong.png");

// Define all the game objects
const shapes = [
    { name: "Rectangle", image: require("../../../../../assets/shapes/rectangle.png") },
    { name: "Triangle", image: require("../../../../../assets/shapes/triangle.png") },
    { name: "Square", image: require("../../../../../assets/shapes/square.png") },
    { name: "Circle", image: require("../../../../../assets/shapes/circle.png") }
];

const colors = [
    { name: "Red", image: require("../../../../../assets/color/red.png") },
    { name: "Yellow", image: require("../../../../../assets/color/yellow.png") },
    { name: "Green", image: require("../../../../../assets/color/green.png") },
    { name: "Blue", image: require("../../../../../assets/color/blue.png") },
    { name: "Gray", image: require("../../../../../assets/color/gray.png") },
    { name: "Black", image: require("../../../../../assets/color/black.png") },
    { name: "White", image: require("../../../../../assets/color/white.png") }
];

const numbers = [
    { name: "One", image: require("../../../../../assets/numbers/one.png") },
    { name: "Two", image: require("../../../../../assets/numbers/two.png") },
    { name: "Three", image: require("../../../../../assets/numbers/three.png") },
    { name: "Four", image: require("../../../../../assets/numbers/four.png") },
    { name: "Five", image: require("../../../../../assets/numbers/five.png") },
    { name: "Six", image: require("../../../../../assets/numbers/six.png") },
    { name: "Seven", image: require("../../../../../assets/numbers/seven.png") },
    { name: "Eight", image: require("../../../../../assets/numbers/eight.png") },
    { name: "Nine", image: require("../../../../../assets/numbers/nine.png") },
    { name: "Ten", image: require("../../../../../assets/numbers/ten.png") }
];

// Group all categories into one object
const categories = {
    shape: shapes,
    color: colors,
    number: numbers
};

// NPC configuration
const npcConfig = {
    idle: evaIdleImg,
    correct: evaCorrectImg,
    wrong: evaWrongImg,
    name: "Eva"
};

interface PracticeMediumGameProps {
    onGameComplete: (time: number, score: number) => void;
    navigation: any;
}

const PracticeMediumGame: React.FC<PracticeMediumGameProps> = ({ onGameComplete, navigation }) => {
    return (
        <BaseMediumGame
            categories={categories}
            onGameComplete={onGameComplete}
            navigation={navigation}
            npcConfig={npcConfig}
            dialogues={dialogues}
            numRounds={5}
        />
    );
};

export default PracticeMediumGame;