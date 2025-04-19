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
  { type: "Haircut", duration: 30, practition: "hairStylist", code: "hrc" },
  {
    type: "Hair Wash & Blow Dry",
    duration: 45,
    practition: "hairStylist",
    code: "hwb",
  },
  {
    type: "Hair Coloring",
    duration: 90,
    practition: "hairStylist",
    code: "hcl",
  },
  {
    type: "Hair Styling",
    duration: 60,
    practition: "hairStylist",
    code: "hst",
  },
  {
    type: "Keratin Treatment",
    duration: 120,
    practition: "hairStylist",
    code: "krt",
  },
  {
    type: "Hair Extensions",
    duration: 150,
    practition: "hairStylist",
    code: "hex",
  },
  {
    type: "Basic Facial",
    duration: 45,
    practition: "esthetician",
    code: "bfc",
  },
  {
    type: "Deep Cleansing Facial",
    duration: 60,
    practition: "esthetician",
    code: "dcf",
  },
  {
    type: "Chemical Peel",
    duration: 30,
    practition: "esthetician",
    code: "chp",
  },
  {
    type: "Microdermabrasion",
    duration: 60,
    practition: "esthetician",
    code: "mdb",
  },
  {
    type: "Acne Treatment",
    duration: 75,
    practition: "esthetician",
    code: "act",
  },
  {
    type: "Anti-Aging Facial",
    duration: 90,
    practition: "esthetician",
    code: "aaf",
  },
  {
    type: "Basic Manicure",
    duration: 30,
    practition: "nailTechnician",
    code: "bmc",
  },
  {
    type: "Gel Manicure",
    duration: 45,
    practition: "nailTechnician",
    code: "gmc",
  },
  {
    type: "Acrylic Nails Full Set",
    duration: 90,
    practition: "nailTechnician",
    code: "anf",
  },
  {
    type: "Nail Art Design",
    duration: 60,
    practition: "nailTechnician",
    code: "nad",
  },
  { type: "Pedicure", duration: 45, practition: "nailTechnician", code: "pdc" },
  {
    type: "Gel Removal & Reapply",
    duration: 60,
    practition: "nailTechnician",
    code: "gra",
  },
];

//#region Dynamic values
const practitioners = [
  {
    name: "Repunzel",
    practition: "Hair Stylist",
    description: "Does hair",
    id: "hairStylist",
  },
  {
    name: "Anna",
    practition: "Esthetician",
    description: "Beauty Specialist",
    id: "esthetician",
  },
  {
    name: "Tiana",
    practition: "Nail Technician",
    description: "Manicures & Pedicures",
    id: "nailTechnician",
  },
];
const businessName = "A Salon";
const address = "123 Main Street, Cityville, ST 45678, Country";
const phone = "+2712 345 6789";
const email = "example@gmail.com";

//#endregion
window.addEventListener("load", () => {
  setpUpSite();
});

function setpUpSite() {
  document.querySelector("#bname").innerText = businessName;
  document.querySelector("#name").innerText = businessName;
  document.querySelector("#phone").innerText = phone;
  document.querySelector("#email").innerText = email;
  document.querySelector("#address").innerText = address;

  if (document.querySelector("#cards")) {
    setUpCards();
  }
  doEverythingElse();
}

function setUpCards() {
  let cardsList = document.querySelector("#cards");
  let container = document.createElement("div");
  container.classList.add("container");
  let cardsHolder = document.createElement("div");
  cardsHolder.id = "cardsHolder";
  cardsHolder.classList.add("row");

  practitioners.forEach((practition) => {
    //outside and card its self
    let outerCard = document.createElement("div");
    outerCard.classList = "col-md-6 col-lg-4 mb-4";
    let card = document.createElement("div");
    card.classList = "card h-100";
    let innerCard = document.createElement("div");
    innerCard.classList = "row g-0 h-100";

    //Image part of card
    let imageBox = document.createElement("div");
    imageBox.classList = "col-4";
    let image = document.createElement("img");
    image.classList = "img-fluid rounded-start h-100";
    image.src = `../Images/${practition.name.toLowerCase()}.jpg`;
    image.alt = practition.name;
    image.style.objectFit = "cover";
    imageBox.appendChild(image);
    innerCard.appendChild(imageBox);

    //text content of box
    let contentBox = document.createElement("div");
    contentBox.classList = "col-8";
    let contentBody = document.createElement("div");
    contentBody.classList = "card-body d-flex flex-column";

    let heading = document.createElement("h5");
    heading.classList = "card-title";
    heading.innerText = practition.practition;
    contentBody.appendChild(heading);

    let descrip = document.createElement("p");
    descrip.classList = "card-text";
    descrip.innerText = practition.description;
    contentBody.appendChild(descrip);

    let name = document.createElement("p");
    name.classList = "card-text";
    let small = document.createElement("small");
    small.classList = "text-body-secondary";
    small.innerText = practition.name;
    name.appendChild(small);
    contentBody.appendChild(name);

    let button = document.createElement("button");
    button.classList = "btn btn-primary mt-auto bookNow";
    button.id = practition.id;
    button.innerText = "Book Now";
    contentBody.appendChild(button);

    contentBox.appendChild(contentBody);
    innerCard.appendChild(contentBox);
    card.appendChild(innerCard);
    outerCard.appendChild(card);
    cardsHolder.appendChild(outerCard);
  });
  container.appendChild(cardsHolder);
  cardsList.appendChild(container);
}

//constructor function
function Booking(type, startTime, endTime, description, id) {
  this.type = type;
  this.startTime = startTime;
  this.endTime = endTime;
  this.description = description;
  this.id = id;
}

//function that gets the calendar events from the server
async function fetchEvents(practitioner, minDate, maxDate) {
  bookings = [];
  try {
    const response = await fetch(
      `http://localhost:5000/events?practitioner=${practitioner}&minDate=${minDate}&maxDate=${maxDate}`
    );
    const events = await response.json();
    //console.log("Upcoming Events:", events);

    events.forEach((event) => {
      const startTime = event.start.dateTime || event.start.date; // Date or DateTime
      const endTime = event.end.dateTime || event.end.date; // Date or DateTime

      var Appointment = new Booking(
        event.summary,
        startTime,
        endTime,
        event.description,
        event.id
      );
      bookings.push(Appointment);
    });
  } catch (error) {
    console.error("Error fetching events:", error);
  }
}

//function that inserts the event into the google calendar
async function createEvent(practitioner, summary, start, end, description) {
  const eventData = {
    practitioner: practitioner,
    summary: summary,
    startTime: start,
    endTime: end,
    description: description,
  };

  try {
    const response = await fetch("http://localhost:5000/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });
    const data = await response.json();
    //console.log("Event Created:", data);
  } catch (error) {
    console.error("Error creating event:", error);
  }
}

//function that deletes an event from the calendar
async function deleteEvent(practitioner, eventId) {
  try {
    const response = await fetch(
      `http://localhost:5000/events/${practitioner}/${eventId}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();
    //console.log(data);
  } catch (error) {
    console.error("Error deleting event:", error);
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
    const response = await fetch("http://localhost:5000/send-whatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messageData),
    });

    const data = await response.json();
    //console.log("WhatsApp message sent:", data);
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
  }
}

function doEverythingElse() {

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
      if(document.querySelector(".selected-slot")){
        document.querySelector(".selected-slot").classList.remove("selected-slot");
        let morn = document.querySelector("#morning");
        let children =  morn.children
        children.forEach(child =>{
          child.remove();
        });
      }
      if(document.querySelector(".selected")){
        document.querySelector(".selected").classList.remove("selected");
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

  function getSlots(date, bookings, slotsWithAvailability, duration) {
    const availableStartTimes = [];

    // Mark the booked slots as unavailable
    bookings.forEach((booking) => {
      const bookingDate = booking.startTime.split("T")[0]; // Extract YYYY-MM-DD

      if (bookingDate === date) {
        let startTime = booking.startTime.split("T")[1].substring(0, 5); // Get HH:mm
        let endTime = booking.endTime.split("T")[1].substring(0, 5); // Get HH:mm

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
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
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

        let description = `${fullCode}  Name: ${name}  Phone: ${phone}`;
        try {
          await createEvent(
            selectedPractition,
            appointName,
            formatedStartDate,
            formatedEndDate,
            description
          );
        } catch (err) {
          alert("Booking unsuccessful. Please try again");
          console.error(err);
        }

        let success = checkIfSuccess(fullCode, startD, endD);
        if (success) {
          let date = `${currentDate} at ${startTime}`;
          let phoneNum = `+27${phone.substring(1,phone.length)}`;
          sendMessage(name, fullCode, phoneNum, date);
        }
      });

    async function checkIfSuccess(fullCode, start, end) {
      await fetchEvents(selectedPractition, start, end);

      var successful = false;
      bookings.forEach((booking) => {
        let descrip = booking.description;
        let checkCode = descrip.substring(0, 13);

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
        let button = document.querySelector(".after");
        button.classList.remove("hiding");
        button.innerText = "Try again";
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
          await deleteEvent(practition, cBooking.id);
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
}
