import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  service: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  phone: { type: String, required: true }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
