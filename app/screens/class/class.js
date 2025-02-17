import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList } from "react-native";
import axios from "axios";

const element1 = require("../../../assets/element1.png");
const element3 = require("../../../assets/element3.png");
const element4 = require("../../../assets/element4.png");
const element5 = require("../../../assets/element5.png");
const element6 = require("../../../assets/element6.png");
const backIcon = require("../../../assets/back-icon.png");
const starIcon = require("../../../assets/star-icon.png");
import StudentCard from "../../component/studentCard";

export default function LeaderboardScreen({ navigation }) {
  const [students, setStudents] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("YOUR_MONGODB_API_ENDPOINT");
      const sortedStudents = response.data.sort((a, b) => b.stars - a.stars);
      setStudents(sortedStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const topThree = students.slice(0, 3);
  const displayedStudents = showAll ? students : topThree;
  const topStudent = students[0];

  return (
    <View style={styles.container}>
      <Image source={element1} style={[styles.element1, styles.backgroundElement]} />
      <Image source={element3} style={styles.element3} />
      <Image source={element4} style={styles.element4} />
      <Image source={element5} style={[styles.element5, styles.backgroundElement]} />
      <Image source={element6} style={styles.element6} />

      <View style={styles.navContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.backButton}>
          <Image source={backIcon} style={styles.backIcon} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowAll(!showAll)} style={[styles.button, styles.shadow]}>
          <Text style={styles.buttonText}>{showAll ? "Show Top 3" : "View all students"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.headerContainer}>
        <Text style={styles.title}>Outstanding</Text>
        <Text style={styles.subtitle}>The more you learn, the higher you go!</Text>
        {topStudent && <StudentCard student={topStudent} onPress={() => console.log("Top Student:", topStudent.name)} />}
      </View>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, styles.centerText]}>Ranking</Text>
          <Text style={[styles.headerText, styles.centerText]}>Name</Text>
          <Text style={[styles.headerText, styles.centerText]}>Stars</Text>
        </View>
        <FlatList
          data={displayedStudents}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.tableRow}>
              <Text style={[styles.cell, styles.centerText]}>{index + 1}.</Text>
              <Text style={[styles.cell, styles.centerText]}>{item.name}</Text>
              <View style={[styles.cell, styles.centerText, styles.starContainer]}>
                <Image source={starIcon} style={styles.starIcon} />
                <Text style={styles.cell}>{item.stars}</Text>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={true}
          style={{ flex: 1 }}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 Husay. All Rights Reserved.</Text>
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  element1: { position: "absolute", bottom: -180, left: -10, resizeMode: "contain" },
  element3: { position: "absolute", top: 400, left: -50, resizeMode: "contain" },
  element4: { position: "absolute", top: 200, right: -180, resizeMode: "contain" },
  element5: { position: "absolute", bottom: -40, right: 40, resizeMode: "contain" },
  element6: { position: "absolute", top: -70, left: 400, resizeMode: "contain" },
  backgroundElement: {
    position: "absolute",
    zIndex: -1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginVertical: 20,
    width: "90%",
  },
  centerText: {
    textAlign: "center",
    flex: 1,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  backText: {
    color: "#5A8EF4",
    fontSize: 16,
  },
  button: {
    width: "100%",
    maxWidth: 200,
    backgroundColor: "#5A8EF4",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 12,
    borderWidth: 2,
    borderColor: "white",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    backgroundColor: "#4A90E2",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  headerContainer:{
    alignItems: "center"
  },
  title:{
    fontWeight: "bold",
    fontSize: 26,
  },
  subtitle:{
    fontSize: 20
  },  
  tableContainer: {
    width: "50%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#5A8EF4",
    paddingVertical: 10,
  },
  headerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  cell: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  starIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
});