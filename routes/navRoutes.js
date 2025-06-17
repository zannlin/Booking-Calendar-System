import express from "express";
import Employee from "../modules/employee.js";
import Appointment from "../modules/appointment.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find().sort({ name: 1 });
    console.log("Employees fetched successfully:", employees);
    res.render("book", { employees, title: "Book Appointment" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch employees", details: err.message });
  }
});

router.get("/cancelations", (req, res) => {
  res.render("cancel");
});

router.get("/pricing", async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ date: -1 });
    res.render("pricing", { appointments, title: "Pricing" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch appointments", details: err.message });
  }
});

router.get("/admin", (req, res) => {
  res.render("adminPortal", { title: "Admin Portal" });
});

router.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

export default router;
