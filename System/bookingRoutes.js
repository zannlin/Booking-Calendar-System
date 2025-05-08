import express from "express";
import Booking from "./Booking.js";

const router = express.Router();

// Create a new booking
router.post("/", async (req, res) => {
  try {
    const { practitioner, code, name, service, date, time, phone } = req.body;

    // Ensure that the 'code' is included and is unique
    const existingBooking = await Booking.findOne({ code });
    if (existingBooking) {
      return res
        .status(400)
        .json({ error: "Booking with this code already exists" });
    }

    const booking = new Booking({
      code, // Save the custom event ID (code)
      name,
      practitioner,
      service,
      date,
      time,
      phone,
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a booking by custom eventId
router.delete("/:code", async (req, res) => {
  try {
    const { code } = req.params;

    // Check if the booking with the provided code exists
    const booking = await Booking.findOneAndDelete({ code });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (err) {
    console.error("Error deleting booking:", err);
    res.status(500).json({ error: "Failed to delete booking from database" });
  }
});

// Clear all bookings (use this for debugging/testing purposes)
router.delete("/clear", async (req, res) => {
  try {
    await Booking.deleteMany({});
    res.status(200).json({ message: "All bookings deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//#region analytics

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
          _id: { $month: "$date" },
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

// Get busiest days and times
router.get("/analytics/busiest-days-times", async (req, res) => {
  try {
    const results = await Booking.aggregate([
      {
        // Group by the day of the week and the hour from the time field
        $group: {
          _id: {
            dayOfWeek: { $dayOfWeek: "$date" }, // Group by day of the week (Sunday to Saturday)
            hour: { $hour: { $dateFromString: { dateString: "$time" } } }, // Parse the 'time' field as hour
          },
          count: { $sum: 1 }, // Count the number of bookings per group
        },
      },
      {
        $project: {
          dayOfWeek: "$_id.dayOfWeek", // Extract the day of the week
          hour: "$_id.hour", // Extract the hour
          count: 1, // Include the count
          _id: 0, // Don't include the default _id field
        },
      },
      {
        $sort: { count: -1 }, // Sort by the highest count first
      },
    ]);

    res.json(results);
  } catch (err) {
    console.error(err);  // Log the error for debugging
    res.status(500).json({ error: err.message });
  }
});


// Get repeat customers
router.get('/analytics/repeat-customers', async (req, res) => {
  try {
    const results = await Booking.aggregate([
      {
        $group: {
          _id: '$phone',
          name: { $first: '$name' },
          count: { $sum: 1 }
        }
      },
      {
        $match: {
          count: { $gt: 1 } // Only return customers with more than 1 booking
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get number of bookings per practitioner
router.get('/analytics/bookings-per-practitioner', async (req, res) => {
  try {
    const results = await Booking.aggregate([
      {
        $group: {
          _id: '$practitioner',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//#endregion

export default router;
