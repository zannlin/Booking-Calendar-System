import express from "express";
import Booking from "../modules/Booking.js";

const router = express.Router();

// Get all bookings
router.get("/", async (req, res) => {
  const { practitioner, minDate, maxDate } = req.query;

  const query = {};

  if (practitioner) {
    query.practitioner = practitioner;
  }

  if (minDate && maxDate) {
    const start = new Date(minDate);
    const end = new Date(maxDate);

    // Only add the filter if both dates are valid
    if (!isNaN(start) && !isNaN(end)) {
      query.startTime = { $gte: start, $lte: end };
    } else {
      return res.status(400).json({ error: "Invalid minDate or maxDate" });
    }
  }

  try {
    const bookings = await Booking.find(query).sort({ startTime: 1 });
    res.json(bookings);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch bookings", details: err.message });
  }
});

// Create a new booking
router.post("/add", async (req, res) => {
  try {
    const { practitioner, code, name, service, startTime, endTime, phone } =
      req.body;

    if (
      !code ||
      !name ||
      !practitioner ||
      !service ||
      !startTime ||
      !endTime ||
      !phone
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }
    // Check for booking conflicts
    const conflict = await Booking.findOne({
      practitioner,
      $or: [
        { startTime: { $lt: new Date(endTime), $gte: new Date(startTime) } },
        { endTime: { $gt: new Date(startTime), $lte: new Date(endTime) } },
        {
          $and: [
            { startTime: { $lte: new Date(startTime) } },
            { endTime: { $gte: new Date(endTime) } },
          ],
        },
      ],
    });

    if (conflict) {
      return res
        .status(409)
        .json({ error: "Time slot already booked for this practitioner" });
    }

    // Ensure that the 'code' is included and is unique
    const existing = await Booking.findOne({ code });
    if (existing) {
      return res
        .status(400)
        .json({ error: "Booking with this code already exists" });
    }

    const booking = new Booking({
      code, // Save the custom event ID (code)
      name,
      practitioner,
      service,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      phone,
    });

    await booking.save();
    console.log("Booking created:", booking);
    res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    console.error("Error creating booking:", err);
    res
      .status(500)
      .json({ error: "Failed to create booking", details: err.message });
  }
});

// Delete a booking by custom eventId
router.delete("/delete/:code", async (req, res) => {
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
router.delete("/byeHaveaGreateTime", async (req, res) => {
  try {
    await Booking.deleteMany({});
    res.status(200).json({ message: "All bookings deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
