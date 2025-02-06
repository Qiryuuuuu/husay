import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/signIn";
import SignUpScreen from "./screens/signUp";
import securityQuestionScreen from "./screens/securityQuestion";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="SecurityQuestion" component={securityQuestionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
