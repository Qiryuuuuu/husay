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
import PracMainScreen from "./screens/practice interface/PracMainScreen"

import PracticeEasyIntefaceScreen from "./screens/practice interface/easy/EasyInterface"

import ShapeModeScreen from "../app/screens/practice interface/easy/shape/ShapeModeScreen"
import ColorModeScreem from "../app/screens/practice interface/easy/color/ColorModeScreen"
import NumberModeScreen from "../app/screens/practice interface/easy/number/NumberModeScreen"

import PracticeMediumScreen from "../app/screens/practice interface/medium/PracticeMediumScreen"




const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PracticeMedium" screenOptions={{ headerShown: false }}>
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
        <Stack.Screen name="PracMainScreen" component={PracMainScreen}  />

        <Stack.Screen name="EasyMenuInteface" component={PracticeEasyIntefaceScreen} />
        <Stack.Screen name="ShapeMode" component={ShapeModeScreen} />
        <Stack.Screen name="ColorMode" component={ColorModeScreem} />
        <Stack.Screen name="NumberMode" component={NumberModeScreen} />

        <Stack.Screen name="PracticeMedium" component={PracticeMediumScreen} />


      </Stack.Navigator>
    </NavigationContainer>
  );
}