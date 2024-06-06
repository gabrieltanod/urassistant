const hamBurger = document.querySelector(".toggle-btn");

hamBurger.addEventListener("click", function () {
  document.querySelector("#sidebar").classList.toggle("expand");
});

/* script.js */
function openTab(evt, tabName) {
  const tabContents = document.querySelectorAll(".tab-content");
  const tabLinks = document.querySelectorAll(".tab-link");

  tabContents.forEach((content) => (content.style.display = "none"));
  tabLinks.forEach((link) => link.classList.remove("active"));

  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.classList.add("active");
}

function showAddReminderForm() {
  document.getElementById("add-reminder-form").style.display = "block";
}

function navigateToCalendar() {
  window.location.href = "calendar.html";
}

function addReminder() {
  const title = document.getElementById("reminder-title").value;
  const date = document.getElementById("reminder-date").value;
  const reminder = { title, date };

  // Add reminder to appropriate list
  if (!date) {
    addReminderToList("all-reminders", reminder);
  } else if (new Date(date).toDateString() === new Date().toDateString()) {
    addReminderToList("today-reminders", reminder);
    addReminderToList("main-today-reminders", reminder);
  } else {
    addReminderToList("scheduled-reminders", reminder);
  }

  // Reset form
  document.getElementById("reminder-title").value = "";
  document.getElementById("reminder-date").value = "";
  document.getElementById("add-reminder-form").style.display = "none";
}

function addReminderToList(listId, reminder) {
  const list = document.getElementById(listId);
  const listItem = document.createElement("li");
  listItem.textContent = `${reminder.title} ${
    reminder.date ? "- " + reminder.date : ""
  }`;
  list.appendChild(listItem);
}

// Initialize with the first tab open
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".tab-link").click();
});
