import express from "express";
import Appointment from "../modules/appointment.js";

const router = express.Router();

// Get all appointments
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ name: 1 });
    res.json(appointments);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch appointments", details: err.message });
  }
});

// Create a new appointment
router.post("/", async (req, res) => {
  const { name, duration, practition, code } = req.body;

  if (!name || !duration || !practition || !code) {
    return res.status(400).json({
      error: "Missing required fields",
      required: ["name", "duration", "practitioner", "code"],
    });
  }

  try {
    const newAppointment = new Appointment({
      name,
      duration,
      practition,
      code,
    });

    const savedAppointment = await newAppointment.save();
    res.status(201).json(savedAppointment);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create appointment", details: err.message });
  }
});

// Update an appointment by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, duration, practition, code } = req.body;

  if (!name || !duration || !practition || !code) {
    return res.status(400).json({
      error: "Missing required fields",
      required: ["name", "duration", "practitioner", "code"],
    });
  }

  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { name, duration, practition, code },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json(updatedAppointment);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update appointment", details: err.message });
  }
});

// Delete an appointment by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(id);

    if (!deletedAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json({ message: "Appointment deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete appointment", details: err.message });
  }
});

// Get appointments by practitioner
router.get("/practitioner/:practitioner", async (req, res) => {
  const { practitioner } = req.params;

  try {
    const appointments = await Appointment.find({
      practition: practitioner,
    }).sort({ name: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch appointments for practitioner",
      details: err.message,
    });
  }
});

export default router;
