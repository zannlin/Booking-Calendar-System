import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true }, // for linking with calendar
    name: { type: String, required: true },
    practitioner: { type: String, required: true },
    service: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
