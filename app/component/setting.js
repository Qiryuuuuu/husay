import React from "react";
import { 
  View, Text, TouchableOpacity, Image, StyleSheet, Modal, 
  ImageBackground 
} from "react-native";

/* Default Background */
const defaultBackground = require("../../assets/gameBackground/setting-bg.png");
const defaultCloseIcon = require("../../assets/icons/close-setting.png");

const setting = ({ visible, onClose, headerImage, backgroundImg, buttonOneText, buttonTwoText, onButtonOnePress, onButtonTwoPress }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalWrapper}>
          <Image source={headerImage} style={styles.modalHeader} />

          <ImageBackground source={backgroundImg || defaultBackground} style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Image source={defaultCloseIcon} style={styles.closeIcon} />
            </TouchableOpacity>

            <View style={styles.modalContent}>
              <TouchableOpacity style={[styles.optionButton, styles.buttonOne]} onPress={onButtonOnePress}>
                <Text style={styles.optionText}>{buttonOneText}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.optionButton, styles.buttonTwo]} onPress={onButtonTwoPress}>
                <Text style={styles.optionText}>{buttonTwoText}</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalWrapper: {
    width: 631, 
    height: 479,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 631, 
    height: 479,
    justifyContent: "center",
    alignItems: "center",
  },
  modalHeader: {
    zIndex: 1,
    position: "absolute",
    top: 40,
  },
  closeButton: {
    position: "absolute",
    top: -20,
    right: -20,
  },
  closeIcon: {
    width: 100,
    height: 100,
  },
  modalContent: {
    alignItems: "center",
    marginTop: 150,
  },
  optionButton: {
    paddingVertical: 20,
    paddingHorizontal: 100,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 4,
    borderColor: "#FAE3B7",
  },
  buttonOne: {
    backgroundColor: "#69D4E7",
  },
  buttonTwo: {
    backgroundColor: "#ED5050",
  },
  optionText: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
});

export default setting;
