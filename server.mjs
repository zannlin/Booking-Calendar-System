import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bookingRoutes from "./routes/bookingRoutes.js";
import navRoutes from "./routes/navRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import whatsAppRoutes from "./routes/whatsAppRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import googleCalendarRoutes from "./routes/googleCalendarRoutes.js";

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Middleware to handle JSON and URL-encoded data
// Add routes
app.use("/", navRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/whatsapp", whatsAppRoutes);
app.use("/api/google-calendar", googleCalendarRoutes);
app.set("view engine", "ejs");
app.use(express.static("public"));

const port = process.env.PORT || 5000;
const host = process.env.HOST || "localhost";
const mongoURL = process.env.MONGODB_URI;

mongoose
  .connect(mongoURL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(port, host, () => {
  console.log(`Server is running at http://${host}:${port}`);
});
