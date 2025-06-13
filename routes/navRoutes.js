import express from "express";
import Employee from "../modules/employee.js";

const router = express.Router();

router.get("/", async (req, res) => {
  let employees = [];
  try {
    employees = await Employee.find().sort({ name: 1 });
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

router.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

export default router;