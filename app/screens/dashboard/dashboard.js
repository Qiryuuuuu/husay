import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  ScrollView, 
  useWindowDimensions,
  Modal,
  TextInput
} from "react-native";

import moment from 'moment';

export default function DashboardScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const [studentName, setStudentName] = useState("Nestor Navarro");
  const [fullName, setFullName] = useState("Harold");
  const [menuOpen, setMenuOpen] = useState(false);
  const [modeOpen, setModeOpen] = useState(false);
  const [difficultyOpen, setDifficultyOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editName, setEditName] = useState("Nestor Navarro");
  const [editAge, setEditAge] = useState("3");
  const [editGender, setEditGender] = useState("Male");
  const [timeRange, setTimeRange] = useState("Today");
  

  const [currentQuarter, setCurrentQuarter] = useState(1);
  const [currentYear, setCurrentYear] = useState(moment().year());

  // Sample data generator for demonstration
  const generateAttendanceData = (year) => {
    const data = {};
    for (let month = 0; month < 12; month++) {
      const daysInMonth = moment(`${year}-${month + 1}`, 'YYYY-MM').daysInMonth();
      data[month] = Array(daysInMonth).fill().map(() => (Math.random() > 0.2 ? 'present' : 'absent'));
    }
    return data;
  };

  const attendanceData = generateAttendanceData(currentYear);

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
const renderDay = (day, status) => {
  let backgroundColor = status === 'present' ? '#4CD964' : '#FF3B30';
  return (
    <View key={day} style={[styles.dayItem, { backgroundColor }]}>
      <Text style={styles.dayText}>{day}</Text>
    </View>
  );
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

  // Handle edit button press
  const handleEditPress = () => {
    setShowEditModal(true);
    setMenuOpen(false);
  };

  // Handle delete button press
  const handleDeletePress = () => {
    setShowDeleteModal(true);
    setMenuOpen(false);
  };

  // Handle update button press
  const handleUpdate = () => {
    setStudentName(editName);
    setShowEditModal(false);
  };

  // Handle cancel button press
  const handleCancel = () => {
    setShowEditModal(false);
  };

  // Handle delete confirmation
  const handleDelete = () => {
    // Implement delete functionality here
    setShowDeleteModal(false);
  };

  // Handle delete cancellation
  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };
  
  

  // Sample data for time chart
  const timeData = [
    { time: '9 AM', duration: 25 },
    { time: '10 AM', duration: 40 },
    { time: '11 AM', duration: 15 },
    { time: '12 PM', duration: 30 },
    { time: '1 PM', duration: 45 },
    { time: '2 PM', duration: 20 },
    { time: '3 PM', duration: 35 },
  ];

  // Render attendance grid item
  const renderAttendanceItem = (status) => {
    let backgroundColor;
    switch(status) {
      case 'present':
        backgroundColor = '#4CD964';
        break;
      case 'absent':
        backgroundColor = '#FF3B30';
        break;
      default:
        backgroundColor = '#E5E5EA';
    }
    
    return (
      <View 
        style={[
          styles.attendanceItem, 
          { backgroundColor }
        ]} 
      />
    );
  };

  // Toggle time range dropdown
  const toggleTimeRange = () => {
    // Implementation for time range dropdown
  };

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
                source={require('../../../assets/default-student.png')}
                style={styles.modalProfileImage}
              />
              <Text style={styles.uploadText}>Upload picture</Text>
            </TouchableOpacity>

            {/* Student Name Input */}
            <View style={styles.inputContainer}>
              <Image 
                source={require('../../../assets/dashboard/user-icon.png')}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                value={editName}
                onChangeText={setEditName}
                placeholder="Student Name"
              />
            </View>

            {/* Age Input */}
            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, styles.halfInput]}>
                <Image 
                  source={require('../../../assets/dashboard/age-icon.png')}
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

              {/* Gender Input */}
              <View style={[styles.inputContainer, styles.halfInput]}>
                <Image 
                  source={require('../../../assets/dashboard/gender-icon.png')}
                  style={styles.inputIcon} 
                />
                <TextInput
                  style={styles.textInput}
                  value={editGender}
                  onChangeText={setEditGender}
                  placeholder="Gender"
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
                  source={require('../../../assets/dashboard/Update.png')}
                  style={styles.editButtonImage}
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.editCancelButton}
                onPress={handleCancel}
              >
                <Image 
                  source={require('../../../assets/dashboard/Cancel.png')}
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
        onRequestClose={handleDeleteCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModalContainer}>
            <Text style={styles.warningTitle}>Warning!</Text>
            <Text style={styles.warningText}>Are you sure you want to delete the student?</Text>
            
            <View style={styles.deleteButtonRow}>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Image 
                  source={require('../../../assets/dashboard/Delete.png')}
                  style={styles.deleteButtonImage}
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.deleteCancelButton}
                onPress={handleDeleteCancel}  
              >
               <Image 
                  source={require('../../../assets/dashboard/Cancel.png')}
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
          <Image style={styles.backButton}
            source={require('../../../assets/dashboard/Back.png')} 
          />
        </TouchableOpacity>

        {/* Sidebar Menu Options */}
        <View style={styles.sidebarMenu}>
          <TouchableOpacity>
            <Image style={styles.studentButton}
              source={require('../../../assets/dashboard/Dashboard.png')} 
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("AccountSettings")}>
            <Image style={styles.accountButton} 
              source={require('../../../assets/dashboard/account-setting.png')} 
            />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity>
          <Image style={styles.logoutButton}
            source={require('../../../assets/dashboard/Logout.png')} 
          />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.mainContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../../assets/dashboard/Husay.png')} 
              style={styles.logo} 
            />
          </View>

          <View style={styles.userContainer}>
            <Text style={styles.greeting}>Hello, {fullName}!</Text>
            <Image 
              source={require('../../../assets/default-profile.png')} 
              style={styles.profilePic} 
            />
          </View>
        </View>

        {/* Student Name and Menu Button Container */}
        <View style={styles.studentNameAndMenuContainer}>
          {/* Student Name Button */}
          <TouchableOpacity style={styles.studentNameButton}>
            <Image 
              source={require('../../../assets/dashboard/arrow-up.png')} 
              style={styles.dropdownIcon} 
            />
            <Text style={styles.studentName}>{studentName}</Text>
          </TouchableOpacity>

          {/* Menu Button with Dropdown */}
          <View style={styles.menuContainer}>
            <TouchableOpacity onPress={toggleMenu} >
              <Image 
                source={menuOpen 
                  ? require('../../../assets/dashboard/Close.png')
                  : require('../../../assets/dashboard/menu.png')}
                style={styles.menuIcon}
              />
            </TouchableOpacity>
            
            {/* Dropdown Menu */}
            {menuOpen && (
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
                key: `day-${month}-${i + 1}`, // Unique key for each day
                day: i + 1,
                status: attendanceData[month][i]
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
                        let backgroundColor = 'transparent'; // Default blank spaces

                        if (day) {
                          backgroundColor = status === 'present' ? '#4CD964' : '#FF3B30';
                        }

                        return (
                          <View key={key} style={[styles.dayItem, { backgroundColor }]}>
                            <Text style={styles.dayText}>{day || ''}</Text>
                          </View>
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
              <Image 
                source={require('../../../assets/dashboard/Mode.png')} 
              />
            </TouchableOpacity>
            
            {/* Mode Dropdown Menu */}
            {modeOpen && (
              <View style={styles.modeDropdownMenu}>
                <TouchableOpacity style={styles.modeDropdownItem}>
                  <Text style={styles.modeDropdownItemText}>Practice</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modeDropdownItem, styles.lastModeDropdownItem]}>
                  <Text style={styles.modeDropdownItemText}>Challenge</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.difficultyContainer}> 
              <TouchableOpacity onPress={toggleDifficulty} style={styles.difficultyButton}>
                <Image 
                  source={require('../../../assets/dashboard/Difficulty.png')} 
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
                <TouchableOpacity style={[styles.difficultyDropdownItem, styles.lastDifficultyDropdownItem]}>
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
              {/* This would be replaced with an actual chart component */}
              <View style={styles.chartBarsContainer}>
                <View style={styles.chartBarGroup}>
                  <View style={[styles.chartBar, { height: 100, backgroundColor: '#4DD0E1' }]} />
                  <Text style={styles.chartLabel}>Square</Text>
                </View>
                <View style={styles.chartBarGroup}>
                  <View style={[styles.chartBar, { height: 120, backgroundColor: '#4DD0E1' }]} />
                  <Text style={styles.chartLabel}>Circle</Text>
                </View>
                <View style={styles.chartBarGroup}>
                  <View style={[styles.chartBar, { height: 80, backgroundColor: '#4DD0E1' }]} />
                  <Text style={styles.chartLabel}>Triangle</Text>
                </View>
                <View style={styles.chartBarGroup}>
                  <View style={[styles.chartBar, { height: 110, backgroundColor: '#4DD0E1' }]} />
                  <Text style={styles.chartLabel}>Rectangle</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Color Familiarity Chart */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Color Familiarity</Text>
            <View style={styles.colorChart}>
              {/* This would be replaced with an actual chart component */}
              <View style={styles.chartBarsContainer}>
                <View style={styles.chartBarGroup}>
                  <View style={[styles.chartBar, { height: 90, backgroundColor: '#4DD0E1' }]} />
                  <Text style={styles.chartLabel}>Red</Text>
                  
                </View>
                <View style={styles.chartBarGroup}>
                  <View style={[styles.chartBar, { height: 70, backgroundColor: '#4DD0E1' }]} />
                  <Text style={styles.chartLabel}>Yellow</Text>
                </View>
                <View style={styles.chartBarGroup}>
                  <View style={[styles.chartBar, { height: 100, backgroundColor: '#4DD0E1' }]} />
                  <Text style={styles.chartLabel}>Blue</Text>
                </View>
                <View style={styles.chartBarGroup}>
                  <View style={[styles.chartBar, { height: 120, backgroundColor: '#4DD0E1' }]} />
                  <Text style={styles.chartLabel}>Green</Text>
                </View>
                <View style={styles.chartBarGroup}>
                  <View style={[styles.chartBar, { height: 50, backgroundColor: '#4DD0E1' }]} />
                  <Text style={styles.chartLabel}>Black</Text>
                </View>
                <View style={styles.chartBarGroup}>
                  <View style={[styles.chartBar, { height: 80, backgroundColor: '#4DD0E1' }]} />
                  <Text style={styles.chartLabel}>Gray</Text>
                </View>
                <View style={styles.chartBarGroup}>
                  <View style={[styles.chartBar, { height: 95, backgroundColor: '#4DD0E1' }]} />
                  <Text style={styles.chartLabel}>White</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Number Familiarity Chart */}
          <View style={[styles.chartCard, styles.fullWidthChart]}>
            <Text style={styles.chartTitle}>Number Familiarity</Text>
            <View style={styles.numberChart}>
              <View style={styles.chartBarsContainer}>
                <View style={styles.chartBarGroup}>
                  <View style={[styles.chartBar, { height: 100, backgroundColor: '#4DD0E1' }]} />
                  <Text style={styles.chartLabel}>One</Text>
                </View>
                <View style={styles.chartBarGroup}>
                  <View style={[styles.chartBar, { height: 110, backgroundColor: '#4DD0E1' }]} />
                  <Text style={styles.chartLabel}>Two</Text>
                </View>
                <View style={styles.chartBarGroup}>
                  <View style={[styles.chartBar, { height: 90, backgroundColor: '#4DD0E1' }]} />
                  <Text style={styles.chartLabel}>Three</Text>
                </View>
                <View style={styles.chartBarGroup}>
                  <View style={[styles.chartBar, { height: 80, backgroundColor: '#4DD0E1' }]} />
                  <Text style={styles.chartLabel}>Four</Text>
                </View>
                <View style={styles.chartBarGroup}>
                  <View style={[styles.chartBar, { height: 95, backgroundColor: '#4DD0E1' }]} />
                  <Text style={styles.chartLabel}>Five</Text>
                </View>
                <View style={styles.chartBarGroup}>
                  <View style={[styles.chartBar, { height: 70, backgroundColor: '#4DD0E1' }]} />
                  <Text style={styles.chartLabel}>Six</Text>
                </View>
                <View style={styles.chartBarGroup}>
                  <View style={[styles.chartBar, { height: 85, backgroundColor: '#4DD0E1' }]} />
                  <Text style={styles.chartLabel}>Seven</Text>
                </View>
                <View style={styles.chartBarGroup}>
                  <View style={[styles.chartBar, { height: 95, backgroundColor: '#4DD0E1' }]} />
                  <Text style={styles.chartLabel}>Eight</Text>
                </View>
                <View style={styles.chartBarGroup}>
                  <View style={[styles.chartBar, { height: 75, backgroundColor: '#4DD0E1' }]} />
                  <Text style={styles.chartLabel}>Nine</Text>
                </View>
                <View style={styles.chartBarGroup}>
                  <View style={[styles.chartBar, { height: 65, backgroundColor: '#4DD0E1' }]} />
                  <Text style={styles.chartLabel}>Ten</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Accuracy Chart */}
          <View style={[styles.chartCard, styles.fullWidthChart]}>
            <View style={styles.accuracyHeader}>
              <Text style={styles.chartTitle}>Accuracy</Text>
              <TouchableOpacity style={styles.todayButton} onPress={toggleTimeRange}>
                <Image 
                  source={require('../../../assets/menu.png')} 
                  style={styles.upArrowIcon} 
                />
                <Text style={styles.todayText}>{timeRange}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.accuracyChart}>
              {/* This would be replaced with an actual chart component */}
              <View style={styles.areaChart}>
                {/* Placeholder for area chart */}
                <View style={styles.areaChartPlaceholder} />
              </View>
              
              {/* Legend */}
              <View style={styles.accuracyLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#4CD964' }]} />
                  <Text style={styles.legendText}>Correct</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#FF3B30' }]} />
                  <Text style={styles.legendText}>Mistakes</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Time Chart */}
          <View style={[styles.chartCard, styles.fullWidthChart]}>
            <View style={styles.timeHeader}>
              <Text style={styles.chartTitle}>Time Spent Learning</Text>
              <TouchableOpacity style={styles.todayButton} onPress={toggleTimeRange}>
                <Image 
                  source={require('../../../assets/menu.png')} 
                  style={styles.upArrowIcon} 
                />
                <Text style={styles.todayText}>{timeRange}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.timeChart}>
              <View style={styles.chartBarsContainer}>
                {timeData.map((item, index) => (
                  <View key={`time-${index}`} style={styles.chartBarGroup}>
                    <View 
                      style={[
                        styles.timeBar, 
                        { 
                          height: item.duration * 2, 
                          backgroundColor: '#7986CB' 
                        }
                      ]} 
                    />
                    <Text style={styles.chartLabel}>{item.time}</Text>
                  </View>
                ))}
              </View>
              
              {/* Time Legend */}
              <View style={styles.timeLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#7986CB' }]} />
                  <Text style={styles.legendText}>Minutes Spent</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.copyright}>© 2024 Husay. All Rights Reserved.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
  },
  sidebar: {
    width: 300,
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRightWidth: 1,
    borderRightColor: '#E5E5EA',
    justifyContent: 'space-between',
    height: '100%',
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
  studentButton:{
    width: 250,
    height: 65, 
    resizeMode: "contain", 
  },
  accountButton:{
    width: 250,
    height: 65,  
    resizeMode: "contain", 
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 25,
    marginLeft: 15,
  },
  mainContent: {
    flex: 1,
    padding: 45,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 35,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 35,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '500',
    marginRight: 10,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#007AFF',
  },
  studentNameAndMenuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  studentNameButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dropdownIcon: {
    width: 16,
    height: 16,
    tintColor: '#FFFFFF',
    marginRight: 5,
  },
  studentName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  menuContainer: {
    position: 'relative',
  },
  menuIcon: {
    width: 45,
    height: 45,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 0,
    right: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 150,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  dropdownItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  lastDropdownItem: {
    borderBottomWidth: 0,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#1E1E1E',
    textAlign: 'center',
  },
  modeContainer: {
    position: 'relative',
    marginRight: 15,
  },
  modeButton: {
    padding: 5,
  },
  modeDropdownMenu: {
    position: 'absolute',
    left: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 150,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  modeDropdownItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  lastModeDropdownItem: {
    borderBottomWidth: 0,
  },
  modeDropdownItemText: {
    fontSize: 16,
    color: '#1E1E1E',
    textAlign: 'center',
  },
  difficultyContainer: {
    position: 'relative',
    marginRight: 15,
  },
  difficultyButton: {
    padding: 5,
  },
  difficultyDropdownMenu: {
    position: 'absolute',
    left: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 150,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  difficultyDropdownItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  lastDifficultyDropdownItem: {
    borderBottomWidth: 0,
  },
  difficultyDropdownItemText: {
    fontSize: 16,
    color: '#1E1E1E',
    textAlign: 'center',
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
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
    marginHorizontal: 5,
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

  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    marginTop: 15,
    alignSelf: 'flex-start',
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  // End

  
  actionButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 15,
  },
  actionIcon: {
    width: 16,
    height: 16,
    tintColor: '#FFFFFF',
    marginRight: 5,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  chartsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    width: '49%',
  },
  fullWidthChart: {
    width: '100%',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: '100%',
  },
  chartBarGroup: {
    alignItems: 'center',
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
    color: '#8E8E93',
  },
  colorLabel: {
    width: 20,
    height: 8,
    borderRadius: 2,
  },
  accuracyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  timeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  todayButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upArrowIcon: {
    width: 12,
    height: 12,
    tintColor: '#8E8E93',
    marginRight: 5,
  },
  todayText: {
    fontSize: 14,
    color: '#8E8E93',
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
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
  },
  accuracyLegend: {
    flexDirection: 'row',
    marginTop: 10,
  },
  timeLegend: {
    flexDirection: 'row',
    marginTop: 0,
  },
  footer: {
    marginTop: 0,
    marginBottom: 75,
    alignItems: 'flex-end',
  },
  copyright: {
    fontSize: 12,
    color: '#1E1E1E',
  },
  
  /* Edit Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 35,
    paddingLeft: 100,
    paddingRight: 100,
    width: '50%',
    alignItems: 'center',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  modalProfileImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#4D7AFF',
    marginBottom: 10,
  },
  uploadText: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
    marginBottom: 25,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 25,
    width: '100%',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  halfInput: {
    width: '48%',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  editUpdateButton: {
    width: '48%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  editCancelButton: {
    width: '48%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  editButtonImage: {
    resizeMode: 'contain',
    width: '100%',
    height: 80,
  },
  
  /* Delete Modal Styles */
  deleteModalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 30,
    width: '40%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  warningTitle: {
    fontSize: 35,
    fontWeight: '600',
    marginBottom: 15,
    color: '#1E1E1E',
  },
  warningText: {
    fontSize: 20,
    color: '#1E1E1E',
    marginBottom: 15,
    textAlign: 'center',
  },
  deleteButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
  },
  deleteButton: {
    paddingVertical: 5,
    paddingHorizontal: 30,
    width: '45%',
    alignItems: 'center',
  },
  deleteCancelButton: {
    paddingVertical: 5,
    paddingHorizontal: 30,
    width: '45%',
    alignItems: 'center',
  },
  deleteButtonImage: {
    resizeMode: 'contain',
    width: '150%',
    height: 75,
  },
});