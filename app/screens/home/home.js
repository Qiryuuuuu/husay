import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, useWindowDimensions } from "react-native";

const logoImg = require("../../../assets/logo.png");
const element1 = require("../../../assets/element1.png");
const element2 = require("../../../assets/element2.png");
const element3 = require("../../../assets/element3.png");
const element4 = require("../../../assets/element4.png");
const element5 = require("../../../assets/element5.png");
const element6 = require("../../../assets/element6.png");
const logoutIcon = require("../../../assets/logout-icon.png");
const defaultStudent = require("../../../assets/default-student.png");
const evaImg = require("../../../assets/eva1.png")

export default function homeScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Background Elements */}
      <Image source={element1} style={styles.element1} />
      <Image source={element3} style={styles.element3} />
      <Image source={element4} style={styles.element4} />
      <Image source={element5} style={styles.element5} />
      <Image source={element6} style={styles.element6} />

      <View style={styles.profileImg}>

      </View>

      <View style={styles.headerIconsContainer}>
        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutIconContent} onPress={() => setModalVisible(true)}>
          <Image source={logoutIcon} style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Profile Image */}
        <View style={styles.profileContainer}>
          <Image source={defaultStudent} style={styles.studentProfile} />
        </View>
      </View>

      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
        <Image source={evaImg} style={styles.evaImg} />

          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Come back soon for more fun!</Text>
            <Text style={styles.modalSubHeader}>Are you sure you want to log out?</Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate("Login")}>
                <Text style={styles.logoutButtonText}>Yes, Log Out</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>No, Stay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


      {/* Header */}
      <View style={styles.headerContainer}>
        <Image source={logoImg} style={styles.logo} />
        <View style={styles.textHeader}>
          <Text style={styles.title}>Husay</Text>
          <Text style={styles.subtitle}>Hugis, bilang, at kulay — aalalay!</Text>
        </View>
      </View>
  

      <View style={styles.btnContainer}>
        <TouchableOpacity style={[styles.button, styles.shadow]} >
          <Text style={styles.buttonText}>Class</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.shadow]} >
          <Text style={styles.buttonText}>Practice</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.shadow]} >
          <Text style={styles.buttonText}>Challange</Text>
      </TouchableOpacity>

      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 Husay. All Rights Reserved.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  element1: { position: "absolute", bottom: -180, left: -10, resizeMode: "contain" },
  element2: { position: "absolute", top: -180, right: -70, resizeMode: "contain" },
  element3: { position: "absolute", left: -50, resizeMode: "contain" },
  element4: { position: "absolute", right: -180, resizeMode: "contain" },
  element5: { position: "absolute", bottom: -40, right: 40, resizeMode: "contain" },
  element6: { position: "absolute", top: -70, left: 700, resizeMode: "contain" },
  
  headerIconsContainer: {
    position: "absolute",
    top: 50,
    width: "90%",  
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", 
    paddingHorizontal: 20,
  },
  logoutIconContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoutIcon: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  logoutText: {
    fontSize: 16,
    color: "#5A8EF4",
    fontWeight: "bold",
  },

  /* 🔹 Profile Image */
  profileContainer: {
    alignItems: "center",
  },
  studentProfile: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
    resizeMode: "contain",
  },
  textHeader: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: "#333",
    flexShrink: 1,
    fontWeight: "bold"
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
  },
  btnContainer:{
    width: "100%",
    maxWidth: 350,
  },
  button: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#5A8EF4",
    padding: 20,
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
  evaImg: { 
    position: "absolute", 
    top: 70, 
    resizeMode: "contain", 
    width: 300,
    height: 420
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: 500,
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10,
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  modalSubHeader: {
    fontSize: 16,
    color: "#666",
    marginVertical: 10,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    marginTop: 15,
    gap: 10,
    justifyContent: "center"
  },
  logoutButton: {
    backgroundColor: "#ff4d4d",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#5A8EF4",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});