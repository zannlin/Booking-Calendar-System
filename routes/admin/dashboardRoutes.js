import express from "express";
import Booking from "../modules/booking.js";


const router = express.Router();

// Total bookings per practitioner

router.get("/analytics/by-practitioner", async (req, res) => {
  try {
    const data = await Booking.aggregate([
      { $group: { _id: "$practitioner", total: { $sum: 1 } } },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bookings per service
router.get("/analytics/by-service", async (req, res) => {
  try {
    const data = await Booking.aggregate([
      { $group: { _id: "$service", total: { $sum: 1 } } },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bookings per month (for all practitioners)
router.get("/analytics/by-month", async (req, res) => {
  try {
    const data = await Booking.aggregate([
      {
        $group: {
          _id: { $month: "$startTime" },
          total: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 }, // So months appear in order
      },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get busiest times
router.get("/analytics/busiest-timeslots", async (req, res) => {
  try {
    const results = await Booking.aggregate([
      {
        $project: {
          time: {
            $dateToString: {
              format: "%H:%M",
              date: "$startTime",
              timezone: "Africa/Johannesburg", // Adjust for your timezone
            },
          },
        },
      },
      {
        $group: {
          _id: "$time",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          time: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    res.json(results);
  } catch (err) {
    console.error("Error fetching busiest time slots:", err);
    res.status(500).json({ error: err.message });
  }
});

// In your analytics route (e.g., analyticsRoutes.js or bookings.js)
router.get("/analytics/busiest-days", async (req, res) => {
  try {
    const results = await Booking.aggregate([
      {
        $group: {
          _id: { $dayOfWeek: "$startTime" }, // 1 = Sunday, 7 = Saturday
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 }, // Sort by most bookings
      },
    ]);

    res.json(results);
  } catch (err) {
    console.error("Error fetching busiest days of the week:", err);
    res.status(500).send("Server error");
  }
});

// Get repeat customers
router.get("/analytics/repeat-customers", async (req, res) => {
  try {
    const results = await Booking.aggregate([
      {
        $group: {
          _id: "$phone",
          name: { $first: "$name" },
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          count: { $gt: 1 }, // Only return customers with more than 1 booking
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get number of bookings per practitioner
router.get("/analytics/bookings-per-practitioner", async (req, res) => {
  try {
    const results = await Booking.aggregate([
      {
        $group: {
          _id: "$practitioner",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;