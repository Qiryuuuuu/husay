import React from "react";
import { 
    View, Text, Image, StyleSheet, useWindowDimensions, TouchableOpacity, Alert, ScrollView 
  } from "react-native";
  
const defaultStudent = require ("../../assets/default-student.png")

const StudentCard = ({student, onPress}) => {
    return(
        <TouchableOpacity style={styles.card} onPress={() => onPress(student)}>
            <Image style={styles.studentImg} source={defaultStudent} />
            <Text style={styles.studentName}>{student.name}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
      width: "22%",
      backgroundColor: "#fff",
      borderRadius: 12,
      alignItems: "center",
      padding: 10,
      marginVertical: 8,
      marginHorizontal: 10,
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 1, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    studentImg: {
      width: "100%",
      height: 90,
      borderRadius: 12,
    },
    studentName: {
      marginTop: 10,
      fontSize: 14,
      color: "#333",
    },
  });
  
  export default StudentCard;