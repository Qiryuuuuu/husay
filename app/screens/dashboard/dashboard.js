//dashboard.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Modal,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { PieChart } from "react-native-svg-charts";
import { Text as SVGText } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import moment from "moment";

export default function DashboardScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const [students, setStudents] = useState([]); // ✅ Store students
  const [selectedStudent, setSelectedStudent] = useState(null); // ✅ Selected student
  const [dropdownOpen, setDropdownOpen] = useState(false); // ✅ Dropdown state
  const [studentDropdownOpen, setStudentDropdownOpen] = useState(false);
  const [fullName, setFullName] = useState(""); // ✅ State for teacher's name
  const [loading, setLoading] = useState(true); // ✅ State for loading
  const [employeeNo, setEmployeeNo] = useState(""); // ✅ Employee number for fetching students
  const [menuOpenStudentId, setMenuOpenStudentId] = useState(null); // ✅ Track menu open for student

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editGender, setEditGender] = useState("");
  const [familiarityData, setFamiliarityData] = useState(null);
  const [accuracyData, setAccuracyData] = useState({
    correct: 0,
    incorrect: 0,
  }); // ✅ Add this
  const [timeSpentData, setTimeSpentData] = useState({
    timeSpent: 0,
    timeLeft: 60,
    timeSpentColor: "#FF3B30",
    timeLeftColor: "#4CD964",
  });
  const [attendanceData, setAttendanceData] = useState({});

  const today = moment(); // gets current date
  const detectedQuarter = Math.floor(today.month() / 3) + 1;
  const [currentQuarter, setCurrentQuarter] = useState(detectedQuarter);
  const [currentYear, setCurrentYear] = useState(today.year());

  // ✅ Fetch User Data
  const fetchUser = async () => {
    try {
      console.log("🔍 Fetching user data...");
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.log("❌ No token found, user might be logged out.");
        setLoading(false);
        return;
      }

      const baseUrl =
        Platform.OS === "web"
          ? "http://localhost:5000"
          : "http://10.0.2.2:5000";

      const response = await fetch(`${baseUrl}/api/auth/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("🔹 User Data:", data);

      if (response.ok && data != null) {
        setFullName(data.fullName || "User");
        setEmployeeNo(data.employeeNo); // ✅ Store employee number
        fetchClassData(data.employeeNo); // ✅ Fetch students from class
      } else {
        console.log("❌ Error fetching user:", data.message);
      }
    } catch (error) {
      console.log("❌ Network error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  //✅ Fetch Class Data
  const fetchClassData = async (employeeNo) => {
    try {
      if (!employeeNo) {
        console.log("❌ Employee number not found. Cannot fetch class.");
        return;
      }

      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.log("❌ No token found, user might be logged out.");
        return;
      }

      console.log(`🔍 Fetching class data for employeeNo: ${employeeNo}...`);

      const baseUrl =
        Platform.OS === "web"
          ? "http://localhost:5000"
          : "http://10.0.2.2:5000";

      const response = await fetch(
        `${baseUrl}/api/class/get-students?employeeNo=${employeeNo}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("🔹 Class API Response:", data);

      if (
        response.ok &&
        Array.isArray(data.students) &&
        data.students.length > 0
      ) {
        setStudents(data.students);
        setSelectedStudent(data.students[0]);
      } else if (
        response.ok &&
        Array.isArray(data.students) &&
        data.students.length === 0
      ) {
        console.log("ℹ️ No students found, new user likely.");
        setStudents([]);
        setSelectedStudent(null);
      } else {
        console.log(
          "❌ Unexpected class fetch error:",
          data.message || "Unknown error"
        );
        setStudents([]);
        setSelectedStudent(null);
      }
    } catch (error) {
      console.log("❌ Server error fetching students:", error);
    }
  };

  // ✅ Fetch Students
  const fetchStudents = async (employeeNo) => {
    try {
      console.log("🔍 Fetching students for employeeNo:", employeeNo);

      const token = await AsyncStorage.getItem("authToken");
      console.log("🔐 Token:", token);

      if (!token) {
        console.log("❌ No token found, user might be logged out.");
        return;
      }

      const baseUrl =
        Platform.OS === "web"
          ? "http://localhost:5000"
          : "http://10.0.2.2:5000";

      const response = await fetch(
        `${baseUrl}/api/students/all?employeeNo=${employeeNo}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log(
        "🔹 Fresh Student API Response:",
        JSON.stringify(data, null, 2)
      );

      if (response.ok && data.students && data.students.length > 0) {
        setStudents(data.students);
        setSelectedStudent(data.students[0]);

        // ✅ Fetch and update all related student data
        updateStudentData(data.students[0]);
      } else {
        console.log("❌ No students found or API returned an error.");
      }
    } catch (error) {
      console.log("❌ Server error fetching students:", error);
    }
  };

  const fetchStudentDetails = async (studentId) => {
    try {
      if (!studentId) {
        console.log("❌ No student ID provided.");
        return;
      }

      console.log(`🔍 Fetching details for student ID: ${studentId}...`);

      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.log("❌ No token found. Cannot fetch student details.");
        return;
      }

      const baseUrl =
        Platform.OS === "web"
          ? "http://localhost:5000"
          : "http://10.0.2.2:5000";

      const response = await fetch(`${baseUrl}/api/students/get/${studentId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("🔹 Full API Response:", JSON.stringify(data, null, 2));

      if (response.ok && data.student) {
        const student = data.student;
        console.log("✅ Extracted Student Data:", student);

        // ✅ Extract game time data
        let timeSpent = student.gameTime?.timeSpent;
        let timeLeft = student.gameTime?.timeLeft;

        // ✅ Handle missing or unreadable data
        if (
          typeof timeSpent !== "number" ||
          typeof timeLeft !== "number" ||
          timeLeft > 60
        ) {
          console.warn(
            "⚠️ Game time data missing or unreadable. Resetting to defaults."
          );
          timeSpent = 0;
          timeLeft = 60;
        } else {
          // ✅ Ensure time spent calculation is correct
          timeSpent = 60 - timeLeft;
        }

        console.log(`✅ Corrected Time Spent: ${timeSpent} mins`);
        console.log(`✅ Corrected Time Left: ${timeLeft} mins`);

        // ✅ Update state with the correct color mapping
        setTimeSpentData({
          timeSpent,
          timeLeft,
          timeSpentColor: "#FF3B30", // Always Red for Spent
          timeLeftColor: timeLeft > 0 ? "#4CD964" : "#FF3B30", // Green if some time is left, Red if full 60 mins
        });

        // ✅ Update attendance data
        setAttendanceData(getAttendanceData([student]));
        console.log("✅ Attendance Data Processed and Set.");

        // ✅ Update accuracy data
        setAccuracyData({
          correct: student.accuracy?.correct || 0,
          incorrect: student.accuracy?.incorrect || 0,
        });
        console.log("✅ Accuracy Data Processed and Set.");
        // ✅ Fetch familiarity data
        fetchFamiliarityData(student);
      } else {
        console.log("❌ Error fetching student details:", data.message);

        // ✅ Handle case where API fails or student data is unreadable
        setTimeSpentData({
          timeSpent: 0,
          timeLeft: 60,
          timeSpentColor: "#FF3B30", // All red when data is missing
          timeLeftColor: "#FF3B30", // All red when data is missing
        });
      }
    } catch (error) {
      console.log("❌ Network error fetching student details:", error);

      // ✅ Handle network failure scenario
      setTimeSpentData({
        timeSpent: 0,
        timeLeft: 60,
        timeSpentColor: "#FF3B30", // All red when network fails
        timeLeftColor: "#FF3B30", // All red when network fails
      });
    }
  };

  //Logout
  const handleLogout = async () => {
    try {
      // Remove authentication token from storage
      await AsyncStorage.clear();

      // Show alert confirmation and navigate to login
      Alert.alert("Logged Out", "You have been logged out.", [
        { text: "OK", onPress: () => navigation.replace("Login") },
      ]);

      console.log("✅ User successfully logged out.");
    } catch (error) {
      console.log("❌ Error logging out:", error);
    }
  };

  function parseCustomDate(dateString) {
    // The dateString is something like:
    //  "Date: 04-09-2025, 01:57:58 PM | Time: 04/09/2025, 01:57:58 PM"

    // 1) Split on "| Time: "
    const parts = dateString.split("| Time: ");
    if (parts.length === 2) {
      // parts[1] is "04/09/2025, 01:57:58 PM"
      return moment(parts[1].trim(), "MM/DD/YYYY, hh:mm:ss A", true);
    }

    // Fallback in case the string doesn't have the expected structure
    return moment(
      dateString,
      ["YYYY-MM-DD", "MM-DD-YYYY hh:mm:ss A", "MM/DD/YYYY, hh:mm:ss A"],
      true
    );
  }

  // ✅ Function to Process Attendance Data
  const getAttendanceData = (students) => {
    if (!students || students.length === 0) {
      console.log("❌ No students provided for attendance processing.");
      return {};
    }

    console.log("🔹 Processing attendance for students:", students);

    const data = {};
    const currentYear = moment().year();

    students.forEach((student) => {
      if (!student.attendance || !Array.isArray(student.attendance)) {
        console.warn(`⚠️ No attendance record for ${student.fullName}.`);
        return;
      }

      student.attendance.forEach(({ date, status }) => {
        if (!date) return; // skip

        let parsedDate = parseCustomDate(date);
        if (!parsedDate.isValid()) {
          console.warn(`⚠️ Invalid date: ${date} for ${student.fullName}`);
          return;
        }

        // Now parsedDate works, so we can mark attendance
        const month = parsedDate.month(); // 0-based
        const dayIndex = parsedDate.date() - 1; // 0-based
        if (!data[month]) {
          const daysInMonth = moment(
            `${currentYear}-${month + 1}`,
            "YYYY-MM"
          ).daysInMonth();
          data[month] = Array(daysInMonth).fill("");
        }
        data[month][dayIndex] = status?.toLowerCase() || "";
      });
    });

    console.log("✅ Attendance Data Processed:", data);
    return data;
  };

  // Quarter handling logic
  const quarters = {
    1: [0, 1, 2], // Jan-Mar
    2: [3, 4, 5], // Apr-Jun
    3: [6, 7, 8], // Jul-Sep
    4: [9, 10, 11], // Oct-Dec
  };

  const handleNextQuarter = () => {
    if (currentQuarter === 4) {
      setCurrentQuarter(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentQuarter(currentQuarter + 1);
    }
  };

  const handlePrevQuarter = () => {
    if (currentQuarter === 1) {
      setCurrentQuarter(4);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentQuarter(currentQuarter - 1);
    }
  };

  // Render Calendar Day
  const renderDay = (day, status, month, year, student) => {
    const today = moment().startOf("day"); // Normalize to compare only the date
    const currentDay = moment(
      `${year}-${month + 1}-${day}`,
      "YYYY-MM-DD"
    ).startOf("day");
    const isToday = currentDay.isSame(today, "day"); // ✅ Check if the day is today
    const isFuture = currentDay.isAfter(today, "day");
    const weekday = currentDay.day();

    let backgroundColor = "#D3D3D3"; // Default gray
    let textColor = "#FFFFFF"; // Default white text

    if (isToday) {
      textColor = "#FFFFFF"; // ✅ Ensure text is readable
    } else if (!isFuture && weekday !== 0 && weekday !== 6) {
      backgroundColor =
        status?.toLowerCase() === "present" ? "#4CD964" : "#FF3B30";
    }

    return (
      <View
        key={`${year}-${month}-${day}`}
        style={[
          styles.dayItem,
          {
            backgroundColor,
            borderWidth: isToday ? 2 : 0,
            borderColor: isToday ? "#004A99" : "transparent",
          },
        ]}
      >
        <Text
          style={[
            styles.dayText,
            { color: textColor, fontWeight: isToday ? "bold" : "normal" },
          ]}
        >
          {day}
        </Text>
      </View>
    );
  };

  //Pie Chart
  const LabelsPie = ({ slices = [] }) => {
    if (!slices.length) return null; // Prevent rendering errors
    return slices.map((slice, index) => {
      const { pieCentroid, data } = slice;
      return (
        <SVGText
          key={index}
          x={pieCentroid[0]}
          y={pieCentroid[1]}
          fill="black"
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={15}
          strokeWidth={0.2}
        >
          {data.label}
        </SVGText>
      );
    });
  };

  // Toggle menu function
  const toggleMenu = () => {
    setMenuOpenStudentId(!menuOpen);
    // Close other dropdowns when opening menu
    if (!menuOpen) {
      setStudentDropdownOpen(false);
    }
  };

  // Toggle Student Dropdown
  const toggleStudentDropdown = () => {
    setStudentDropdownOpen(!studentDropdownOpen);
    if (!studentDropdownOpen) {
      setMenuOpenStudentId(false);
    }
  };

  // Select Student from Dropdown
  const selectStudent = async (student) => {
    if (!student || !student._id) return;

    setSelectedStudent(student);
    setStudentDropdownOpen(false);
    setMenuOpenStudentId(null);

    // ✅ Fetch and update all related student data
    await fetchStudentDetails(student._id);
  };

  // ✅ Fetch Familiarity
  const fetchFamiliarityData = async (student) => {
    if (!student || !student.subjects) {
      console.warn("⚠️ No Familiarity Data found. Setting default values.");
      setFamiliarityData({
        Shapes: { Square: 0, Triangle: 0, Circle: 0, Rectangle: 0 },
        Colors: {
          Red: 0,
          Yellow: 0,
          Blue: 0,
          Green: 0,
          Black: 0,
          Gray: 0,
          White: 0,
        },
        Numbers: {
          "One (1)": 0,
          "Two (2)": 0,
          "Three (3)": 0,
          "Four (4)": 0,
          "Five (5)": 0,
          "Six (6)": 0,
          "Seven (7)": 0,
          "Eight (8)": 0,
          "Nine (9)": 0,
          "Ten (10)": 0,
        },
      });
      return;
    }

    console.log(
      "🔍 Fetching Familiarity Data from API:",
      JSON.stringify(student.subjects, null, 2)
    );

    const familiarityData = {
      Shapes: {},
      Colors: {},
      Numbers: {},
    };

    // ✅ Correctly map the database field "percentage" for each subject
    const numberMapping = {
      One: "One (1)",
      Two: "Two (2)",
      Three: "Three (3)",
      Four: "Four (4)",
      Five: "Five (5)",
      Six: "Six (6)",
      Seven: "Seven (7)",
      Eight: "Eight (8)",
      Nine: "Nine (9)",
      Ten: "Ten (10)",
    };

    // ✅ Process each category (Shapes, Colors, Numbers)
    ["Shapes", "Colors", "Numbers"].forEach((category) => {
      if (student.subjects[category]) {
        Object.entries(student.subjects[category]).forEach(
          ([element, data]) => {
            if (element !== "Mastery") {
              // ✅ Fetch percentage directly from the database
              const percentage = data.percentage || 0;

              // ✅ Map numbers correctly for display
              if (category === "Numbers") {
                familiarityData[category][numberMapping[element]] =
                  Math.round(percentage);
              } else {
                familiarityData[category][element] = Math.round(percentage);
              }
            }
          }
        );
      }
    });

    console.log("✅ Familiarity Data Processed for UI:", familiarityData);
    setFamiliarityData(familiarityData);
  };

  // ✅ Update student data when selecting a student
  const updateStudentData = async (student) => {
    if (!student) return;

    console.log("🎯 Updating student data:", student.fullName);

    // ✅ Fetch updated familiarity data
    await fetchFamiliarityData(student);

    // ✅ Update accuracy data
    setAccuracyData({
      correct: student.accuracy?.correct || 0,
      incorrect: student.accuracy?.incorrect || 0,
    });

    // ✅ Update time spent
    setTimeSpentData({
      timeSpent: student.gameTime?.timeSpent || 0,
      timeLeft: student.gameTime?.timeLeft || 60,
    });

    // ✅ Update attendance
    setAttendanceData(getAttendanceData([student]));
  };

  // Handle edit button press
  const handleEditPress = async () => {
    if (selectedStudent && selectedStudent._id) {
      const token = await AsyncStorage.getItem("authToken");
      const baseUrl =
        Platform.OS === "web"
          ? "http://localhost:5000"
          : "http://10.0.2.2:5000";

      try {
        const response = await fetch(
          `${baseUrl}/api/students/get/${selectedStudent._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok && data.student) {
          const student = data.student;

          // ✅ Now populate edit fields safely
          setEditName(student.fullName || "");
          setEditAge(student.age ? student.age.toString() : "");
          setEditGender(student.gender || "");

          setShowEditModal(true); // ✅ Open modal after data is set
        } else {
          Alert.alert("Error", data.message || "Failed to load student data.");
        }
      } catch (error) {
        console.log("❌ Error fetching student for editing:", error);
      }
    }
    setMenuOpenStudentId(null);
  };

  // Handle delete button press
  const handleDeletePress = () => {
    setShowDeleteModal(true); // ✅ Opens the confirmation modal
  };

  // Handle update button press
  const handleUpdate = async () => {
    if (!selectedStudent) return;

    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.log("❌ No token found, user might be logged out.");
        return;
      }

      console.log(`🔄 Updating student: ${selectedStudent._id}`);

      const baseUrl =
        Platform.OS === "web"
          ? "http://localhost:5000"
          : "http://10.0.2.2:5000";

      const response = await fetch(
        `${baseUrl}/api/students/edit/${selectedStudent._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName: editName.trim(),
            age: parseInt(editAge, 10),
            gender: editGender.trim(),
          }),
        }
      );

      const text = await response.text();
      console.log("🔹 Raw Update Response:", text);

      const data = JSON.parse(text);
      if (response.ok) {
        console.log("✅ Student updated successfully:", data);

        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student._id === selectedStudent._id
              ? {
                  ...student,
                  fullName: editName,
                  age: editAge,
                  gender: editGender,
                }
              : student
          )
        );

        setSelectedStudent((prev) => ({
          ...prev,
          fullName: editName,
          age: editAge,
          gender: editGender,
        }));

        // ✅ Update attendance when the student plays a game
        // await updateAttendance(selectedStudent._id);
      } else {
        console.log("❌ Error updating student:", data.message);
      }
    } catch (error) {
      console.log("❌ Network error updating student:", error);
    }

    setShowEditModal(false);
  };

  // Handle cancel button press
  const handleCancel = () => {
    setShowEditModal(false);
  };

  // Handle delete confirmation
  const handleDelete = async () => {
    if (!selectedStudent) {
      console.log("❌ No student selected.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.log("❌ No token found, user might be logged out.");
        return;
      }

      console.log(`🗑️ Attempting to delete student: ${selectedStudent._id}`);

      // ✅ Send DELETE request to backend
      const baseUrl =
        Platform.OS === "web"
          ? "http://localhost:5000"
          : "http://10.0.2.2:5000";

      const response = await fetch(
        `${baseUrl}/api/students/delete/${selectedStudent._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const text = await response.text();
      console.log("🔹 Raw Delete Response:", text); // ✅ Log backend response

      try {
        const data = JSON.parse(text);
        if (response.ok) {
          console.log("✅ Student deleted successfully:", data);

          // ✅ Remove student from state
          setStudents((prevStudents) => {
            const updatedStudents = prevStudents.filter(
              (student) => student._id !== selectedStudent._id
            );

            // ✅ Auto-select the first student in the updated list (if any)
            setSelectedStudent(
              updatedStudents.length > 0 ? updatedStudents[0] : null
            );

            return updatedStudents;
          });
        } else {
          console.log("❌ Error deleting student:", data.message);
        }
      } catch (jsonError) {
        console.log("❌ JSON Parsing Error:", jsonError, "Response:", text);
      }
    } catch (error) {
      console.log("❌ Network error deleting student:", error);
    }

    setShowDeleteModal(false); // ✅ Close delete modal
  };

  // Handle delete cancellation
  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      console.log(`🔄 Student changed: ${selectedStudent.fullName}`);
      fetchStudentDetails(selectedStudent._id);
    }
  }, [selectedStudent]);

  return (
    <View style={styles.container}>
      {/* Edit Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showEditModal}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Profile Image */}
            <TouchableOpacity style={styles.profileImageContainer}>
              <Image
                source={require("../../../assets/default-student.png")}
                style={styles.modalProfileImage}
              />
              <Text style={styles.uploadText}>Upload picture</Text>
            </TouchableOpacity>

            {/* Student Name Input */}
            <View style={styles.inputContainer}>
              <Image
                source={require("../../../assets/dashboard/user-icon.png")}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                value={editName}
                onChangeText={setEditName}
                placeholder="Student Name"
              />
            </View>

            {/* Age & Gender Inputs */}
            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, styles.halfInput]}>
                <Image
                  source={require("../../../assets/dashboard/age-icon.png")}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  value={editAge}
                  onChangeText={setEditAge}
                  keyboardType="numeric"
                  placeholder="Age"
                />
              </View>
              <View style={[styles.inputContainer, styles.halfInput]}>
                <Image
                  source={require("../../../assets/dashboard/gender-icon.png")}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  value={editGender}
                  onChangeText={setEditGender}
                  placeholder="Sex"
                />
              </View>
            </View>

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.editUpdateButton}
                onPress={handleUpdate}
              >
                <Image
                  source={require("../../../assets/dashboard/Update.png")}
                  style={styles.editButtonImage}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editCancelButton}
                onPress={handleCancel}
              >
                <Image
                  source={require("../../../assets/dashboard/Cancel.png")}
                  style={styles.editButtonImage}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModalContainer}>
            <Text style={styles.warningTitle}>Warning!</Text>
            <Text style={styles.warningText}>
              Are you sure you want to delete {selectedStudent?.fullName}?
            </Text>

            <View style={styles.deleteButtonRow}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Image
                  source={require("../../../assets/dashboard/Delete.png")}
                  style={styles.deleteButtonImage}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteCancelButton}
                onPress={() => setShowDeleteModal(false)}
              >
                <Image
                  source={require("../../../assets/dashboard/Cancel.png")}
                  style={styles.deleteButtonImage}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Left Sidebar */}
      <View style={styles.sidebar}>
        <TouchableOpacity onPress={() => navigation.navigate("StudentProfile")}>
          <Image
            style={styles.backButton}
            source={require("../../../assets/dashboard/Back.png")}
          />
        </TouchableOpacity>

        {/* Sidebar Menu Options */}
        <View style={styles.sidebarMenu}>
          <TouchableOpacity>
            <Image
              style={styles.studentButton}
              source={require("../../../assets/dashboard/Dashboard.png")}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("AccountSettings")}
          >
            <Image
              style={styles.accountButton}
              source={require("../../../assets/dashboard/account-setting.png")}
            />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity onPress={handleLogout}>
          <Image
            style={styles.logoutButton}
            source={require("../../../assets/dashboard/Logout.png")}
          />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.mainContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../../assets/dashboard/Husay.png")}
              style={styles.logo}
            />
          </View>

          {/* Teacher Name */}
          {/* ✅ Display logged-in teacher's name */}
          <View style={styles.userContainer}>
            <Text style={styles.greeting}>Hello, {fullName}!</Text>
            <Image
              source={require("../../../assets/default-profile.png")}
              style={styles.profilePic}
            />
          </View>
        </View>

        {/* Student Name and Menu Button Container */}
        <View style={styles.studentNameAndMenuContainer}>
          {/* Student Name Button */}
          <TouchableOpacity
            onPress={() => setStudentDropdownOpen(!studentDropdownOpen)}
            style={styles.studentNameButton}
          >
            <Image
              source={
                studentDropdownOpen
                  ? require("../../../assets/dashboard/arrow-up.png")
                  : require("../../../assets/dashboard/arrow-down.png")
              }
              style={styles.dropdownIcon}
            />
            <Text style={styles.studentName}>
              {selectedStudent ? selectedStudent.fullName : "Select Student"}
            </Text>
          </TouchableOpacity>

          {/* Student Dropdown List */}
          {studentDropdownOpen && (
            <View style={styles.studentDropdownMenu}>
              <ScrollView
                style={{ maxHeight: 200 }} // 👈 Adjust height as needed
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
              >
                {students.length > 0 ? (
                  students.map((student) => (
                    <TouchableOpacity
                      key={student._id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedStudent(student);
                        setStudentDropdownOpen(false);
                        setMenuOpenStudentId(null);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>
                        {student.fullName}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.noStudentText}>No students found</Text>
                )}
              </ScrollView>
            </View>
          )}

          {/* Menu Button with Dropdown (Only for Selected Student) */}

          <View style={styles.menuContainer}>
            <TouchableOpacity
              onPress={() => {
                if (!selectedStudent) {
                  Alert.alert(
                    "No student selected",
                    "Please add a student first."
                  );
                  return;
                }
                setMenuOpenStudentId(
                  menuOpenStudentId === selectedStudent._id
                    ? null
                    : selectedStudent._id
                );
              }}
            >
              <Image
                source={
                  selectedStudent && menuOpenStudentId === selectedStudent._id
                    ? require("../../../assets/dashboard/Close.png")
                    : require("../../../assets/dashboard/menu.png")
                }
                style={styles.menuIcon}
              />
            </TouchableOpacity>
            {/* Edit/Delete Menu */}
            {selectedStudent && menuOpenStudentId === selectedStudent._id && (
              <View style={styles.dropdownMenu}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={handleEditPress}
                >
                  <Text style={styles.dropdownItemText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.dropdownItem, styles.lastDropdownItem]}
                  onPress={handleDeletePress}
                >
                  <Text style={styles.dropdownItemText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Attendance Container */}
        <View style={styles.sectionContainer}>
          <View style={styles.attendanceHeader}>
            <Text style={styles.sectionTitle}>Attendance</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                style={styles.paginationButton}
                onPress={handlePrevQuarter}
              >
                <Text style={styles.paginationButtonText}>◀︎</Text>
              </TouchableOpacity>
              <Text style={styles.quarterLabel}>
                Q{currentQuarter} {currentYear}
              </Text>
              <TouchableOpacity
                style={styles.paginationButton}
                onPress={handleNextQuarter}
              >
                <Text style={styles.paginationButtonText}>▶︎</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.calendarContainer}>
            {quarters[currentQuarter].map((month) => {
              const firstDayOfMonth = moment(
                `${currentYear}-${month + 1}-01`,
                "YYYY-MM-DD"
              ).day();
              const daysInMonth = moment(
                `${currentYear}-${month + 1}`,
                "YYYY-MM"
              ).daysInMonth();

              // Generate empty slots before the first day of the month
              const blanks = Array.from(
                { length: firstDayOfMonth },
                (_, i) => ({
                  key: `empty-${month}-${i}`,
                  day: null,
                })
              );

              // Generate the array of day objects
              const daysArray = Array.from({ length: daysInMonth }, (_, i) => ({
                key: `day-${month}-${i + 1}`,
                day: i + 1,
                // 1) Grab status from attendanceData for THIS month & day
                status: attendanceData[month]
                  ? attendanceData[month][i] // i == day - 1
                  : "", // fallback
              }));

              // Combine empty slots + days
              const totalSlots = [...blanks, ...daysArray];

              // Split into rows of 7 days each
              const rows = [];
              let currentWeek = [];
              totalSlots.forEach((item, index) => {
                currentWeek.push(item);
                if ((index + 1) % 7 === 0) {
                  rows.push(currentWeek);
                  currentWeek = [];
                }
              });

              // Fill the last row if it has fewer than 7 slots
              if (currentWeek.length > 0) {
                const missingDays = 7 - currentWeek.length;
                for (let i = 0; i < missingDays; i++) {
                  currentWeek.push({
                    key: `empty-${month}-extra-${i}`,
                    day: null,
                  });
                }
                rows.push(currentWeek);
              }

              return (
                <View key={`month-${month}`} style={styles.monthContainer}>
                  <Text style={styles.monthTitle}>
                    {moment(month + 1, "M").format("MMMM")}
                  </Text>

                  {/* Weekday Labels */}
                  <View style={styles.weekdaysContainer}>
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (d) => (
                        <Text
                          key={`label-${month}-${d}`}
                          style={styles.weekdayLabel}
                        >
                          {d}
                        </Text>
                      )
                    )}
                  </View>

                  {/* Days Grid */}
                  {rows.map((row, rowIndex) => (
                    <View
                      key={`row-${month}-${rowIndex}`}
                      style={styles.weekRow}
                    >
                      {row.map(({ key, day, status }) => {
                        return day ? (
                          renderDay(day, status, month, currentYear)
                        ) : (
                          <View
                            key={key}
                            style={[
                              styles.dayItem,
                              { backgroundColor: "transparent" },
                            ]}
                          />
                        );
                      })}
                    </View>
                  ))}
                </View>
              );
            })}
          </View>

          {/* Legend at Bottom-left */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: "#4CD964" }]}
              />
              <Text style={styles.legendText}>Present</Text>
            </View>

            <View style={[styles.legendItem, { marginLeft: 20 }]}>
              <View
                style={[styles.legendColor, { backgroundColor: "#FF3B30" }]}
              />
              <Text style={styles.legendText}>Absent</Text>
            </View>
          </View>
        </View>

        {/* Charts Section */}
        <View style={styles.chartsContainer}>
          {/* Shape Familiarity Chart */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Shape Familiarity</Text>
            <View style={styles.shapeChart}>
              <View style={styles.chartBarsContainer}>
                {Object.entries(
                  familiarityData?.Shapes || {
                    Square: 0,
                    Triangle: 0,
                    Circle: 0,
                    Rectangle: 0,
                  }
                ).map(([label, percentage], index) => (
                  <View key={`shape-${index}`} style={styles.chartBarGroup}>
                    <Text style={styles.percentageLabel}>{percentage}%</Text>
                    <View
                      style={[
                        styles.chartBar,
                        {
                          height: Math.max(percentage * 1.2, 5),
                          backgroundColor: "#FF3B30",
                        },
                      ]}
                    />
                    <Text style={styles.chartLabel}>{label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Color Familiarity Chart */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Color Familiarity</Text>
            <View style={styles.colorChart}>
              <View style={styles.chartBarsContainer}>
                {Object.entries(
                  familiarityData?.Colors || {
                    Red: 0,
                    Yellow: 0,
                    Blue: 0,
                    Green: 0,
                    Black: 0,
                    Gray: 0,
                    White: 0,
                  }
                ).map(([label, percentage], index) => (
                  <View key={`color-${index}`} style={styles.chartBarGroup}>
                    <Text style={styles.percentageLabel}>{percentage}%</Text>
                    <View
                      style={[
                        styles.chartBar,
                        {
                          height: Math.max(percentage * 1.2, 5),
                          backgroundColor: "#5A8EF4",
                        },
                      ]}
                    />
                    <Text style={styles.chartLabel}>{label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Number Familiarity Chart */}
          <View style={[styles.chartCard, styles.fullWidthChart]}>
            <Text style={styles.chartTitle}>Number Familiarity</Text>
            <View style={styles.numberChart}>
              <View style={styles.chartBarsContainer}>
                {Object.entries(
                  familiarityData?.Numbers || {
                    "One (1)": 0,
                    "Two (2)": 0,
                    "Three (3)": 0,
                    "Four (4)": 0,
                    "Five (5)": 0,
                    "Six (6)": 0,
                    "Seven (7)": 0,
                    "Eight (8)": 0,
                    "Nine (9)": 0,
                    "Ten (10)": 0,
                  }
                ).map(([label, percentage], index) => (
                  <View key={`number-${index}`} style={styles.chartBarGroup}>
                    <Text style={styles.percentageLabel}>{percentage}%</Text>
                    <View
                      style={[
                        styles.chartBar,
                        {
                          height: Math.max(percentage * 1.2, 5),
                          backgroundColor: "#4CAF50",
                        },
                      ]}
                    />
                    <Text style={styles.chartLabel}>{label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Accuracy and Time Spent Pie Chart */}
          <View style={styles.accuracyTimeContainer}>
            {/* Accuracy Pie Chart */}
            <View style={styles.pieChartContainer}>
              <Text style={styles.chartTitle}>Accuracy</Text>
              <PieChart
                style={{ height: 250 }}
                valueAccessor={({ item }) => item.value}
                data={
                  accuracyData.correct === 0 && accuracyData.incorrect === 0
                    ? [
                        {
                          key: 1,
                          value: 1,
                          label: "No Data",
                          svg: { fill: "#D3D3D3" },
                        }, // Gray placeholder
                      ]
                    : accuracyData.incorrect > 0 && accuracyData.correct === 0
                    ? [
                        {
                          key: 1,
                          value: accuracyData.incorrect,
                          label: `${accuracyData.incorrect}`,
                          svg: { fill: "#FF3B30" },
                        },
                      ]
                    : accuracyData.correct > 0 && accuracyData.incorrect === 0
                    ? [
                        {
                          key: 2,
                          value: accuracyData.correct,
                          label: `${accuracyData.correct}`,
                          svg: { fill: "#4CD964" },
                        },
                      ]
                    : [
                        {
                          key: 1,
                          value: accuracyData.correct,
                          label: `${accuracyData.correct}`,
                          svg: { fill: "#4CD964" },
                        },
                        {
                          key: 2,
                          value: accuracyData.incorrect,
                          label: `${accuracyData.incorrect}`,
                          svg: { fill: "#FF3B30" },
                        },
                      ]
                }
                spacing={0}
                outerRadius={"100%"}
              >
                <LabelsPie />
              </PieChart>

              <View style={styles.legend}>
                <View style={[styles.legendItem, { marginTop: 15 }]}>
                  <View
                    style={[styles.legendColor, { backgroundColor: "#4CD964" }]}
                  />
                  <Text style={styles.legendText}>Correct</Text>
                </View>
                <View
                  style={[styles.legendItem, { marginLeft: 15, marginTop: 15 }]}
                >
                  <View
                    style={[styles.legendColor, { backgroundColor: "#FF3B30" }]}
                  />
                  <Text style={styles.legendText}>Incorrect</Text>
                </View>
              </View>
            </View>

            {/* Time Spent Pie Chart */}
            <View style={styles.pieChartContainer}>
              <Text style={styles.chartTitle}>Time Spent (Today)</Text>
              <PieChart
                style={{ height: 250 }}
                valueAccessor={({ item }) => item.value}
                data={[
                  ...(timeSpentData.timeSpent > 0
                    ? [
                        {
                          key: 1,
                          value: timeSpentData.timeSpent,
                          label: `${timeSpentData.timeSpent} mins`,
                          svg: { fill: timeSpentData.timeSpentColor },
                        },
                      ]
                    : []),
                  ...(timeSpentData.timeLeft > 0
                    ? [
                        {
                          key: 2,
                          value: timeSpentData.timeLeft,
                          label: `${timeSpentData.timeLeft} mins`,
                          svg: { fill: timeSpentData.timeLeftColor },
                        },
                      ]
                    : []),
                ]}
                spacing={0}
                outerRadius={"100%"}
              >
                <LabelsPie />
              </PieChart>

              <View style={styles.legend}>
                <View style={[styles.legendItem, { marginTop: 15 }]}>
                  <View
                    style={[styles.legendColor, { backgroundColor: "#4CD964" }]}
                  />
                  <Text style={styles.legendText}>Left</Text>
                </View>
                <View
                  style={[styles.legendItem, { marginLeft: 15, marginTop: 15 }]}
                >
                  <View
                    style={[styles.legendColor, { backgroundColor: "#FF3B30" }]}
                  />
                  <Text style={styles.legendText}>Spent</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.copyright}>
            © 2024 Husay. All Rights Reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F2F2F7",
  },
  sidebar: {
    width: 300,
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRightWidth: 1,
    borderRightColor: "#E5E5EA",
    justifyContent: "space-between",
    height: "100%",
  },
  sidebarMenu: {
    flex: 1,
    marginTop: 45,
    marginLeft: 15,
  },
  backButton: {
    marginTop: 45,
    marginLeft: 15,
  },
  studentButton: {
    width: 250,
    height: 65,
    resizeMode: "contain",
  },
  accountButton: {
    width: 250,
    height: 65,
    resizeMode: "contain",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 25,
    marginLeft: 15,
  },
  mainContent: {
    flex: 1,
    padding: 45,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 35,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 35,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "500",
    marginRight: 10,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: "#007AFF",
  },
  studentNameAndMenuContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  studentNameButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5A8EF4",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
  },
  dropdownIcon: {
    width: 16,
    height: 16,
    tintColor: "#FFFFFF",
    marginRight: 10,
  },
  studentName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  studentDropdownMenu: {
    position: "absolute",
    top: 0,
    left: "18%",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 200,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  menuContainer: {
    position: "relative",
  },
  menuIcon: {
    width: 45,
    height: 45,
  },
  dropdownMenu: {
    position: "absolute",
    top: 0,
    right: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 150,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  dropdownItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  lastDropdownItem: {
    borderBottomWidth: 0,
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#1E1E1E",
    textAlign: "center",
  },

  sectionContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },

  //Attendance Container Style
  attendanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  quarterLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 10,
  },

  paginationButton: {
    paddingHorizontal: 10,
  },

  paginationButtonText: {
    fontSize: 18,
    color: "#000",
  },

  calendarContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  monthContainer: {
    flex: 1,
    marginHorizontal: 10,
  },

  monthTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },

  weekdaysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },

  weekdayLabel: {
    fontSize: 12,
    color: "#8E8E93",
    textAlign: "center",
    flex: 1,
  },

  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  dayItem: {
    width: 30,
    height: 30,
    borderRadius: 4,
    margin: 2,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2, // ✅ Ensures proper distinction
    borderColor: "white", // ✅ Gives a clearer edge
  },

  dayText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold", // ✅ Makes it more visible
  },

  legend: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    alignSelf: "center",
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },

  legendColor: {
    width: 15,
    height: 15,
    borderRadius: 4,
    marginRight: 5,
  },

  legendText: {
    fontSize: 14,
    color: "#1E1E1E",
    textAlign: "center",
  },
  // End

  chartsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  percentageLabel: {
    fontSize: 12,
    color: "#000",
    marginBottom: 4,
  },
  chartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    width: "49%",
  },
  fullWidthChart: {
    width: "100%",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  shapeChart: {
    height: 150,
  },
  colorChart: {
    height: 150,
  },
  numberChart: {
    height: 150,
  },
  chartBarsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: "100%",
  },
  chartBarGroup: {
    alignItems: "center",
  },
  chartBar: {
    width: 30,
    borderRadius: 4,
    marginBottom: 5,
  },
  timeBar: {
    width: 40,
    borderRadius: 4,
    marginBottom: 5,
  },
  chartLabel: {
    fontSize: 10,
    color: "#8E8E93",
  },
  accuracyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  timeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  todayButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  upArrowIcon: {
    width: 12,
    height: 12,
    tintColor: "#8E8E93",
    marginRight: 5,
  },
  todayText: {
    fontSize: 14,
    color: "#8E8E93",
  },
  accuracyChart: {
    height: 200,
  },
  timeChart: {
    height: 200,
  },
  areaChart: {
    flex: 1,
  },
  areaChartPlaceholder: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
  },
  accuracyLegend: {
    flexDirection: "row",
    marginTop: 10,
  },
  timeLegend: {
    flexDirection: "row",
    marginTop: 0,
  },
  accuracyTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    width: "100%",
  },
  pieChartContainer: {
    width: "49%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
  },
  footer: {
    marginTop: 0,
    marginBottom: 75,
    alignItems: "flex-end",
  },
  copyright: {
    fontSize: 12,
    color: "#1E1E1E",
  },

  /* Edit Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 35,
    paddingLeft: 100,
    paddingRight: 100,
    width: "50%",
    alignItems: "center",
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  modalProfileImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: "#4D7AFF",
    marginBottom: 10,
  },
  uploadText: {
    fontSize: 16,
    color: "#333",
    marginTop: 5,
    marginBottom: 25,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 25,
    width: "100%",
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  halfInput: {
    width: "48%",
  },
  inputIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  editUpdateButton: {
    width: "48%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  editCancelButton: {
    width: "48%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  editButtonImage: {
    resizeMode: "contain",
    width: "100%",
    height: 80,
  },

  /* Delete Modal Styles */
  deleteModalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 30,
    width: "40%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  warningTitle: {
    fontSize: 35,
    fontWeight: "600",
    marginBottom: 15,
    color: "#1E1E1E",
  },
  warningText: {
    fontSize: 20,
    color: "#1E1E1E",
    marginBottom: 15,
    textAlign: "center",
  },
  deleteButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
  },
  deleteButton: {
    paddingVertical: 5,
    paddingHorizontal: 30,
    width: "45%",
    alignItems: "center",
  },
  deleteCancelButton: {
    paddingVertical: 5,
    paddingHorizontal: 30,
    width: "45%",
    alignItems: "center",
  },
  deleteButtonImage: {
    resizeMode: "contain",
    width: "150%",
    height: 75,
  },
});
