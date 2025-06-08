import mongoose from "mongoose";


const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    practition: { type: String, required: true }
  }
);

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;