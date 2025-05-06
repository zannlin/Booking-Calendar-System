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
router.delete('/clear', async (req, res) => {
  try {
    await Booking.deleteMany({});
    res.status(200).json({ message: "All bookings deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
