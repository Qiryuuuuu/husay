import React from "react";
import { 
    View, Text, Image, StyleSheet, TouchableOpacity
} from "react-native";

const defaultStudent = require("../../assets/default-student.png");

const StudentCard = ({ student, onPress }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={() => onPress(student)}>
            <Image style={styles.studentImg} source={defaultStudent} />
            <Text style={styles.studentName}>{student.name}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
  card: {
    width: 220,  
    height: 220, 
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    padding: 10,  
    justifyContent: "center",
    marginVertical: 15, 
    marginHorizontal: 15, 
    elevation: 4, 
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  studentImg: {
    width: "90%",  
    height: "80%",
    borderRadius: 10,
    resizeMode: "contain",
  },
  studentName: {
    marginTop: 10, 
    fontSize: 16, 
    color: "#333",
    textAlign: "center",
  },
});

export default StudentCard;
