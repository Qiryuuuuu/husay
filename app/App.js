import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "./screens/account validation/signIn";
import SignUpScreen from "./screens/account validation/signUp";
import SecurityQuestionScreen from "./screens/account validation/securityQuestion"

import ForgotPasswordScreen from "./screens/forgot password/forgotPass"
import ForgotSecurityQuestionScreen from "./screens/forgot password/forgotSecuQuestion"
import EnterCodeScreen from "./screens/forgot password/enterCode"
import SetPasswordScreen from "./screens/forgot password/setPassword"

import StudentProfileScreen from "./screens/manage profile/studentProfile"
import AddStudentScreen from "./screens/manage profile/addStudents"

import HomeScreen from "./screens/home/home"

import ClassScreen from "./screens/class/class"

import PracticeInterfaceScreen from "./screens/practice interface/SelectDifficulty"
import PregameDialogScreen from "./component/game/PregameDialog"
import PracticeEasyMenuIntefaceScreen from "./screens/practice interface/easy/main"

import CountdownScreen from "./component/countdown"
import ShapeGame from "./component/game/shapeGame"
import StageCompletionScreen from "./component/stageCompletion"

import ShapeModeScreen from "../app/screens/practice interface/easy/shape/ShapeModeScreen"
import ColorModeScreem from "../app/screens/practice interface/easy/color/ColorModeScreen"

import NumberGameScreen from "../app/screens/practice interface/easy/number/NumberModeScreen"




const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="NumberGame" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="SecurityQuestion" component={SecurityQuestionScreen} />

        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ForgotSecurityQuestion" component={ForgotSecurityQuestionScreen} />
        <Stack.Screen name="EnterCode" component={EnterCodeScreen} />
        <Stack.Screen name="SetPassword" component={SetPasswordScreen} />

        <Stack.Screen name="AddStudent" component={AddStudentScreen} />
        <Stack.Screen name="StudentProfile" component={StudentProfileScreen} />

        <Stack.Screen name="Home" component={HomeScreen} />

        <Stack.Screen name="Class" component={ClassScreen} />

        <Stack.Screen name="PracticeInterface" component={PracticeInterfaceScreen} />
        <Stack.Screen name="EasyMenuInteface" component={PracticeEasyMenuIntefaceScreen} />
       
        <Stack.Screen name="PregameDialog" component={PregameDialogScreen} />
      
        <Stack.Screen name="Countdown" component={CountdownScreen} />
        <Stack.Screen name="ShapeGame" component={ShapeGame} />
        <Stack.Screen name="StageCompletion" component={StageCompletionScreen} />

        <Stack.Screen name="ShapeMode" component={ShapeModeScreen} />
        <Stack.Screen name="ColorMode" component={ColorModeScreem} />

        <Stack.Screen name="NumberGame" component={NumberGameScreen} />




      </Stack.Navigator>
    </NavigationContainer>
  );
}