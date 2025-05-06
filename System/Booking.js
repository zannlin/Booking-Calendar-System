import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },  // Added 'code' field
  name: { type: String, required: true },
  service: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  phone: { type: String, required: true }
}, { timestamps: true });


const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
