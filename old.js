// Define class timings and class names
const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const regularDaySchedule = [
  "08:00",
  "08:50",
  "09:10",
  "10:00",
  "10:10",
  "11:00",
  "11:10",
  "12:00",
  "13:00",
  "13:50",
  "14:00",
  "14:50",
  "15:00",
  "15:50",
  "15:55",
  "16:45",
];
const shortDaySchedule = regularDaySchedule.slice(0, -2);

const classTable = {
  monday: ["地球科學", "數學", "物理", "物理", "體育", "英文", "暫無", "暫無"],
  tuesday: ["英文寫作", "化學", "化學", "數學", "生物", "國文", "暫無", "暫無"],
  wednesday: ["數學", "物理", "物理", "英文", "國文", "生物", "暫無"],
  thursday: ["化學", "化學", "英文", "數學", "國文", "英文寫作", "暫無", "暫無"],
  friday: ["生物", "地球科學", "數學", "體育", "國文", "英文", "暫無"],
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

// Update the 8th class for Monday and Tuesday
const isOddWeek = currentWeek % 2 !== 0;
// As of summer break it's not needed for now
// classTable.monday[7] = isOddWeek ? "國文" : "數學";
// classTable.tuesday[7] = isOddWeek ? "物理" : "英文";

// Function to get today's schedule based on the weekday
function getTodaySchedule(weekday) {
  return weekday === "wednesday" || weekday === "friday" ? shortDaySchedule : regularDaySchedule;
}

// Determine today's schedule and adjust for the day if needed
let adjustedWeekday = currentWeekday;
let todaySchedule = getTodaySchedule(currentWeekday);
if (currentTime >= "00:00" && currentTime < todaySchedule[0]) {
  adjustedWeekday = weekdays[(weekdays.indexOf(currentWeekday) - 1 + 7) % 7];
  todaySchedule = getTodaySchedule(adjustedWeekday);
}

// Functions to determine the message to display
function determineMessage() {
  let todayClasses = classTable[currentWeekday] || [];
  let nextFirstClass = classTable[nextWeekday]?.[0] || [];
  let currentStatus = "";
  let moreInfo = "";
  let previousClass = "None";
  let currentClass = "None";
  let nextClass = "None";
  let lastClassIndex = todayClasses.length - 1;
  let lastClassToday = todayClasses[lastClassIndex];
  let isAfterSchool = currentTime >= todaySchedule[todaySchedule.length - 1];
  let isBeforeSchool = currentTime < todaySchedule[0];

  // Determine previous, current, and next class
  for (let i = 0; i < todaySchedule.length - 1; i += 2) {
    let classIndex = i / 2;
    if (currentTime >= todaySchedule[i] && currentTime < todaySchedule[i + 1]) {
      currentClass = todayClasses[classIndex];
      nextClass = todayClasses[classIndex + 1];
      previousClass = todayClasses[classIndex - 1];
      break;
    } else if (currentTime >= todaySchedule[i + 1] && currentTime < (todaySchedule[i + 2] || "24:00")) {
      previousClass = todayClasses[classIndex];
      nextClass = todayClasses[classIndex + 1];
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
    currentStatus = "Classes are done for the week";
    moreInfo = `The last class was ${lastClassFriday}\nThe next class is ${nextFirstClass}`;
  } else if (isBeforeSchool || isAfterSchool) {
    currentStatus = "There are no classes for now";
    moreInfo = `It was previously ${lastClassToday}\nThe next class is ${nextFirstClass}`;
  } else if (currentClass !== "None" && !(isAfterSchool || currentClass === lastClassToday)) {
    console.log(currentClass);
    currentStatus = `You're currently in ${currentClass}`;
    moreInfo = `It was previously ${previousClass}\nThe next class is ${nextClass}`;
  } else {
    currentStatus = "You're currently on break";
    moreInfo = `It was previously ${previousClass}\nThe next class is ${nextClass}`;
  }

  // Update the HTML elements with the message
  document.getElementById("currentStatus").innerText = currentStatus;
  document.getElementById("moreInfo").innerText = moreInfo;
}

determineMessage();
