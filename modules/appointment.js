import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    duration: { type: Number, required: true }, //in minutes
    practition: { type: String, required: true },
    code: { type: String, required: true },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
