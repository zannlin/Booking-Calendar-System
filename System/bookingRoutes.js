import express from "express";
import Booking from "./Booking.js";

const router = express.Router();

// Create a new booking
router.post("/", async (req, res) => {
  try {
    const { code, name, service, date, time, phone } = req.body;

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
router.delete("/:practitioner/:eventId", async (req, res) => {
  const { practitioner, eventId } = req.params;

  try {
    // Find and delete booking in MongoDB
    const deletedBooking = await Booking.findOneAndDelete({ _id: eventId });

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Now delete the event from Google Calendar
    await deleteGoogleCalendarEvent(practitioner, eventId); // Assuming this function is already defined for Google Calendar deletion

    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting event" });
  }
});

// Clear all bookings (use this for debugging/testing purposes)
router.delete("/clear", async (req, res) => {
  try {
    await Booking.deleteMany({}); // Deletes all bookings
    res.status(200).json({ message: "All bookings deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
