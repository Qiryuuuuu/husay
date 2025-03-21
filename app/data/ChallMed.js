// gameData.js - This file contains the game data for Challenge Mode

// Import categories
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
  
  // Challenge Mode rounds scenarios
  const challengeRounds = [
    // Round 1: The Pig Problem
    {
      id: 'pig-problem',
      scenes: [
        {
          type: 'dialog',
          backgroundImage: require("../../../../../assets/challenges/pig-problem.webp"),
          character: 'EVA',
          dialog: [
            "What's that sound? *walks towards the sound*",
            "Ohhh no, it's piggy! It looks trapped between those two tall trees.",
            "Will you help me free piggy?",
            "They say if you help someone, they might help you in return."
          ]
        },
        {
          type: 'question',
          questionText: "Which tool will help free the pig?",
          categoryOptions: {
            shapes: "Which shape will help free the pig?",
            colors: "What color grease should we use to help the pig?",
            numbers: "How many people should help pull the pig out?"
          }
        },
        {
          type: 'dialog',
          backgroundImage: null, // Will be set dynamically based on answer
          character: 'EVA',
          correctDialog: [
            "Ohhh, silly me. Good thing I have grease!",