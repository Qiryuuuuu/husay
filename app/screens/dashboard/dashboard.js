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
} from "react-native";
import { PieChart } from 'react-native-svg-charts';
import { Text as SVGText } from 'react-native-svg';
import AsyncStorage from "@react-native-async-storage/async-storage";

import moment from 'moment';

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
  const [modeOpen, setModeOpen] = useState(false);
  const [difficultyOpen, setDifficultyOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editName, setEditName] = useState("Harry Potter");
  const [editAge, setEditAge] = useState("3");
  const [editGender, setEditGender] = useState("Male");
  const [timeRange, setTimeRange] = useState("Today");
  

  const [currentQuarter, setCurrentQuarter] = useState(1);
  const [currentYear, setCurrentYear] = useState(moment().year());

  // ✅ Fetch User Data
  const fetchUser = async () => {
    try {
      console.log("🔍 Fetching user data...");
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("❌ No token found, user might be logged out.");
        setLoading(false);
        return;
      }
  
      const response = await fetch("http://10.0.2.2:5000/api/auth/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      console.log("🔹 User Data:", data);
  
      if (response.ok && data != null) {
        setFullName(data.fullName || "User");
        setEmployeeNo(data.employeeNo); // ✅ Store employee number
        fetchClassData(data.employeeNo); // ✅ Fetch students from class
      } else {
        console.error("❌ Error fetching user:", data.message);
      }
    } catch (error) {
      console.error("❌ Network error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };
  
  //✅ Fetch Class Data
  const fetchClassData = async (employeeNo) => {
    try {
      if (!employeeNo) {
        console.error("❌ Employee number not found. Cannot fetch class.");
        return;
      }
  
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("❌ No token found, user might be logged out.");
        return;
      }
  
      console.log(`🔍 Fetching class data for employeeNo: ${employeeNo}...`);
  
      const response = await fetch(
        `http://10.0.2.2:5000/api/class/get-students?employeeNo=${employeeNo}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
  
      const data = await response.json();
      console.log("🔹 Class API Response:", data);
  
      if (response.ok && data.students.length > 0) {
        setStudents(data.students);
        setSelectedStudent(data.students[0]); // ✅ Set default student
      } else {
        console.error("❌ No students found:", data.message);
        setStudents([]); // ✅ Ensure students is an empty array if no data is returned
      }
    } catch (error) {
      console.error("❌ Server error fetching students:", error);
    }
  };      

  // ✅ Fetch Students
  const fetchStudents = async (employeeNo) => {
    try {
      console.log("🔍 Fetching students for employeeNo:", employeeNo);
  
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("❌ No token found, user might be logged out.");
        return;
      }
  
      const response = await fetch(
        `http://10.0.2.2:5000/api/students/all?employeeNo=${employeeNo}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
  
      const data = await response.json();
      console.log("🔹 Raw Student API Response:", JSON.stringify(data, null, 2));
  
      if (response.ok && data.students && data.students.length > 0) {
        setStudents(data.students);
        console.log("✅ Students set successfully:", data.students);
      } else {
        console.error("❌ No students found or API returned an error.");
      }
    } catch (error) {
      console.error("❌ Server error fetching students:", error);
    }
  };
  
  //✅ Fetch Student Details
  const fetchStudentDetails = async (studentIds) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("❌ No token found. Cannot fetch student details.");
        return;
      }
  
      console.log("🔍 Fetching student details...");
      const response = await fetch(`http://10.0.2.2:5000/api/students/getMultiple`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ studentIds }),
      });
  
      const data = await response.json();
      console.log("🔹 Student Data:", data);
  
      if (response.ok && data.students.length > 0) {
        setStudents(data.students);
        setSelectedStudent(data.students[0]); // ✅ Default to first student
      } else {
        console.error("❌ No students found:", data.message);
      }
    } catch (error) {
      console.error("❌ Network error fetching student details:", error);
    }
  };
  
  useEffect(() => {
    fetchUser();
  }, []);  

  //Logout
  const handleLogout = async () => {
    try {
      // Remove authentication token from storage
      await AsyncStorage.removeItem("authToken");
  
      // Show alert confirmation and navigate to login
      Alert.alert("Logged Out", "You have been logged out.", [
        { text: "OK", onPress: () => navigation.replace("Login") }
      ]);
  
      console.log("✅ User successfully logged out.");
    } catch (error) {
      console.error("❌ Error logging out:", error);
    }
  };

  // Sample data generator for demonstration
  const getAttendanceData = (students) => {
    if (!students || students.length === 0) {
      console.error("❌ getAttendanceData() received empty students array.");
      return {};
    }
  
    console.log("🔹 Processing attendance for students:", students);
  
    const data = {};
  
    students.forEach((student) => {
      if (!student.attendance || !Array.isArray(student.attendance)) {
        console.warn(`⚠️ Student ${student.fullName} has no attendance record.`);
        return {};
      }
  
      student.attendance.forEach(({ date, status }) => {
        if (!date) {
          console.warn(`⚠️ Skipping record with missing date for ${student.fullName}`);
          return;
        }
  
        const month = new Date(date).getMonth();
        const day = new Date(date).getDate() - 1;
  
        if (!data[month]) {
          const daysInMonth = moment(`${currentYear}-${month + 1}`, "YYYY-MM").daysInMonth();
          data[month] = Array(daysInMonth).fill("");
        }
  
        data[month][day] = status ? status.toLowerCase() : "";
      });
    });
  
    console.log("✅ Final attendanceData:", JSON.stringify(data, null, 2));
    return data;
  };
  
  // ✅ Get real attendance data from the backend
  const attendanceData = students && students.length > 0 ? getAttendanceData(students) : {};

  // Quarter handling logic
  const quarters = {
    1: [0, 1, 2],    // Jan-Mar
    2: [3, 4, 5],    // Apr-Jun
    3: [6, 7, 8],    // Jul-Sep
    4: [9, 10, 11],  // Oct-Dec
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
  const renderDay = (day, status, month, year) => {
    // If no status, default to white
    if (!status) {
      return (
        <View key={`no-status-${month}-${day}`} style={[styles.dayItem, { backgroundColor: '#FFFFFF' }]}>
          <Text style={styles.dayText}>{day}</Text>
        </View>
      );
    }
  
    const today = moment();
    const currentDay = moment(`${year}-${month + 1}-${day}`, "YYYY-MM-DD");
    const isToday = currentDay.isSame(today, "day");
    const isFuture = currentDay.isAfter(today, "day");
    const weekday = currentDay.day();
  
    let backgroundColor;
    if (isFuture || weekday === 0 || weekday === 6) {
      backgroundColor = "#D3D3D3"; // light gray for weekends/future days
    } else if (status === "present") {
      backgroundColor = "#4CD964"; // green
    } else if (status === "absent") {
      backgroundColor = "#FF3B30"; // red
    } else {
      backgroundColor = "#FFFFFF"; // default white
    }
  
    return (
      <View
        key={`${year}-${month}-${day}`}
        style={[
          styles.dayItem,
          { backgroundColor },
          isToday && { borderWidth: 2, borderColor: "#007AFF" },
        ]}
      >
        <Text style={styles.dayText}>{day}</Text>
      </View>
    );
  };        
  
  //Pie Chart
  const LabelsPie = ({ slices }) => {
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
    setMenuOpen(!menuOpen);
    // Close other dropdowns when opening menu
    if (!menuOpen) {
      setModeOpen(false);
      setDifficultyOpen(false);
    }
  };

  // Toggle mode dropdown function
  const toggleMode = () => {
    // Close difficulty dropdown if it's open
    if (difficultyOpen) {
      setDifficultyOpen(false);
    }

    // Toggle mode dropdown
    setModeOpen(!modeOpen);

    // Close menu if opening mode dropdown
    if (!modeOpen) {
      setMenuOpen(false);
    }
  };

  // Toggle difficulty dropdown function
  const toggleDifficulty = () => {
    // Close mode dropdown if it's open
    if (modeOpen) {
      setModeOpen(false);
    }

    // Toggle difficulty dropdown
    setDifficultyOpen(!difficultyOpen);

    // Close menu if opening difficulty dropdown
    if (!difficultyOpen) {
      setMenuOpen(false);
    }
  };

  // Toggle Student Dropdown
  const toggleStudentDropdown = () => {
    setStudentDropdownOpen(!studentDropdownOpen);
    if (!studentDropdownOpen) {
      setModeOpen(false);
      setDifficultyOpen(false);
      setMenuOpen(false);
    }
  };

  // Select Student from Dropdown
  const selectStudent = (student) => {
    setSelectedStudent(student);
    setStudentDropdownOpen(false);
    setMenuOpen(false);
  };
  
  // Handle edit button press
  const handleEditPress = () => {
    if (selectedStudent) {
      setEditName(selectedStudent.fullName || "");
      setEditAge(selectedStudent.age ? selectedStudent.age.toString() : "");
      setEditGender(selectedStudent.gender || "");
    }
    setShowEditModal(true);
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
        console.error("❌ No token found, user might be logged out.");
        return;
      }
  
      console.log(`🔄 Updating student: ${selectedStudent._id}`);
  
      const response = await fetch(
        `http://10.0.2.2:5000/api/students/edit/${selectedStudent._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
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
              ? { ...student, fullName: editName, age: editAge, gender: editGender }
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
        console.error("❌ Error updating student:", data.message);
      }
    } catch (error) {
      console.error("❌ Network error updating student:", error);
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
      console.error("❌ No student selected.");
      return;
    }
  
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("❌ No token found, user might be logged out.");
        return;
      }
  
      console.log(`🗑️ Attempting to delete student: ${selectedStudent._id}`);
  
      // ✅ Send DELETE request to backend
      const response = await fetch(
        `http://10.0.2.2:5000/api/students/delete/${selectedStudent._id}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
  
      const text = await response.text();
      console.log("🔹 Raw Delete Response:", text); // ✅ Log backend response
  
      try {
        const data = JSON.parse(text);
        if (response.ok) {
          console.log("✅ Student deleted successfully:", data);
  
          // ✅ Remove student from frontend state
          setStudents((prevStudents) =>
            prevStudents.filter((student) => student._id !== selectedStudent._id)
          );
  
          // ✅ Clear selected student
          setSelectedStudent(null);
        } else {
          console.error("❌ Error deleting student:", data.message);
        }
      } catch (jsonError) {
        console.error("❌ JSON Parsing Error:", jsonError, "Response:", text);
      }
    } catch (error) {
      console.error("❌ Network error deleting student:", error);
    }
  
    setShowDeleteModal(false); // ✅ Close delete modal
  };
  
  
  // Handle delete cancellation
  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };
  
  

  // Sample data for time chart
  const timeData = [
    { time: "9 AM", duration: 25 },
    { time: "10 AM", duration: 40 },
    { time: "11 AM", duration: 15 },
    { time: "12 PM", duration: 30 },
    { time: "1 PM", duration: 45 },
    { time: "2 PM", duration: 20 },
    { time: "3 PM", duration: 35 },
  ];

  // Render attendance grid item
  const renderAttendanceItem = (gamesPlayed) => {
    let backgroundColor;
    if (gamesPlayed > 0) {
      backgroundColor = "#4CD964"; // ✅ Green = Present
    } else {
      backgroundColor = "#FF3B30"; // ❌ Red = Absent
    }
  
    return <View style={[styles.attendanceItem, { backgroundColor }]} />;
  };
  

  // Toggle time range dropdown
  const toggleTimeRange = () => {
    // Implementation for time range dropdown
  };

  return (
    <View style={styles.container}>
      {/* Edit Modal */}
<Modal animationType="fade" transparent={true} visible={showEditModal} onRequestClose={handleCancel}>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      {/* Profile Image */}
      <TouchableOpacity style={styles.profileImageContainer}>
        <Image source={require("../../../assets/default-student.png")} style={styles.modalProfileImage} />
        <Text style={styles.uploadText}>Upload picture</Text>
      </TouchableOpacity>

      {/* Student Name Input */}
      <View style={styles.inputContainer}>
        <Image source={require("../../../assets/dashboard/user-icon.png")} style={styles.inputIcon} />
        <TextInput style={styles.textInput} value={editName} onChangeText={setEditName} placeholder="Student Name" />
      </View>

      {/* Age & Gender Inputs */}
      <View style={styles.inputRow}>
        <View style={[styles.inputContainer, styles.halfInput]}>
          <Image source={require("../../../assets/dashboard/age-icon.png")} style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            value={editAge}
            onChangeText={setEditAge}
            keyboardType="numeric"
            placeholder="Age"
          />
        </View>
        <View style={[styles.inputContainer, styles.halfInput]}>
          <Image source={require("../../../assets/dashboard/gender-icon.png")} style={styles.inputIcon} />
          <TextInput style={styles.textInput} value={editGender} onChangeText={setEditGender} placeholder="Gender" />
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.editUpdateButton} onPress={handleUpdate}>
          <Image source={require("../../../assets/dashboard/Update.png")} style={styles.editButtonImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.editCancelButton} onPress={handleCancel}>
          <Image source={require("../../../assets/dashboard/Cancel.png")} style={styles.editButtonImage} />
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
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Image source={require("../../../assets/dashboard/Delete.png")} style={styles.deleteButtonImage} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteCancelButton} onPress={() => setShowDeleteModal(false)}>
          <Image source={require("../../../assets/dashboard/Cancel.png")} style={styles.deleteButtonImage} />
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
        <TouchableOpacity  onPress={handleLogout}>
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
                <Image source={require('../../../assets/default-profile.png')} style={styles.profilePic} />
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
      {students.length > 0 ? (
        students.map((student) => (
          <TouchableOpacity
  key={student._id}
  style={styles.dropdownItem}
  onPress={() => {
    setSelectedStudent(student); // ✅ Correctly selects student
    setStudentDropdownOpen(false); // ✅ Close dropdown
    setMenuOpenStudentId(null); // ✅ Ensure menu resets when selecting new student
  }}
>
  <Text style={styles.dropdownItemText}>{student.fullName}</Text>
</TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noStudentText}>No students found</Text>
      )}
    </View>
  )}

  {/* Menu Button with Dropdown (Only for Selected Student) */}
{selectedStudent && (
  <View style={styles.menuContainer}>
    <TouchableOpacity
      onPress={() => setMenuOpenStudentId(menuOpenStudentId === selectedStudent._id ? null : selectedStudent._id)}
    >
      <Image
        source={
          menuOpenStudentId === selectedStudent._id
            ? require("../../../assets/dashboard/Close.png") // 'X' when open
            : require("../../../assets/dashboard/menu.png") // Burger menu when closed
        }
        style={styles.menuIcon}
      />
    </TouchableOpacity>

    {/* Edit/Delete Menu */}
    {menuOpenStudentId === selectedStudent._id && (
      <View style={styles.dropdownMenu}>
      <TouchableOpacity style={styles.dropdownItem} onPress={handleEditPress}>
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
)}
</View>

        {/* Attendance Container */}
        <View style={styles.sectionContainer}>
          <View style={styles.attendanceHeader}>
            <Text style={styles.sectionTitle}>Attendance</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity style={styles.paginationButton} onPress={handlePrevQuarter}>
                <Text style={styles.paginationButtonText}>◀︎</Text>
              </TouchableOpacity>
              <Text style={styles.quarterLabel}>Q{currentQuarter} {currentYear}</Text>
              <TouchableOpacity style={styles.paginationButton} onPress={handleNextQuarter}>
                <Text style={styles.paginationButtonText}>▶︎</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.calendarContainer}>
            {quarters[currentQuarter].map((month) => {
              const firstDayOfMonth = moment(`${currentYear}-${month + 1}-01`, 'YYYY-MM-DD').day();
              const daysInMonth = moment(`${currentYear}-${month + 1}`, 'YYYY-MM').daysInMonth();

              // Generate empty slots before the first day of the month
              const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => ({
                key: `empty-${month}-${i}`,  // Unique key for each empty slot before the month starts
                day: null
              }));

              // Generate actual days with attendance status
              const daysArray = Array.from({ length: daysInMonth }, (_, i) => ({
                key: `day-${month}-${i+1}`,
                day: i+1,
                status: attendanceData[month] 
                  ? attendanceData[month][i]  // e.g. "present", "absent", ""
                  : ""  // fallback if month isn't in attendanceData
              }));

              // Combine empty slots and days into one array
              const totalSlots = [...blanks, ...daysArray];

              // Ensure every row has exactly 7 elements
              const rows = [];
              let currentWeek = [];

              totalSlots.forEach((item, index) => {
                currentWeek.push(item);
                if ((index + 1) % 7 === 0) {
                  rows.push(currentWeek);
                  currentWeek = [];
                }
              });

              // Push the remaining days in the last row
              if (currentWeek.length > 0) {
                const missingDays = 7 - currentWeek.length;
                for (let i = 0; i < missingDays; i++) {
                  currentWeek.push({ key: `empty-${month}-extra-${i}`, day: null }); // Ensure unique keys for extra empty slots
                }
                rows.push(currentWeek);
              }

              return (
                <View key={`month-${month}`} style={styles.monthContainer}>
                  <Text style={styles.monthTitle}>{moment(month + 1, 'M').format('MMMM')}</Text>

                  {/* Weekday Labels */}
                  <View style={styles.weekdaysContainer}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <Text key={`label-${month}-${day}`} style={styles.weekdayLabel}>{day}</Text>
                    ))}
                  </View>

                  {/* Days Grid (Fixed to always display 7 per row) */}
                  {rows.map((row, rowIndex) => (
                    <View key={`row-${month}-${rowIndex}`} style={styles.weekRow}>
                      {row.map(({ key, day, status }) => {
                        return day
                          ? renderDay(day, status, month, currentYear)
                          : (
                            <View key={key} style={[styles.dayItem, { backgroundColor: 'transparent' }]} />
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
              <View style={[styles.legendColor, { backgroundColor: '#4CD964' }]} />
              <Text style={styles.legendText}>Present</Text>
            </View>

            <View style={[styles.legendItem, { marginLeft: 20 }]}>
              <View style={[styles.legendColor, { backgroundColor: '#FF3B30' }]} />
              <Text style={styles.legendText}>Absent</Text>
            </View>
          </View>
        </View>


        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          {/* Mode Button with Dropdown */}
          <View style={styles.modeContainer}>
            <TouchableOpacity onPress={toggleMode} style={styles.modeButton}>
              <Image source={require("../../../assets/dashboard/Mode.png")} />
            </TouchableOpacity>

            {/* Mode Dropdown Menu */}
            {modeOpen && (
              <View style={styles.modeDropdownMenu}>
                <TouchableOpacity style={styles.modeDropdownItem}>
                  <Text style={styles.modeDropdownItemText}>Practice</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modeDropdownItem, styles.lastModeDropdownItem]}
                >
                  <Text style={styles.modeDropdownItemText}>Challenge</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.difficultyContainer}>
            <TouchableOpacity
              onPress={toggleDifficulty}
              style={styles.difficultyButton}
            >
              <Image
                source={require("../../../assets/dashboard/Difficulty.png")}
              />
            </TouchableOpacity>

            {/* Difficulty Dropdown Menu */}
            {difficultyOpen && (
              <View style={styles.difficultyDropdownMenu}>
                <TouchableOpacity style={styles.difficultyDropdownItem}>
                  <Text style={styles.difficultyDropdownItemText}>Easy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.difficultyDropdownItem}>
                  <Text style={styles.difficultyDropdownItemText}>Medium</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.difficultyDropdownItem,
                    styles.lastDifficultyDropdownItem,
                  ]}
                >
                  <Text style={styles.difficultyDropdownItemText}>Hard</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>  
        </View>

        {/* Charts Section */}
        <View style={styles.chartsContainer}>
          {/* Shape Familiarity Chart */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Shape Familiarity</Text>
            <View style={styles.shapeChart}>
              <View style={styles.chartBarsContainer}>
                {[
                  { label: "Square", percentage: 80, height: 100 },
                  { label: "Circle", percentage: 90, height: 120 },
                  { label: "Triangle", percentage: 60, height: 80 },
                  { label: "Rectangle", percentage: 85, height: 110 },
                ].map((item, index) => (
                  <View key={`shape-${index}`} style={styles.chartBarGroup}>
                    <Text style={styles.percentageLabel}>{item.percentage}%</Text>
                    <View style={[styles.chartBar, { height: item.height, backgroundColor: '#5A8EF4' }]} />
                    <Text style={styles.chartLabel}>{item.label}</Text>
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
                {[
                  { label: "Red", percentage: 75, height: 90 },
                  { label: "Yellow", percentage: 58, height: 70 },
                  { label: "Blue", percentage: 83, height: 100 },
                  { label: "Green", percentage: 100, height: 120 },
                  { label: "Black", percentage: 42, height: 50 },
                  { label: "Gray", percentage: 67, height: 80 },
                  { label: "White", percentage: 79, height: 95 },
                ].map((item, index) => (
                  <View key={`color-${index}`} style={styles.chartBarGroup}>
                    <Text style={styles.percentageLabel}>{item.percentage}%</Text>
                    <View style={[styles.chartBar, { height: item.height, backgroundColor: '#5A8EF4' }]} />
                    <Text style={styles.chartLabel}>{item.label}</Text>
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
                {[
                  { label: "One (1)", percentage: 80, height: 100 },
                  { label: "Two (2)", percentage: 88, height: 110 },
                  { label: "Three (3)", percentage: 72, height: 90 },
                  { label: "Four (4)", percentage: 64, height: 80 },
                  { label: "Five (5)", percentage: 76, height: 95 },
                  { label: "Six (6)", percentage: 56, height: 70 },
                  { label: "Seven (7)", percentage: 68, height: 85 },
                  { label: "Eight (8)", percentage: 76, height: 95 },
                  { label: "Nine (9)", percentage: 60, height: 75 },
                  { label: "Ten (10)", percentage: 52, height: 65 },
                ].map((item, index) => (
                  <View key={`number-${index}`} style={styles.chartBarGroup}>
                    <Text style={styles.percentageLabel}>{item.percentage}%</Text>
                    <View style={[styles.chartBar, { height: item.height, backgroundColor: '#5A8EF4' }]} />
                    <Text style={styles.chartLabel}>{item.label}</Text>
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
                  data={[
                    { key: 1, value: 8, label: '8', svg: { fill: '#4CD964' } },
                    { key: 2, value: 2, label: '2', svg: { fill: '#FF3B30' } },
                  ]}
                  spacing={0}
                  outerRadius={'100%'}
                >
                  <LabelsPie />
                </PieChart>

                <View style={styles.legend}>
                  <View style={[styles.legendItem, {marginTop: 15}]}>
                    <View style={[styles.legendColor, { backgroundColor: '#4CD964' }]} />
                    <Text style={styles.legendText}>Correct</Text>
                  </View>
                  <View style={[styles.legendItem, { marginLeft: 15, marginTop: 15}]}>
                    <View style={[styles.legendColor, { backgroundColor: '#FF3B30' }]} />
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
                    { key: 1, value: 45, label: '45 mins', svg: { fill: '#4CD964' } }, 
                    { key: 2, value: 15, label: '15 mins', svg: { fill: '#FF3B30' } },
                  ]}
                  spacing={0}
                  outerRadius={'100%'}
                >
                  <LabelsPie />
                </PieChart>

                <View style={styles.legend}>
                  <View style={[styles.legendItem, {marginTop: 15}]}>
                    <View style={[styles.legendColor, { backgroundColor: '#4CD964' }]} />
                    <Text style={styles.legendText}>Spent</Text>
                  </View>
                  <View style={[styles.legendItem, { marginLeft: 15, marginTop: 15}]}>
                    <View style={[styles.legendColor, { backgroundColor: '#FF3B30' }]} />
                    <Text style={styles.legendText}>Left</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5A8EF4',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 4,
    borderColor: '#FFFFFF', 
    shadowColor: '#000',  
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
  modeContainer: {
    position: 'relative',
  },
  modeButton: {
    padding: 5,
  },
  modeDropdownMenu: {
    position: "absolute",
    left: "100%",
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
  modeDropdownItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  lastModeDropdownItem: {
    borderBottomWidth: 0,
  },
  modeDropdownItemText: {
    fontSize: 16,
    color: "#1E1E1E",
    textAlign: "center",
  },
  difficultyContainer: {
    position: 'relative',
  },
  difficultyButton: {
    padding: 5,
  },
  difficultyDropdownMenu: {
    position: "absolute",
    left: "100%",
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
  difficultyDropdownItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  lastDifficultyDropdownItem: {
    borderBottomWidth: 0,
  },
  difficultyDropdownItemText: {
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  quarterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 10,
  },
  
  paginationButton: {
    paddingHorizontal: 10,
  },
  
  paginationButtonText: {
    fontSize: 18,
    color: '#000',
  },

  calendarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  monthContainer: {
    flex: 1,
    marginHorizontal: 10,
  },

  monthTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },

  weekdaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },

  weekdayLabel: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    flex: 1,
  },

  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  dayItem: {
    width: 30,
    height: 30,
    borderRadius: 4,
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dayText: {
    color: '#FFFFFF',
    fontSize: 12,
  },

  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    marginTop: 15,
    alignSelf: 'center',
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#1E1E1E',
    textAlign: 'center',
  },
  // End

  actionButtonsContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  chartsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    
  },

  percentageLabel: {
    fontSize: 12,
    color: '#000',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%'
  },
  pieChartContainer: {
    width: '49%',
    backgroundColor: '#FFFFFF',
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