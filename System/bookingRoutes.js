import express from 'express';
import Booking from './Booking.js';

const router = express.Router();

// Create a new booking
router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
