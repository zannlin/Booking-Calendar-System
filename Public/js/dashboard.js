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

// === 2. Chart: Busiest Times ===
async function loadBusiestTimesChart() {
  const data = await fetchData(
    "http://localhost:5000/api/bookings/analytics/busiest-days-times"
  );

  // Map the dayOfWeek to its string representation (Sun, Mon, etc.)
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Map the data to create labels in the format "Day X, Hour: 00"
  const labels = data.map(
    (item) => `${daysOfWeek[item.dayOfWeek - 1]}, ${item.hour}:00`
  );

  // Extract the counts for each day/time combination
  const counts = data.map((item) => item.count);

  console.log("Busiest Times Raw Data:", data);

  // Create the chart
  new Chart(document.getElementById("busiestTimesChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Bookings",
          data: counts,
          backgroundColor: "rgba(54, 162, 235, 0.6)", // Blue color for the bars
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Ensures chart adapts to container size
      aspectRatio: 1, // Optional: Specific aspect ratio
      scales: {
        x: {
          title: {
            display: true,
            text: "Day of Week and Hour", // X-axis label
          },
        },
        y: {
          title: {
            display: true,
            text: "Booking Count", // Y-axis label
          },
        },
      },
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
  const [busiest, services, repeatCustomers, allBookings] = await Promise.all([
    fetchData(
      "http://localhost:5000/api/bookings/analytics/busiest-days-times"
    ),
    fetchData("http://localhost:5000/api/bookings/analytics/by-service"),
    fetchData("http://localhost:5000/api/bookings/analytics/repeat-customers"),
    fetchData("http://localhost:5000/api/bookings"),
  ]);

  const insights = [];

  // Most common day/time
  if (busiest.length) {
    const { dayOfWeek, hour } = busiest[0];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    insights.push(
      `📈 Peak booking time is ${days[dayOfWeek % 7]} at ${hour}:00.`
    );
  }

  // Dominant service
  const totalServices = services.reduce((sum, s) => sum + s.total, 0);
  if (services[0] && services[0].total / totalServices > 0.5) {
    insights.push(
      `🔥 ${services[0]._id} is currently trending (over 50% of bookings).`
    );
  }

  // Repeat customer ratio
  const repeatRatio = (repeatCustomers.length / allBookings.length) * 100;
  if (repeatRatio > 30) {
    insights.push(
      `🔁 ${repeatRatio.toFixed(1)}% of bookings are from repeat customers.`
    );
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

// === INIT ===
loadTopMetrics();
//loadBusiestTimesChart();
loadPractitionerChart();
loadRecentBookings();
showInsights();
generateAutomatedInsights();
