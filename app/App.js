import React from "react";
import { TimerProvider } from "./contexts/TimerContext";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { navigationRef } from "./component/navigationRef";

import LoginScreen from "./screens/account validation/signIn";
import SignUpScreen from "./screens/account validation/signUp";
import SecurityQuestionScreen from "./screens/account validation/securityQuestion";

import ForgotPasswordScreen from "./screens/forgot password/forgotPass";
import ForgotSecurityQuestionScreen from "./screens/forgot password/forgotSecuQuestion";
import EnterCodeScreen from "./screens/forgot password/enterCode";
import SetPasswordScreen from "./screens/forgot password/setPassword";

import StudentProfileScreen from "./screens/manage profile/studentProfile";
import AddStudentScreen from "./screens/manage profile/addStudents";
import DashboardScreen from "./screens/dashboard/dashboard";
import AccountSettingsScreen from "./screens/dashboard/accountSettings";

import HomeScreen from "./screens/home/home";
import ClassScreen from "./screens/class/class";
import PracMainScreen from "./screens/practice interface/PracMainScreen";
import ChallMainScreen from "./screens/challenge interface/ChallMainScreen";

import PracticeEasyIntefaceScreen from "./screens/practice interface/easy/EasyInterface";
import ChallengeEasyIntefaceScreen from "./screens/challenge interface/easy/EasyInterface";

import PracticeShape from "./screens/practice interface/easy/shape/PracticeShape";
import PracticeColor from "./screens/practice interface/easy/color/PracticeColor";
import PracticeNumber from "./screens/practice interface/easy/number/PracticeNumber";
import PracticeMediumScreen from "../app/screens/practice interface/medium/PracticeMediumScreen";
import PracticeHardScreen from "./screens/practice interface/hard/PracticeHard";

import ChallengeShape from "./screens/challenge interface/easy/shape/ChallengeShape";
import ChallengeColor from "./screens/challenge interface/easy/color/ChallengeColor";
import ChallengeNumber from "./screens/challenge interface/easy/number/ChallengeNumber";
import ChallengeMedium from "../app/screens/challenge interface/medium/ChallengeMedium";
import ChallengeHard from "../app/screens/challenge interface/hard/ChallengeHard";

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer ref={navigationRef}>
      <TimerProvider>
      <Stack.Navigator
        initialRouteName="ForgotSecurityQuestion"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen
          name="SecurityQuestion"
          component={SecurityQuestionScreen}
        />

        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen
          name="ForgotSecurityQuestion"
          component={ForgotSecurityQuestionScreen}
        />
        <Stack.Screen name="EnterCode" component={EnterCodeScreen} />
        <Stack.Screen name="SetPassword" component={SetPasswordScreen} />

        <Stack.Screen name="AddStudent" component={AddStudentScreen} />
        <Stack.Screen name="StudentProfile" component={StudentProfileScreen} />

        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen
          name="AccountSettings"
          component={AccountSettingsScreen}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Home" }}
        />
        <Stack.Screen name="Class" component={ClassScreen} />
        <Stack.Screen
          name="PracMainScreen"
          component={PracMainScreen}
          options={{ title: "Practice" }}
        />
        <Stack.Screen
          name="ChallMainScreen"
          component={ChallMainScreen}
          options={{ title: "ChallengeMenu" }}
        />

        <Stack.Screen
          name="EasyMenuInteface"
          component={PracticeEasyIntefaceScreen}
          options={{ title: "EasyMenu" }}
        />
        <Stack.Screen
          name="ChallengeEasyInterface"
          component={ChallengeEasyIntefaceScreen}
        />

        <Stack.Screen
          name="PracticeShape"
          component={PracticeShape}
          options={{ title: "EasyShape" }}
        />
        <Stack.Screen
          name="PracticeColor"
          component={PracticeColor}
          options={{ title: "EasyColor" }}
        />
        <Stack.Screen
          name="PracticeNumber"
          component={PracticeNumber}
          options={{ title: "EasyNumber" }}
        />
        <Stack.Screen
          name="PracticeMedium"
          component={PracticeMediumScreen}
          options={{ title: "PracticeMedium" }}
        />
        <Stack.Screen
          name="PracticeHard"
          component={PracticeHardScreen}
          options={{ title: "PracticeHard" }}
        />

        <Stack.Screen
          name="ChallengeShape"
          component={ChallengeShape}
          options={{ title: "ChallShape" }}
        />

        <Stack.Screen
          name="ChallengeColor"
          component={ChallengeColor}
          options={{ title: "ChallColor" }}
        />
        <Stack.Screen
          name="ChallengeNumber"
          component={ChallengeNumber}
          options={{ title: "ChallColor" }}
        />
        <Stack.Screen
          name="ChallengeMedium"
          component={ChallengeMedium}
          options={{ title: "ChallMedium" }}
        />
        <Stack.Screen
          name="ChallengeHard"
          component={ChallengeHard}
          options={{ title: "ChallHard" }}
        />
      </Stack.Navigator>
      </TimerProvider>
    </NavigationContainer>
  );
}
