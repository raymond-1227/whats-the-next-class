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
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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
  return currentWeekday === "Wednesday" || currentWeekday === "Friday" ? shortSchedule : timeSchedule;
}

// Function to determine the message to display
function determineMessage(classTable, messages, currentWeekday, nextWeekday, currentTime, todaySchedule) {
  let todayClasses = classTable[currentWeekday.toLowerCase()] || [];
  let nextFirstClass = classTable[nextWeekday.toLowerCase()]?.[0] || [];
  let currentStatus = "";
  let moreInfo = "";
  let previousClass = "None";
  let currentClass = "None";
  let nextClass = "None";
  let lastClassIndex = todayClasses.length - 1;
  let lastClassToday = todayClasses[lastClassIndex];
  let lastClassFriday = classTable["friday"][classTable["friday"].length - 1];
  let isAfterSchool = currentTime >= todaySchedule[todaySchedule.length - 1];
  let isBeforeSchool = currentTime < todaySchedule[0];

  for (let i = 0; i < todaySchedule.length - 1; i += 2) {
    let classIndex = i / 2;
    if (currentTime >= todaySchedule[i] && currentTime < todaySchedule[i + 1]) {
      currentClass = todayClasses[classIndex];
      nextClass = todayClasses[classIndex + 1];
      previousClass = classIndex > 0 ? todayClasses[classIndex - 1] : "None";
      break;
    } else if (currentTime >= todaySchedule[i + 1] && currentTime < (todaySchedule[i + 2] || "24:00")) {
      previousClass = todayClasses[classIndex];
      nextClass = todayClasses[classIndex + 1];
      break;
    } else if (currentWeekday === "Monday" && isBeforeSchool) {
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

  if ((currentWeekday === "Friday" && isAfterSchool) || currentWeekday === "Saturday" || currentWeekday === "Sunday") {
    // Condition: It's Friday after school, Saturday or Sunday
    currentStatus = messages.doneForWeek;
    moreInfo = `${messages.lastClassFridayWas.replace(
      "{lastClassFriday}",
      lastClassFridayText
    )}</br>${messages.nextClassIs.replace("{nextClass}", nextFirstClassText)}`;
  } else if (currentWeekday === "Monday" && isBeforeSchool) {
    // Condition: It's Monday before school
    currentStatus = messages.noClassesNow;
    moreInfo = `${messages.lastClassFridayWas.replace(
      "{lastClassFriday}",
      lastClassFridayText
    )}</br>${messages.nextClassIs.replace("{nextClass}", nextClassText)}`;
  } else if (isBeforeSchool || isAfterSchool) {
    // Condition: Before school or after school
    currentStatus = messages.noClassesNow;
    moreInfo = `${messages.lastClassWas.replace("{lastClassToday}", lastClassText)}</br>${messages.nextClassIs.replace(
      "{nextClass}",
      nextFirstClassText
    )}`;
  } else if (previousClass == "None") {
    // Condition: During the first class
    currentStatus = messages.currentlyIn.replace("{currentClass}", currentClassText);
    moreInfo = messages.nextClassIs.replace("{nextClass}", nextClassText);
  } else if (currentClass !== "None" && !(isAfterSchool || currentClass === lastClassToday)) {
    // Condition: During a class that is not the last class
    currentStatus = messages.currentlyIn.replace("{currentClass}", currentClassText);
    moreInfo = `${messages.previousClassWas.replace(
      "{previousClass}",
      previousClassText
    )}</br>${messages.nextClassIs.replace("{nextClass}", nextClassText)}`;
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
