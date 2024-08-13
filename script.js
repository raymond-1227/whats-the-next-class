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
  const currentWeekday = weekdays[now.getDay()];
  const nextWeekday = getNextWorkingDay(currentWeekday);
  const currentTime = now.toTimeString().substring(0, 5);
  const todaySchedule = getTodaySchedule(currentWeekday, timeSchedule); // Pass timeSchedule here
  determineMessage(classTable, messages, currentWeekday, nextWeekday, currentTime, todaySchedule);
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
function determineMessage(classTable, messages, currentWeekday, nextWeekday, currentTime, todaySchedule) {
  let classIndex;
  let todayClasses = classTable[currentWeekday.toLowerCase()] || [];
  let nextFirstClass = classTable[nextWeekday.toLowerCase()]?.[0] || [];
  let currentStatus = "";
  let moreInfo = "";
  let previousClass = null;
  let currentClass = null;
  let nextClass = null;
  let lastClassIndex = todayClasses.length - 1;
  let lastClassToday = todayClasses[lastClassIndex];
  let lastClassFriday = classTable["friday"][classTable["friday"].length - 1];
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
    } else if (currentWeekday === "monday" && isBeforeSchool) {
      // If it's Monday and before school, set nextClass to the first class of the day
      nextClass = todayClasses[0];
      break;
    }
  }
  
  // Use template literals to insert variables into the strings
  let currentClassText = `<span id="class-subject">${currentClass}</span>`;
  let previousClassText = `<span id="class-subject">${previousClass}</span>`;
  let nextClassText = `<span id="class-subject">${nextClass}</span>`;
  let lastClassText = `<span id="class-subject">${lastClassToday}</span>`;
  let lastClassFridayText = `<span id="class-subject">${lastClassFriday}</span>`;
  let nextFirstClassText = `<span id="class-subject">${nextFirstClass}</span>`;

  if ((currentWeekday === "friday" && isAfterSchool) || currentWeekday === "saturday" || currentWeekday === "sunday") {
    // Condition: It's Friday after school, Saturday or Sunday
    currentStatus = messages.doneForWeek;
    moreInfo = `${messages.lastClassFridayWas.replace(
      "{lastClassFriday}",
      lastClassFridayText
    )}</br>${messages.nextClassMondayIs.replace("{nextFirstClass}", nextFirstClassText)}`;
  } else if (currentWeekday === "monday" && isBeforeSchool) {
    // Condition: It's Monday before school
    currentStatus = messages.noClassesNow;
    moreInfo = `${messages.lastClassFridayLastWeekWas.replace(
      "{lastClassFriday}",
      lastClassFridayText
    )}</br>${messages.nextClassTodayIs.replace("{nextClass}", nextClassText)}`;
  } else if (isBeforeSchool) {
    // Condition: Before school
    currentStatus = messages.noClassesNow;
    moreInfo = `${messages.lastClassWas.replace(
      "{lastClassToday}",
      lastClassText
    )}</br>${messages.nextClassTodayIs.replace("{nextClass}", nextClassText)}`;
  } else if (isAfterSchool) {
    // Condition: After school
    currentStatus = messages.noClassesNow;
    moreInfo = `${messages.lastClassWas.replace(
      "{lastClassToday}",
      lastClassText
    )}</br>${messages.nextClassTomorrowIs.replace("{nextFirstClass}", nextFirstClassText)}`;
  } else if (previousClass == null) {
    // Condition: During the first class
    currentStatus = messages.currentlyIn.replace("{currentClass}", currentClassText);
    moreInfo = messages.nextClassIs.replace("{nextClass}", nextClassText);
  } else if (currentClass !== null && !(isAfterSchool || classIndex === lastClassIndex)) {
    // Condition: During a class that is not the last class
    currentStatus = messages.currentlyIn.replace("{currentClass}", currentClassText);
    moreInfo = `${messages.previousClassWas.replace(
      "{previousClass}",
      previousClassText
    )}</br>${messages.nextClassIs.replace("{nextClass}", nextClassText)}`;
  } else if (classIndex === lastClassIndex) {
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
