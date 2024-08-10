// Define class timings and class names
const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const timeSchedule = [
  "08:00", "08:50", "09:00", "09:50", "10:00", "10:50", "11:50", "13:00", "13:50", "14:00", "14:50", "15:00", "15:50"
];

const classTable = {
  monday: ["數學", "物理", "物理", "空堂", "數學", "國文", "國文"],
  tuesday: ["數學", "化學", "化學", "化學", "空堂", "物理", "物理"],
  wednesday: ["數學", "化學", "化學", "化學", "空堂", "國文", "英文"],
  thursday: ["數學", "地球科學", "地球科學", "國文", "數學", "英文", "英文"],
  friday: ["數學", "地球科學", "地球科學", "物理", "空堂", "空堂", "數學"],
};

// Get current time
const now = new Date();

const currentWeekday = weekdays[now.getDay()];
function getNextWorkingDay() {
  const currentDayIndex = now.getDay();
  let nextDayIndex = now.getDay() + 1;
  // If it's Friday, Saturday, or Sunday, set nextDayIndex to Monday
  if (currentDayIndex >= 5 || currentDayIndex <= 0) {
      nextDayIndex = 1; // Monday
  }
  return weekdays[nextDayIndex];
}
const nextWeekday = getNextWorkingDay(currentWeekday);

const currentTime = now.toTimeString().substring(0, 5);

function getWeek() {
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = now - start + (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  return Math.ceil(day / 7);
}
const currentWeek = getWeek();

// Determine today's schedule and adjust for the day if needed
let adjustedWeekday = currentWeekday;
if (currentTime >= "00:00" && currentTime < timeSchedule[0]) {
  adjustedWeekday = weekdays[(weekdays.indexOf(currentWeekday) - 1 + 7) % 7];
}

// Functions to determine the message to display
function determineMessage() {
  let todayClasses = classTable[currentWeekday] || [];
  let tomorrowFirstClass = classTable[nextWeekday]?.[0] || [];
  let message = "";
  let previousClass = "None";
  let currentClass = "None";
  let nextClass = "None";
  let lastClassIndex = todayClasses.length - 1;
  let lastClassToday = todayClasses[lastClassIndex];
  let isAfterSchool = currentTime >= timeSchedule[timeSchedule.length - 1];
  let isBeforeSchool = currentTime < timeSchedule[0];


  // Determine previous, current, and next class
  for (let i = 0; i < timeSchedule.length - 1; i += 2) {
    let classIndex = i / 2;
    if (currentTime >= timeSchedule[i] && currentTime < timeSchedule[i + 1]) {
      currentClass = todayClasses[classIndex];
      nextClass = todayClasses[classIndex + 1] || "None";
      previousClass = classIndex > 0 ? todayClasses[classIndex - 1] : "None";
      break;
    } else if (currentTime >= timeSchedule[i + 1] && currentTime < (timeSchedule[i + 2] || "24:00")) {
      previousClass = todayClasses[classIndex];
      nextClass = todayClasses[classIndex + 1] || "None";
      break;
    }
  }

  // Handle after school on Friday to before the first class on Monday
  if (
    (currentWeekday === "friday" && isAfterSchool) ||
    currentWeekday === "saturday" ||
    currentWeekday === "sunday" ||
    (currentWeekday === "monday" && isBeforeSchool)
  ) {
    let lastClassFriday = classTable["friday"][classTable["friday"].length - 1];
    message = `本週課程已結束\n最後一節課是${lastClassFriday}\n下週第一節課是${tomorrowFirstClass}`;
  } else if (isBeforeSchool || isAfterSchool) {
    message = `目前沒有課\n最後一節課是${lastClassToday}\n明天第一節課是${tomorrowFirstClass}`;
  } else if (currentClass !== "None" && !(isAfterSchool || currentClass === lastClassToday)) {
    message = `現在上的是${currentClass}\n下一節課是${nextClass}`;
  } else if (currentClass === lastClassToday) {
    message = `${lastClassToday}是今天最後一節課\n今天已經沒有其他課了\n明天第一節課是${tomorrowFirstClass}`;
  } else {
    message = `現在是下課時間\n上一節課是${previousClass}\n下一節課是${nextClass}`;
  }

  // Update the HTML elements with the message
  document.getElementById("classMessage").innerText = message;
  console.log(message);
}

determineMessage();
