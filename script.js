// Define class timings and class names
const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const regularDaySchedule = ["08:00", "08:50", "09:10", "10:00", "10:10", "11:00", "11:10", "12:00", "13:00", "13:50", "14:00", "14:50", "15:00", "15:50", "15:55", "16:45"];
const shortDaySchedule = ["08:00", "08:50", "09:10", "10:00", "10:10", "11:00", "11:10", "12:00", "13:00", "13:50", "14:00", "14:50", "15:00", "15:50"];

const classTable = {
  monday: ["歷史", "數學A", "選修物理II", "國語文", "英語文", "問題解決", "問題解決", "國文/數學"],
  tuesday: ["體育", "充實補強", "選修化學II", "數學A", "歷史", "英語文", "各類文學選讀", "英文/物理"],
  wednesday: ["歷史", "國語文", "化學探究B", "化學探究B", "團體活動", "團體活動", "團體活動"],
  thursday: ["國語文", "英語文", "數學A", "自主學習", "體育", "各類文學選讀", "選修化學II", "化學"],
  friday: ["數學A", "健康與護理", "選修物理II", "全民國防教育", "國語文", "英語文", "音樂"],
};

// Get current day and time
const now = new Date();
const originalWeekday = weekdays[now.getDay()];
const currentTime = now.toTimeString().substring(0, 5);
const currentWeek = Math.ceil(now.getDate() / 7);

// Update the 8th class for Monday and Tuesday
const isOddWeek = currentWeek % 2 !== 0;
classTable.monday[7] = isOddWeek ? "國文" : "數學";
classTable.tuesday[7] = isOddWeek ? "物理" : "英文";

// Function to get today's schedule based on the weekday
function getTodaySchedule(weekday) {
  return weekday === "wednesday" || weekday === "friday" ? shortDaySchedule : regularDaySchedule;
}

// Determine today's schedule and adjust for the day if needed
let adjustedWeekday = originalWeekday;
let todaySchedule = getTodaySchedule(originalWeekday);
if (currentTime >= "00:00" && currentTime < todaySchedule[0]) {
  adjustedWeekday = weekdays[(weekdays.indexOf(originalWeekday) - 1 + 7) % 7];
  todaySchedule = getTodaySchedule(adjustedWeekday);
}

// Functions to determine the message to display
function determineMessage() {
  let todayClasses = classTable[adjustedWeekday] || [];
  const nextWeekday = getNextWeekday(adjustedWeekday, currentTime, todaySchedule);
  let tomorrowClasses = classTable[nextWeekday] || [];
  let message = "";
  let previousClass = "None";
  let currentClass = "None";
  let nextClass = "None";
  let isAfterSchool = currentTime >= todaySchedule[todaySchedule.length - 1];
  let isBeforeSchool = currentTime < todaySchedule[0];
  let lastClassIndex = todaySchedule.length / 2 - 1;
  let lastClassToday = todayClasses[lastClassIndex];

  // Determine previous, current, and next class
  for (let i = 0; i < todaySchedule.length - 1; i += 2) {
    let classIndex = i / 2;
    if (currentTime >= todaySchedule[i] && currentTime < todaySchedule[i + 1]) {
      currentClass = todayClasses[classIndex];
      nextClass = todayClasses[classIndex + 1] || "None";
      previousClass = classIndex > 0 ? todayClasses[classIndex - 1] : "None";
      break;
    } else if (currentTime >= todaySchedule[i + 1] && currentTime < (todaySchedule[i + 2] || "24:00")) {
      previousClass = todayClasses[classIndex];
      nextClass = todayClasses[classIndex + 1] || "None";
      break;
    }
  }

  // Adjust message based on the scenario
  if (isBeforeSchool || isAfterSchool) {
    let nextDayOrWeek = adjustedWeekday === "friday" || adjustedWeekday === "saturday" ? "next week" : "tomorrow";
    message = `There are no classes for now\nIt was previously ${previousClass}\nThe next class is ${tomorrowClasses[0] || "None"} (${nextDayOrWeek})`;
  } else if (currentClass !== "None" && !(isAfterSchool || currentClass === lastClassToday)) {
    message = `You're currently in ${currentClass}\nThe next class is ${nextClass}`;
  } else if (currentClass === lastClassToday) {
    let nextDayOrWeek = adjustedWeekday === "friday" ? "next week" : "tomorrow";
    message = `You're currently in the ${lastClassToday}\nThere is no more class for today\nThe next class is ${tomorrowClasses[0] || "None"} (${nextDayOrWeek})`;
  } else {
    message = `You're currently on break\nIt was previously ${previousClass}\nThe next class is ${nextClass}`;
  }

  // Update the HTML elements with the message
  document.getElementById("classMessage").innerText = message;
}

// Function to get the next weekday
function getNextWeekday(weekday, time, schedule) {
  if (time < schedule[0] && time >= "00:00") {
    return weekday; // Return the same day if it's early morning
  }
  return weekdays[(weekdays.indexOf(weekday) + 1) % 7]; // Return the next weekday otherwise
}

determineMessage();
