// Function to load JSON data
function loadJSON(callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open("GET", "data.json", true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      callback(JSON.parse(xobj.responseText));
    }
  };
  xobj.send(null);
}

// Hardcoded weekdays as they are only for internal time determination
const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

// Function to initialize the content
function initializeContent(data) {
  const timeSchedule = data.timeSchedule;
  const classTable = data.classTable;
  const messages = data.messages;

  const now = new Date();
  const currentWeek = getWeek(now);
  const currentWeekday = weekdays[now.getDay()];
  const lastWeekday = getLastWorkingDay(currentWeekday);
  const nextWeekday = getNextWorkingDay(currentWeekday);
  const currentTime = now.toTimeString().substring(0, 5);
  const todaySchedule = getTodaySchedule(currentWeekday, timeSchedule);

  // Update the 8th class for Monday and Tuesday
  const isOddWeek = currentWeek % 2 !== 0;
  classTable.monday[7] = isOddWeek ? "國文輔" : "英文輔";
  classTable.thursday[7] = isOddWeek ? "化學輔" : "物理輔";

  determineMessage(
    classTable,
    messages,
    lastWeekday,
    currentWeekday,
    nextWeekday,
    currentTime,
    todaySchedule,
    currentWeek
  );
}

// Function to get the last working day
function getLastWorkingDay(currentWeekday) {
  const currentDayIndex = weekdays.indexOf(currentWeekday);
  let lastDayIndex = currentDayIndex - 1;
  if (currentDayIndex <= 1) {
    lastDayIndex = 5; // Friday
  }
  return weekdays[lastDayIndex];
}

// Calculate the current week number
function getWeek(date) {
  var start = new Date(date.getFullYear(), 0, 0);
  var diff = date - start + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  return Math.ceil(day / 7);
}

// Function to get the next working day
function getNextWorkingDay(currentWeekday) {
  const currentDayIndex = weekdays.indexOf(currentWeekday);
  let nextDayIndex = currentDayIndex + 1;
  if (currentDayIndex >= 5 || currentDayIndex <= 0) {
    nextDayIndex = 1; // Monday
  }
  return weekdays[nextDayIndex];
}

// Function to get today's schedule based on the weekday
function getTodaySchedule(currentWeekday, timeSchedule) {
  const shortSchedule = timeSchedule.slice(0, -2);
  return currentWeekday === "wednesday" || currentWeekday === "friday" ? shortSchedule : timeSchedule;
}

// Function to determine the message to display
function determineMessage(classTable, messages, lastWeekday, currentWeekday, nextWeekday, currentTime, todaySchedule) {
  let classIndex;
  let currentStatus = "";
  let moreInfo = "";
  let previousClass = null;
  let currentClass = null;
  let nextClass = null;
  let lastClasses = classTable[lastWeekday] || [];
  let todayClasses = classTable[currentWeekday] || [];
  let nextFirstClass = classTable[nextWeekday]?.[0] || [];
  let lastClassIndexToday = todayClasses.length - 1;
  let lastClassIndex = lastClasses.length - 1;
  let lastClassToday = todayClasses[lastClassIndexToday];
  let lastClass = lastClasses[lastClassIndex];
  let isAfterSchool = currentTime >= todaySchedule[todaySchedule.length - 1];
  let isBeforeSchool = currentTime < todaySchedule[0];

  for (let i = 0; i < todaySchedule.length - 1; i += 2) {
    classIndex = i / 2;
    if (currentTime >= todaySchedule[i] && currentTime < todaySchedule[i + 1]) {
      currentClass = todayClasses[classIndex];
      nextClass = todayClasses[classIndex + 1];
      previousClass = classIndex > 0 ? todayClasses[classIndex - 1] : "None";
      break;
    } else if (currentTime >= todaySchedule[i + 1] && currentTime < (todaySchedule[i + 2] || "24:00")) {
      previousClass = todayClasses[classIndex];
      nextClass = todayClasses[classIndex + 1];
      break;
    } else if (isBeforeSchool) {
      // If it's before school, set nextClass to the first class of the day
      nextClass = todayClasses[0];
      break;
    }
  }

  // Use template literals to insert variables into the strings
  let currentClassText = `<span id="class-subject">${currentClass}</span>`;
  let previousClassText = `<span id="class-subject">${previousClass}</span>`;
  let nextClassText = `<span id="class-subject">${nextClass}</span>`;
  let lastClassTodayText = `<span id="class-subject">${lastClassToday}</span>`;
  let lastClassText = `<span id="class-subject">${lastClass}</span>`;
  let nextFirstClassText = `<span id="class-subject">${nextFirstClass}</span>`;

  if (currentWeekday === "saturday" || currentWeekday === "sunday") {
    // Condition: It's Saturday or Sunday
    currentStatus = messages.doneForWeek;
    moreInfo = `${messages.lastClassFridayWas.replace(
      "{lastClass}",
      lastClassText
    )}</br>${messages.nextClassMondayIs.replace("{nextFirstClass}", nextFirstClassText)}`;
  } else if (currentWeekday === "friday" && isAfterSchool) {
    // Condition: It's Friday after school
    currentStatus = messages.doneForWeek;
    moreInfo = `${messages.lastClassWas.replace(
      "{lastClassToday}",
      lastClassTodayText
    )}</br>${messages.nextClassMondayIs.replace("{nextFirstClass}", nextFirstClassText)}`;
  } else if (currentWeekday === "monday" && isBeforeSchool) {
    // Condition: It's Monday before school
    currentStatus = messages.noClassesNow;
    moreInfo = `${messages.lastClassFridayLastWeekWas.replace(
      "{lastClass}",
      lastClassText
    )}</br>${messages.nextClassTodayIs.replace("{nextClass}", nextClassText)}`;
  } else if (isAfterSchool) {
    // Condition: After school
    currentStatus = messages.noClassesNow;
    moreInfo = `${messages.lastClassWas.replace(
      "{lastClassToday}",
      lastClassTodayText
    )}</br>${messages.nextClassTomorrowIs.replace("{nextFirstClass}", nextFirstClassText)}`;
  } else if (isBeforeSchool) {
    // Condition: Before school
    currentStatus = messages.noClassesNow;
    moreInfo = `${messages.lastClassYesterdayWas.replace(
      "{lastClass}",
      lastClassText
    )}</br>${messages.nextClassTodayIs.replace("{nextClass}", nextClassText)}`;
  } else if (previousClass == null) {
    // Condition: During the first class
    currentStatus = messages.currentlyIn.replace("{currentClass}", currentClassText);
    moreInfo = messages.nextClassIs.replace("{nextClass}", nextClassText);
  } else if (currentClass !== null && !(isAfterSchool || classIndex === lastClassIndexToday)) {
    // Condition: During a class that is not the last class
    currentStatus = messages.currentlyIn.replace("{currentClass}", currentClassText);
    moreInfo = `${messages.previousClassWas.replace(
      "{previousClass}",
      previousClassText
    )}</br>${messages.nextClassIs.replace("{nextClass}", nextClassText)}`;
  } else if (classIndex === lastClassIndexToday) {
    // Condition: During the last class
    currentStatus = messages.currentlyInLast.replace("{currentClass}", currentClassText);
    moreInfo = messages.previousClassWas.replace("{previousClass}", previousClassText);
  } else {
    // Respond with on break status
    currentStatus = messages.onBreak;
    moreInfo = `${messages.previousClassWas.replace(
      "{previousClass}",
      previousClassText
    )}</br>${messages.nextClassIs.replace("{nextClass}", nextClassText)}`;
  }

  // Use innerHTML to render the HTML tags properly
  document.getElementById("currentStatus").innerHTML = currentStatus;
  document.getElementById("moreInfo").innerHTML = moreInfo;
}

// Load the JSON and initialize the content
loadJSON(initializeContent);

// Refresh the current status every minute
document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "visible") {
    refreshContent();
  }
});

function refreshContent() {
  loadJSON(initializeContent);
}

function startRefreshCycle() {
  const now = new Date();
  const msUntilNextMinute = (60 - now.getSeconds()) * 1000;

  setTimeout(function () {
    refreshContent();
    setInterval(refreshContent, 60000); // Refresh every minute
  }, msUntilNextMinute); // Wait until the start of the next minute
}

// Start the refresh cycle when the page loads
window.onload = startRefreshCycle;
