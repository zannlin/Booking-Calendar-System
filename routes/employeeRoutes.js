import express from "express";
import Employee from "../modules/employee.js";

const router = express.Router();

// Get all employees
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find().sort({ name: 1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch employees", details: err.message });
  }
});

// Create a new employee
router.post("/", async (req, res) => {
  const { name, phone, practition } = req.body;

  if (!name || !phone || !practition) {
    return res.status(400).json({
      error: "Missing required fields",
      required: ["name", "phone", "practitioner"],
    });
  }

  try {
    const newEmployee = new Employee({
      name,
      phone,
      practition,
    });

    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (err) {
    res.status(500).json({ error: "Failed to create employee", details: err.message });
  }
});

// Update an employee by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, phone, practition } = req.body;

  if (!name || !phone || !practition) {
    return res.status(400).json({
      error: "Missing required fields",
      required: ["name", "phone", "practitioner"],
    });
  }

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { name, phone, practition },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json(updatedEmployee);
  } catch (err) {
    res.status(500).json({ error: "Failed to update employee", details: err.message });
  }
});

// Delete an employee by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete employee", details: err.message });
  }
});

export default router;
// This code defines routes for managing employees in an Express application.