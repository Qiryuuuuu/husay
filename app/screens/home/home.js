import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen({ route }) {
  const { student } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Home</Text>
      {student && <Text style={styles.subtitle}>Selected Student: {student.name}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    marginTop: 10,
  },
});
