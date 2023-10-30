// Define class timings and class names
const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

const regularDaySchedule = ['08:00', '08:50', '09:10', '10:00', '10:10', '11:00', '11:10', '12:00', '13:00', '13:50', '14:00', '14:50', '15:00', '15:50', '16:00', '16:45'];
const shortDaySchedule = ['08:00', '08:50', '09:10', '10:00', '10:10', '11:00', '11:10', '12:00', '13:00', '13:50', '14:00', '14:50', '15:00', '15:50'];

const classTable = {
  'monday': ['歷史', '物理探究A', '物理探究A', '英語文', '數學A', '公民與社會', '地理', '選修化學I'],
  'tuesday': ['公民與社會', '選修物理I', '英文', '化學', '體育', '國文', '國文'],
  'wednesday': ['數學A', '英文', '國語文', '音樂', '團體活動', '團體活動', '團體活動'],
  'thursday': ['健康與護理', '國語文', '地理', '自主學習', '數學A', '選修物理I', '歷史', '數學/物理'],
  'friday': ['選修化學I', '歷史', '數學A', '國語文', '英語文', '全民國防教育', '體育']
};

// Get current day and time
const now = new Date();
const currentWeekday = weekdays[now.getDay()];
const currentTime = now.toTimeString().substring(0, 5);
const currentWeek = Math.ceil(now.getDate() / 7);

// Determine class and break timings and class names based on the day
let todaySchedule = currentWeekday === 'wednesday' || currentWeekday === 'friday' ? shortDaySchedule : regularDaySchedule;
let todayClasses = classTable[currentWeekday] || [];

let sideNote = "";

// Function to get the next weekday
function getNextWeekday(weekday) {
  const index = weekdays.indexOf(weekday);
  if (index === -1 || index >= 5) {
    return 'monday';
  } else {
    return weekdays[index + 1];
  }
}

// Implement the main logic
let currentClass = "None";
let nextClass = "None";

if (currentTime < todaySchedule[0] || currentTime >= todaySchedule[todaySchedule.length - 1]) {
  // Before school starts or after it ends
  currentClass = "None (Previous: " + todayClasses[todayClasses.length - 1] + ")";
  nextClass = classTable[getNextWeekday(currentWeekday)][0] + " (Next class tomorrow)";
} else {
  for (let i = 0, j = 0; i < todaySchedule.length - 1; i += 2, j++) {
    if (currentTime >= todaySchedule[i] && currentTime < todaySchedule[i + 1]) {
      currentClass = todayClasses[j];
      nextClass = todayClasses[j + 1] || "None";
      break;
    } else if (currentTime >= todaySchedule[i + 1] && currentTime < todaySchedule[i + 2]) {
      currentClass = "Break (Previous: " + todayClasses[j] + ")";
      nextClass = todayClasses[j + 1] || "None";
      break;
    }
  }
}

// Update the HTML elements
document.getElementById("currentClass").innerText = currentClass;
document.getElementById("nextClass").innerText = nextClass;
