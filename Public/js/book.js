var bookings = [];
const timeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
];
const timeOff = "tmo";
const appointmentTypes = [
  { type: "Haircut", duration: 30, practition: "Hair Stylist", code: "hrc" },
  {
    type: "Hair Wash & Blow Dry",
    duration: 45,
    practition: "Hair Stylist",
    code: "hwb",
  },
  {
    type: "Hair Coloring",
    duration: 90,
    practition: "Hair Stylist",
    code: "hcl",
  },
  {
    type: "Hair Styling",
    duration: 60,
    practition: "Hair Stylist",
    code: "hst",
  },
  {
    type: "Keratin Treatment",
    duration: 120,
    practition: "Hair Stylist",
    code: "krt",
  },
  {
    type: "Hair Extensions",
    duration: 150,
    practition: "Hair Stylist",
    code: "hex",
  },
  {
    type: "Basic Facial",
    duration: 45,
    practition: "Esthetician",
    code: "bfc",
  },
  {
    type: "Deep Cleansing Facial",
    duration: 60,
    practition: "Esthetician",
    code: "dcf",
  },
  {
    type: "Chemical Peel",
    duration: 30,
    practition: "Esthetician",
    code: "chp",
  },
  {
    type: "Microdermabrasion",
    duration: 60,
    practition: "Esthetician",
    code: "mdb",
  },
  {
    type: "Acne Treatment",
    duration: 75,
    practition: "Esthetician",
    code: "act",
  },
  {
    type: "Anti-Aging Facial",
    duration: 90,
    practition: "Esthetician",
    code: "aaf",
  },
  {
    type: "Basic Manicure",
    duration: 30,
    practition: "Nail Technician",
    code: "bmc",
  },
  {
    type: "Gel Manicure",
    duration: 45,
    practition: "Nail Technician",
    code: "gmc",
  },
  {
    type: "Acrylic Nails Full Set",
    duration: 90,
    practition: "Nail Technician",
    code: "anf",
  },
  {
    type: "Nail Art Design",
    duration: 60,
    practition: "Nail Technician",
    code: "nad",
  },
  {
    type: "Pedicure",
    duration: 45,
    practition: "Nail Technician",
    code: "pdc",
  },
  {
    type: "Gel Removal & Reapply",
    duration: 60,
    practition: "Nail Technician",
    code: "gra",
  },
];

function setpUpSite() {
  if (document.querySelector("#cards")) {
    setUpCards();
  }
}

//constructor function
class Booking {
  constructor(name, startTime, endTime, service, code) {
    this.name = name;
    this.startTime = startTime;
    this.endTime = endTime;
    this.service = service;
    this.code = code;
  }
}

//function that gets the calendar events from the server
async function fetchEvents(practitioner, minDate, maxDate) {
  bookings = [];
  console.log(`MinDate: ${minDate}, MaxDate: ${maxDate}`);
  try {
    const response = await fetch(
      `http://localhost:5000/api/bookings?practitioner=${practitioner}&minDate=${minDate}&maxDate=${maxDate}`
    );
    const events = await response.json();

    events.forEach((event) => {
      var appointment = new Booking(
        event.name,
        event.startTime,
        event.endTime,
        event.service,
        event.code
      );
      bookings.push(appointment);
    });
    //console.log(bookings);
  } catch (error) {
    console.error("Error fetching events:", error);
  }
}

//function that inserts the event into the google calendar
async function createEvent(
  practitioner,
  service,
  startTime,
  endTime,
  name,
  phone,
  code
) {
  const bookingData = {
    code,
    name,
    practitioner,
    service,
    startTime,
    endTime,
    phone,
  };

  console.log("Booking data:", bookingData);

  try {
    const bookingResponse = await fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });
    const bookingResult = await bookingResponse.json();

    if (bookingResponse.ok) {
      console.log("Event created and booking saved:", {
        mongoBooking: bookingResult,
      });
    } else {
      console.error(
        "Failed to save data:",
        bookingResult.error || bookingResult
      );
    }
  } catch (error) {
    console.error("Error creating event:", error);
  }
}

//function that deletes an event from the database
async function deleteEvent(bookingId) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/bookings/${bookingId}`,
      {
        method: "DELETE",
      }
    );

    const result = await response.json();

    if (response.ok) {
      console.log("Booking successfully deleted:", result);
    } else {
      console.error("Failed to delete booking:", result.error || result);
    }
  } catch (error) {
    console.error("Error deleting booking:", error);
  }
}

async function sendMessage(name, code, number, date) {
  const messageData = {
    name: name,
    phoneNumber: number,
    bookingCode: code,
    date: date,
  };

  try {
    const response = await fetch(
      "http://localhost:5000/api/whatsapp/send-whatsapp",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      }
    );

    const data = await response.json();
    //console.log("WhatsApp message sent:", data);
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
  }
}
document.addEventListener("DOMContentLoaded", function () {
  //#region Section tracker
  var selectedPractition = "";
  var sectionCounter = 0;
  const sections = ["cards", "apointType", "calendar", "former"];
  //When book now button is clicked
  document.querySelectorAll(".cards button").forEach(function (item) {
    item.addEventListener("click", function () {
      document.querySelector(".pagination").classList.remove("hiding");
      selectedPractition = item.id;
      checkCompletion("next");
    });
  });
  if (document.querySelector("#prev")) {
    document.querySelector("#prev").addEventListener("click", function () {
      checkCompletion("prev");
    });

    document.querySelector("#next").addEventListener("click", function () {
      checkCompletion("next");
    });
  }

  //checks at which phase of the booking process the system is at
  function checkCompletion(side) {
    if (side == "next") {
      document
        .querySelector(`#${sections[sectionCounter]}`)
        .classList.add("hiding");
      sectionCounter++;
      document
        .querySelector(`#${sections[sectionCounter]}`)
        .classList.remove("hiding");
    } else if (side == "prev") {
      document
        .querySelector(`#${sections[sectionCounter]}`)
        .classList.add("hiding");
      sectionCounter--;
      document
        .querySelector(`#${sections[sectionCounter]}`)
        .classList.remove("hiding");
    }

    if (sectionCounter == 3) {
      document.querySelector("#next").classList.add("hiding");
    } else {
      document.querySelector("#next").classList.remove("hiding");
    }

    if (sectionCounter == 2) {
    }

    if (sectionCounter == 0) {
      document.querySelector(".pagination").classList.add("hiding");
    }
    document.querySelector("#next").classList.add("disabled");
    whatToLoad();
  }

  function whatToLoad() {
    if (sectionCounter == 1) {
      getAppointmentTypes();
    } else if (sectionCounter == 2) {
      // Deselect previously selected slot
      const selectedSlot = document.querySelector(".selected-slot");
      if (selectedSlot) {
        selectedSlot.classList.remove("selected-slot");
      }

      // Clear morning slots
      const morn = document.querySelector("#morning");
      if (morn) {
        // Convert children to array to use forEach
        Array.from(morn.children).forEach((child) => {
          child.remove();
        });
      }

      // Deselect selected date (if any)
      const selected = document.querySelector(".selected");
      if (selected) {
        selected.classList.remove("selected");
      }

      // Initial Render
      updateCalendar();
    }
  }

  //#endregion

  //#region Appointment types

  var appointName = "";
  //fill the list with appointment types based on the practition selected
  function getAppointmentTypes() {
    var box = document.querySelector("#apointList");
    box.innerHTML = "";
    appointmentTypes.forEach((appoint) => {
      if (appoint.practition == selectedPractition) {
        var button = document.createElement("button");
        button.innerHTML = appoint.type;
        button.classList.add("list-group-item");
        box.appendChild(button);
      }
    });
    addListEventListener();
  }

  //mainly used to ensure that only one type can be selected
  function addListEventListener() {
    document.querySelectorAll(".list-group-item").forEach((item) => {
      item.addEventListener("click", () => {
        document
          .querySelectorAll(".list-group-item")
          .forEach((s) => s.classList.remove("selected-slot"));
        item.classList.add("selected-slot");
        appointName = item.innerText;
        document.querySelector("#next").classList.remove("disabled");
      });
    });
  }

  //#endregion

  //#region Timeslots
  let slotsAvail = [];
  let currentDate = "";
  //creating the time slots
  function getTimeSlots(day) {
    var monthT;
    var dayT;
    if (currentMonth + 1 < 10) {
      monthT = `0${currentMonth + 1}`;
    } else monthT = currentMonth + 1;
    if (day < 10) {
      dayT = `0${day}`;
    } else dayT = day;
    var selectedDate = `${currentYear}-${monthT}-${dayT}`;
    currentDate = selectedDate;
    var duration = getDurationByType(appointName);

    slotsAvail = structuredClone(
      getSlots(selectedDate, bookings, availableSlots, duration)
    );

    genereateTimeSlots();
  }

  function getDurationByType(appointmentType) {
    const appointment = appointmentTypes.find(
      (item) => item.type === appointmentType
    );
    return appointment ? appointment.duration : null;
  }

  //Fills the list of time slots with elements contianing slots
  function genereateTimeSlots() {
    document.querySelector("#morning").innerHTML = "";
    document.querySelector("#afternoon").innerHTML = "";
    slotsAvail.forEach((slot) => {
      if (slot != null) {
        let cell = document.createElement("div");
        cell.innerHTML = slot;
        cell.classList.add("time-slot");
        let time = slot.substring(0, 2);
        if (Number(time) < 12) {
          let box = document.querySelector("#morning");
          box.appendChild(cell);
        } else {
          let box = document.querySelector("#afternoon");
          box.appendChild(cell);
        }
      }
    });
  }

  function toLocalISOStringWithOffset(date, offsetMinutes) {
    const tzOffset = offsetMinutes ?? date.getTimezoneOffset(); // in minutes
    const localDate = new Date(date.getTime() - tzOffset * 60000);

    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const day = String(localDate.getDate()).padStart(2, "0");
    const hours = String(localDate.getHours()).padStart(2, "0");
    const minutes = String(localDate.getMinutes()).padStart(2, "0");
    const seconds = String(localDate.getSeconds()).padStart(2, "0");

    const sign = tzOffset > 0 ? "-" : "+";
    const absOffset = Math.abs(tzOffset);
    const offsetHours = String(Math.floor(absOffset / 60)).padStart(2, "0");
    const offsetMins = String(absOffset % 60).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${offsetHours}:${offsetMins}`;
  }

  function getSlots(date, bookings, slotsWithAvailability, duration) {
    const availableStartTimes = [];

    // Mark the booked slots as unavailable
    bookings.forEach((booking) => {
      const bookingStart = new Date(booking.startTime);
      const bookingEnd = new Date(booking.endTime);
      const bookingDate = bookingStart.toISOString().split("T")[0]; // Extract YYYY-MM-DD

      if (bookingDate === date) {
        let startTime = `${bookingStart
          .getHours()
          .toString()
          .padStart(2, "0")}:${bookingStart
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;
        let endTime = `${bookingEnd
          .getHours()
          .toString()
          .padStart(2, "0")}:${bookingEnd
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;

        let currentSlot = startTime;
        while (currentSlot < endTime) {
          let index = slotsWithAvailability.indexOf(currentSlot);
          if (index !== -1) {
            slotsWithAvailability[index] = null; // Mark as unavailable
          }
          currentSlot = incrementTimeSlot(currentSlot); // Move to next 30-minute slot
        }
      }
    });

    // Check for available start time slots for the given duration
    for (let i = 0; i <= slotsWithAvailability.length - duration / 30; i++) {
      let allSlotsAvailable = true;

      // Check if enough continuous slots are available for the duration
      for (let j = i; j < i + duration / 30; j++) {
        if (slotsWithAvailability[j] === null) {
          allSlotsAvailable = false;
          break;
        }
      }

      // If all slots are available, add the start time to the result array
      if (allSlotsAvailable) {
        availableStartTimes.push(slotsWithAvailability[i]);
      }
    }

    return availableStartTimes;
  }

  // Helper function to increment time by 30 minutes
  function incrementTimeSlot(time) {
    let [hours, minutes] = time.split(":").map(Number);
    minutes += 30;
    if (minutes >= 60) {
      minutes = 0;
      hours += 1;
    }
    return `${String(hours).padStart(
      2,
      "0"
    )}:${String(minutes).padStart(2, "0")}`;
  }

  //adds the event listner of the time slot option buttons
  function addSlotsListner() {
    document.querySelectorAll(".time-slot").forEach((slot) => {
      slot.addEventListener("click", function () {
        document
          .querySelectorAll(".time-slot")
          .forEach((s) => s.classList.remove("selected-slot"));
        this.classList.add("selected-slot");
        document.querySelector("#next").classList.remove("disabled");
      });
    });
  }

  //#endregion

  //#region Calendar
  function generateCalendar(year, month) {
    let firstDay = (new Date(year, month, 1).getDay() + 6) % 7; // Adjust to Monday start
    let daysInMonth = new Date(year, month + 1, 0).getDate(); // Total days in month

    let calendar = [];
    let dayCounter = 1;

    for (let week = 0; week < 6; week++) {
      let row = [];
      for (let day = 0; day < 7; day++) {
        if (week === 0 && day < firstDay) {
          row.push(null); // Empty slots before first day
        } else if (dayCounter > daysInMonth) {
          row.push(null); // Empty slots after month ends
        } else {
          row.push(dayCounter++);
        }
      }
      calendar.push(row);
      if (dayCounter > daysInMonth) break;
    }
    return calendar;
  }

  let currentYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth();

  function toISODateString(date) {
    return new Date(date).toISOString();
  }

  var startD;
  var endD;
  async function updateCalendar() {
    let calendarData = generateCalendar(currentYear, currentMonth);
    let today = new Date(); // Get today's date
    let currentDay = today.getDate();
    let currentMonthCheck = today.getMonth();
    let currentYearCheck = today.getFullYear();
    var start = toISODateString(new Date(currentYear, currentMonth, 1));
    var end = toISODateString(new Date(currentYear, currentMonth + 1, 0, 23));
    startD = start;
    endD = end;

    bookings = [];
    await fetchEvents(selectedPractition, start, end);

    document.getElementById("monthYear").innerText = new Date(
      currentYear,
      currentMonth
    ).toLocaleString("default", { month: "long", year: "numeric" });
    let tbody = document.getElementById("calendarBody");
    tbody.innerHTML = ""; // Clear previous data

    calendarData.forEach((week) => {
      let row = document.createElement("tr");
      week.forEach((day) => {
        let cell = document.createElement("td");
        if (day) {
          cell.innerText = day;
          cell.classList.add("day");
          // Disable past days
          if (
            (currentYear === currentYearCheck &&
              currentMonth === currentMonthCheck &&
              day < currentDay) ||
            currentYear < currentYearCheck ||
            (currentYear === currentYearCheck &&
              currentMonth < currentMonthCheck)
          ) {
            cell.classList.add("disabled");
          }
        }
        row.appendChild(cell);
      });
      tbody.appendChild(row);
    });
  }
  var availableSlots;
  // Add styles to prevent clicking on disabled days
  if (document.getElementById("calendarBody")) {
    document
      .getElementById("calendarBody")
      .addEventListener("click", function (e) {
        if (
          e.target.tagName === "TD" &&
          e.target.innerText &&
          !e.target.classList.contains("disabled")
        ) {
          document
            .querySelectorAll("td")
            .forEach((td) => td.classList.remove("selected"));
          e.target.classList.add("selected");
          document
            .querySelector("#time-slots-container")
            .classList.remove("hiding");
          availableSlots = structuredClone(timeSlots);
          getTimeSlots(e.target.innerHTML);
          document.querySelector("#next").classList.add("disabled");
          addSlotsListner();
        }
      });

    // Navigation
    document.getElementById("prevMonth").addEventListener("click", () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      document.querySelector("#next").classList.add("disabled");
      document.querySelector("#time-slots-container").classList.add("hiding");
      updateCalendar();
    });

    document.getElementById("nextMonth").addEventListener("click", () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      document.querySelector("#next").classList.add("disabled");
      document.querySelector("#time-slots-container").classList.add("hiding");
      updateCalendar();
    });
  }
  //#endregion

  //#region Confirm booking
  //prevent form from refreshing page and letting user know if booking was successful
  let startTime = "";
  if (document.getElementById("former")) {
    document
      .getElementById("former")
      .addEventListener("submit", async function (event) {
        event.preventDefault();

        document.querySelector(".pagination").innerHTML = "";
        const name = document.getElementById("floatingInput").value;
        const phone = document.getElementById("floatingTel").value;

        var duration = getDurationByType(appointName);

        let selectedSlot = document.querySelector("#calendar .selected-slot");
        startTime = selectedSlot.innerText;

        let endTime = addMinutesToTime(startTime, duration);
        let formatedStartDate = `${currentDate}T${startTime}:00+02:00`;
        let formatedEndDate = `${currentDate}T${endTime}:00+02:00`;
        let code = "";
        appointmentTypes.forEach((appoint) => {
          if (appoint.type == appointName) {
            code = appoint.code;
          }
        });
        let fullCode = `${code}${currentDate.substring(
          2,
          4
        )}${currentDate.substring(5, 7)}${currentDate.substring(
          8,
          10
        )}${startTime.substring(0, 2)}${startTime.substring(3, 5)}`;
        try {
          await createEvent(
            selectedPractition,
            appointName,
            formatedStartDate,
            formatedEndDate,
            name,
            phone,
            fullCode
          );
        } catch (err) {
          alert("Booking unsuccessful. Please try again");
          console.error(err);
        }

        let success = await checkIfSuccess(
          fullCode,
          formatedStartDate,
          formatedEndDate
        );
        if (success) {
          let date = `${currentDate} at ${startTime}`;
          let phoneNum = `+27${phone.substring(1, phone.length)}`;
          sendMessage(name, fullCode, phoneNum, date);
        }
      });

    async function checkIfSuccess(fullCode, start, end) {
      let dayStart = `${currentDate}T00:00:00.000Z`;
      let dayEnd = `${currentDate}T23:59:59.999Z`;
      await fetchEvents(selectedPractition, dayStart, dayEnd);

      var successful = false;
      bookings.forEach((booking) => {
        let checkCode = booking.code;

        if (fullCode == checkCode) {
          successful = true;
        }
      });

      if (successful) {
        document.querySelectorAll(".remove").forEach((item) => {
          item.classList.add("hiding");
        });
        const area = document.querySelector("#bookingStatus");
        area.innerText = "Booking Successful";
        area.classList.remove("hiding");
        area.classList.add("success");
        document.querySelector("#code").classList.remove("hiding");
        document.querySelector(
          "#code"
        ).innerText = `Appointment made for:\n${currentDate} at ${startTime}\n\nAppointment code:\n`;
        let codeBox = document.createElement("div");
        codeBox.id = "codeBox";
        codeBox.innerText = fullCode;
        codeBox.style.fontWeight = "bold";
        document.querySelector("#code").appendChild(codeBox);
        let button = document.querySelector("#cont");
        button.classList.remove("hiding");
        return true;
      } else {
        document.querySelectorAll(".remove").forEach((item) => {
          item.classList.add("hiding");
        });
        const area = document.querySelector("#bookingStatus");
        area.innerText = "Booking was unsuccessful";
        area.classList.remove("hiding");
        area.classList.add("unsuccess");
        return false;
      }
    }
    document.getElementById("former").reset();

    //reloads page
    document.querySelector("#cont").addEventListener("click", () => {
      location.reload();
    });

    //adds the duration of an event to the start time
    function addMinutesToTime(time, minutesToAdd) {
      let [hours, minutes] = time.split(":").map(Number);
      minutes += minutesToAdd;

      while (minutes >= 60) {
        minutes -= 60;
        hours += 1;
      }

      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}`;
    }
  }
  //#endregion

  //#region Cancelations
  let code = "";
  let cBooking = {
    type: "Hair Wash & Blow Dry",
  };
  let practition = "";
  if (document.querySelector("#cancel")) {
    document
      .querySelector("#cancel")
      .addEventListener("submit", async function (event) {
        event.preventDefault();
        let input = document.querySelector("#bookCode").value;
        code = input;
        let dates = getDatesFromCode(code);
        let appointCode = code.substring(0, 3);

        appointmentTypes.forEach((type) => {
          if (type.code == appointCode) {
            practition = type.practition;
          }
        });

        await fetchEvents(practition, dates[0], dates[1]);

        var successful = false;
        bookings.forEach((booking) => {
          let descrip = booking.description;
          let checkCode = descrip.substring(0, 13);

          if (code == checkCode) {
            successful = true;
            cBooking = booking;
          }
        });

        if (successful) {
          document.querySelector("#texting").remove();
          document.querySelector("#searchCode").remove();
          let space = document.querySelector("#letKnower");
          space.classList.remove("hiding");
          document.querySelector("#selector").classList.remove("hiding");
          space.innerText = "Appointment found.";
        } else {
          let space = document.querySelector("#letKnower");
          space.classList.remove("hiding");
          space.innerText = "Appointment not found.";
          document.querySelector("form").reset();
        }
      });
  }

  function getDatesFromCode(code) {
    let year = `20${code.substring(3, 5)}`;
    let month = code.substring(5, 7);
    let day = parseInt(code.substring(7, 9));

    let sday = "";
    let eday = "";

    sday = String(day - 1).padStart(2, "0");
    eday = String(day + 1).padStart(2, "0");

    let start = `${year}-${month}-${sday}T12:00`;
    let end = `${year}-${month}-${eday}T12:00`;
    return [start, end];
  }

  if (document.querySelector("#deletebook")) {
    document
      .querySelector("#deletebook")
      .addEventListener("click", async () => {
        if (cBooking.id) {
          await deleteEvent(practition, cBooking.id, code);
        }

        let dates = getDatesFromCode(code);
        await fetchEvents(practition, dates[0], dates[1]);

        var successful = true;
        bookings.forEach((booking) => {
          if (booking.id == cBooking.id) {
            successful = false;
          }
        });

        if (successful) {
          if (
            document.querySelector("#letKnower").innerText !=
            "Appointment canceled unsuccessful"
          ) {
            document.querySelector("#letKnower").innerText =
              "Appointment canceled successfully";
          }

          document.querySelector("#deletebook").remove();
        } else {
          document.querySelector("#letKnower").innerText =
            "Appointment canceled unsuccessful";
        }
      });
  }

  if (document.querySelector("#closeBtn")) {
    document.querySelector("#closeBtn").addEventListener("click", () => {
      location.reload();
    });
  }

  //#endregion
});
