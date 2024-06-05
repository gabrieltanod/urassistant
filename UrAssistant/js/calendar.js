// Navbar
const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-nav");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("is-active");
  mobileMenu.classList.toggle("is-active");
});

// Calendar
const calendar = document.querySelector(".calendar"),
  dateDisplay = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventBtn = document.querySelector(".add-event"),
  addEventWrapper = document.querySelector(".add-event-wrapper"),
  addEventCloseBtn = document.querySelector(".close"),
  addEventTitle = document.querySelector(".event-name"),
  addEventFrom = document.querySelector(".event-time-from"),
  addEventTo = document.querySelector(".event-time-to"),
  addEventSubmit = document.querySelector(".add-event-btn");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const eventsArr = [];
getEvents();
console.log(eventsArr);

// Initialize Calendar
function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  dateDisplay.innerHTML = `${months[month]} ${year}`;

  let days = "";

  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    let event = eventsArr.some(eventObj => 
      eventObj.day === i && eventObj.month === month + 1 && eventObj.year === year
    );
    
    if (i === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      days += event ? `<div class="day today active event">${i}</div>` : `<div class="day today active">${i}</div>`;
    } else {
      days += event ? `<div class="day event">${i}</div>` : `<div class="day">${i}</div>`;
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }
  daysContainer.innerHTML = days;
  addListener();
}

function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

initCalendar();

function addListener() {
  const days = document.querySelectorAll(".day");
  days.forEach(day => {
    day.addEventListener("click", (e) => {
      getActiveDay(Number(e.target.innerHTML));
      updateEvents(Number(e.target.innerHTML));
      activeDay = Number(e.target.innerHTML);

      days.forEach(day => day.classList.remove("active"));
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        setTimeout(() => {
          const newDays = document.querySelectorAll(".day");
          newDays.forEach(newDay => {
            if (!newDay.classList.contains("prev-date") && newDay.innerHTML === e.target.innerHTML) {
              newDay.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();
        setTimeout(() => {
          const newDays = document.querySelectorAll(".day");
          newDays.forEach(newDay => {
            if (!newDay.classList.contains("next-date") && newDay.innerHTML === e.target.innerHTML) {
              newDay.classList.add("active");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("active");
      }
    });
  });
}

todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

dateInput.addEventListener("input", (e) => {
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  if (dateInput.value.length === 2) {
    dateInput.value += "/";
  }
  if (dateInput.value.length > 7) {
    dateInput.value = dateInput.value.slice(0, 7);
  }
  if (e.inputType === "deleteContentBackward" && dateInput.value.length === 3) {
    dateInput.value = dateInput.value.slice(0, 2);
  }
});

gotoBtn.addEventListener("click", gotoDate);

function gotoDate() {
  const dateArr = dateInput.value.split("/");
  if (dateArr.length === 2 && dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
    month = dateArr[0] - 1;
    year = dateArr[1];
    initCalendar();
  } else {
    alert("Invalid Date");
  }
}

function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dayName = day.toString().split(" ")[0];
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = `${date} ${months[month]} ${year}`;
}

function updateEvents(date) {
  let events = "";
  eventsArr.forEach(event => {
    if (date === event.day && month + 1 === event.month && year === event.year) {
      event.events.forEach(event => {
        events += `
          <div class="event">
            <div class="title">
              <i class="fas fa-circle"></i>
              <h3 class="event-title">${event.title}</h3>
            </div>
            <div class="event-time">
              <span class="event-time">${event.time}</span>
            </div>
          </div>`;
      });
    }
  });
  if (events === "") {
    events = `<div class="no-event"><h3>No Events</h3></div>`;
  }
  eventsContainer.innerHTML = events;
  saveEvents();
}

addEventBtn.addEventListener("click", () => {
  addEventWrapper.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => {
  addEventWrapper.classList.remove("active");
});

document.addEventListener("click", (e) => {
  if (e.target !== addEventBtn && !addEventWrapper.contains(e.target)) {
    addEventWrapper.classList.remove("active");
  }
});

addEventTitle.addEventListener("input", (e) => {
  addEventTitle.value = addEventTitle.value.slice(0, 60);
});

function defineProperty() {
  var osccred = document.createElement("div");
  document.body.appendChild(osccred);
}

defineProperty();

addEventFrom.addEventListener("input", (e) => {
  addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
  if (addEventFrom.value.length === 2) {
    addEventFrom.value += ":";
  }
  if (addEventFrom.value.length > 5) {
    addEventFrom.value = addEventFrom.value.slice(0, 5);
  }
});

addEventTo.addEventListener("input", (e) => {
  addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
  if (addEventTo.value.length === 2) {
    addEventTo.value += ":";
  }
  if (addEventTo.value.length > 5) {
    addEventTo.value = addEventTo.value.slice(0, 5);
  }
});

addEventSubmit.addEventListener("click", () => {
  const eventTitle = addEventTitle.value.trim();
  const eventTimeFrom = addEventFrom.value;
  const eventTimeTo = addEventTo.value;

  if (!eventTitle) {
    alert("Event title is required.");
    return;
  }

  if (!eventTimeFrom || !eventTimeTo) {
    alert("Event time is required.");
    return;
  }

  const timeFromArr = eventTimeFrom.split(":");
  const timeToArr = eventTimeTo.split(":");

  if (
    timeFromArr.length !== 2 ||
    timeToArr.length !== 2 ||
    timeFromArr[0] > 23 || timeFromArr[1] > 59 ||
    timeToArr[0] > 23 || timeToArr[1] > 59
  ) {
    alert("Invalid Time Format");
    return;
  }

  const timeFrom = convertTime(eventTimeFrom);
  const timeTo = convertTime(eventTimeTo);

  const newEvent = {
    title: eventTitle,
    time: `${timeFrom} - ${timeTo}`,
  };

  let eventAdded = false;

  if (eventsArr.length > 0) {
    eventsArr.forEach(item => {
      if (
        item.day === activeDay &&
        item.month === month + 1 &&
        item.year === year
      ) {
        item.events.push(newEvent);
        eventAdded = true;
      }
    });
  }

  if (!eventAdded) {
    eventsArr.push({
      day: activeDay,
      month: month + 1,
      year: year,
      events: [newEvent],
    });
  }

  addEventWrapper.classList.remove("active");
  addEventTitle.value = "";
  addEventFrom.value = "";
  addEventTo.value = "";

  updateEvents(activeDay);

  const activeDayElem = document.querySelector(".day.active");
  if (!activeDayElem.classList.contains("event")) {
    activeDayElem.classList.add("event");
  }
});

function convertTime(time) {
  const timeArr = time.split(":");
  let timeHour = timeArr[0];
  let timeMin = timeArr[1];
  let timeFormat = timeHour >= 12 ? "PM" : "AM";

  timeHour = timeHour % 12 || 12;
  timeHour = timeHour < 10 ? `0${timeHour}` : timeHour;
  return `${timeHour}:${timeMin} ${timeFormat}`;
}

function saveEvents() {
  localStorage.setItem("events", JSON.stringify(eventsArr));
}

function getEvents() {
  if (localStorage.getItem("events")) {
    eventsArr.push(...JSON.parse(localStorage.getItem("events")));
  }
}
