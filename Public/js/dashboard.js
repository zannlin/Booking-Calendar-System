// === Utility Fetch Function ===
async function fetchData(url) {
  const res = await fetch(url);
  return await res.json();
}

// === 1. Load Top Metrics ===
async function loadTopMetrics() {
  const [byService, repeatCustomers, allBookings] = await Promise.all([
    fetchData("http://localhost:5000/api/bookings/analytics/by-service"),
    fetchData("http://localhost:5000/api/bookings/analytics/repeat-customers"),
    fetchData("http://localhost:5000/api/bookings"),
  ]);

  // Total bookings this month
  const currentMonth = new Date().getMonth();
  const thisMonthBookings = allBookings.filter(
    (b) => new Date(b.date).getMonth() === currentMonth
  );
  document.getElementById("totalBookings").textContent =
    thisMonthBookings.length;

  // Repeat Customers
  document.getElementById("repeatCustomers").textContent =
    repeatCustomers.length;

  // Average lead time
  const leadTimes = allBookings.map((b) => {
    const bookingDate = new Date(b.date);
    const createdDate = new Date(b.createdAt || bookingDate); // fallback
    return (bookingDate - createdDate) / (1000 * 60 * 60 * 24); // days
  });
  const avgLeadTime = leadTimes.length
    ? (leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length).toFixed(1)
    : "-";
  document.getElementById("avgLeadTime").textContent = `${avgLeadTime} days`;

  // Top service
  const topService = byService[0]?._id || "-";
  document.getElementById("topService").textContent = topService;
}

async function loadBusiestTimeslotsChart() {
  const data = await fetchData(
    "http://localhost:5000/api/bookings/analytics/busiest-timeslots"
  );

  if (!Array.isArray(data)) {
    console.error("Invalid data format:", data);
    return;
  }

  const labels = data.map((item) => item.time.split("+")[0].slice(0, 5));
  const counts = data.map((item) => item.count); // e.g., 5 bookings

  new Chart(document.getElementById("busiestTimeslotsChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Bookings per Time Slot",
          data: counts,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

// === 3. Chart: Bookings per Practitioner ===
async function loadPractitionerChart() {
  const data = await fetchData(
    "http://localhost:5000/api/bookings/analytics/bookings-per-practitioner"
  );

  new Chart(document.getElementById("practitionerChart"), {
    type: "pie",
    data: {
      labels: data.map((d) => d._id || "Unknown"),
      datasets: [
        {
          data: data.map((d) => d.count),
          backgroundColor: [
            "#ff6384",
            "#36a2eb",
            "#ffcd56",
            "#4bc0c0",
            "#9966ff",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 1, // Optional: Set a specific aspect ratio
    },
  });
}

// === 5. Load Recent Bookings ===
async function loadRecentBookings() {
  const bookings = await fetchData("http://localhost:5000/api/bookings");
  const recent = bookings.slice(-5).reverse(); // show latest 5
  const list = document.getElementById("recentBookings");
  list.innerHTML = "";

  recent.forEach((b) => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = `${b.name} - ${b.service} (${new Date(
      b.date
    ).toLocaleString()})`;
    list.appendChild(li);
  });
}

// === 6. Display Insight (Optional Placeholder) ===
function showInsights() {
  const text = ``;
  document.getElementById("insightText").textContent = text;
}

async function generateAutomatedInsights() {
  const [busiestTimes, services, repeatCustomers, allBookings] = await Promise.all([
    fetchData("http://localhost:5000/api/bookings/analytics/busiest-timeslots"),
    fetchData("http://localhost:5000/api/bookings/analytics/by-service"),
    fetchData("http://localhost:5000/api/bookings/analytics/repeat-customers"),
    fetchData("http://localhost:5000/api/bookings"),
  ]);

  const insights = [];

  // Peak time slot
  if (busiestTimes.length && busiestTimes[0].time) {
    const topTime = busiestTimes[0].time.split("+")[0].slice(0, 5); // Clean "HH:MM"
    insights.push(`⏰ Most popular booking time is ${topTime}.`);

    // Optional: show next top slots
    if (busiestTimes.length >= 3) {
      const nextTop = busiestTimes.slice(1, 3)
        .map(item => item.time.split("+")[0].slice(0, 5))
        .join(" and ");
      insights.push(`📅 Other busy slots: ${nextTop}.`);
    }
  }

  // Dominant service
  const totalServices = services.reduce((sum, s) => sum + s.total, 0);
  if (services[0] && services[0].total / totalServices > 0.5) {
    insights.push(`🔥 ${services[0]._id} is currently trending (over 50% of bookings).`);
  }

  // Repeat customer ratio
  const repeatRatio = (repeatCustomers.length / allBookings.length) * 100;
  if (repeatRatio > 30) {
    insights.push(`🔁 ${repeatRatio.toFixed(1)}% of bookings are from repeat customers.`);
  }

  // Booking growth comparison
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const thisMonth = allBookings.filter(
    (b) =>
      new Date(b.date).getMonth() === month &&
      new Date(b.date).getFullYear() === year
  );
  const lastMonth = allBookings.filter(
    (b) =>
      new Date(b.date).getMonth() === month - 1 &&
      new Date(b.date).getFullYear() === year
  );
  if (lastMonth.length && thisMonth.length > lastMonth.length) {
    const growth =
      ((thisMonth.length - lastMonth.length) / lastMonth.length) * 100;
    insights.push(`📊 Bookings increased by ${growth.toFixed(1)}% this month.`);
  }

  document.getElementById("insightText").innerHTML = insights.join("<br>");
}

async function loadBusiestDaysChart() {
  const data = await fetchData("http://localhost:5000/api/bookings/analytics/busiest-days");
  
  // Day name mapping (MongoDB: 1 = Sun, 7 = Sat)
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const labels = data.map(item => dayLabels[item._id - 1]); // _id is day number
  const counts = data.map(item => item.count);

  new Chart(document.getElementById("busiestDaysChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Bookings",
          data: counts,
          backgroundColor: "rgba(255, 99, 132, 0.6)",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Busiest Days of the Week"
        },
      },
    },
  });
}


// === INIT ===
loadTopMetrics();
loadPractitionerChart();
loadRecentBookings();
showInsights();
loadBusiestTimeslotsChart();
loadBusiestDaysChart();
generateAutomatedInsights();
