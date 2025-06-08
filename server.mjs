import express from "express";
import { google } from "googleapis";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bookingRoutes from "./routes/bookingRoutes.js";
import navRoutes from "./routes/navRoutes.js";
//import employeeRoutes from "./routes/employeeRoutes.js";
import whatsAppRoutes from "./routes/whatsAppRoutes.js";

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());
// Add routes
app.use("/", navRoutes);
app.use("/api/bookings", bookingRoutes);
//app.use("/api/employees", employeeRoutes);
app.use("/api/whatsapp", whatsAppRoutes);
app.set("view engine", "ejs");
app.use(express.static("public"));

const port = process.env.PORT || 5000;
const host = process.env.HOST || "localhost";
const mongoURL = process.env.MONGODB_URI;

mongoose
  .connect(mongoURL, {
    serverSelectionTimeoutMS: 5000, // Timeout value can still be useful
    connectTimeoutMS: 10000,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

//#region Google Calendar API

const GOOGLE_PRIVATE_KEY = process.env.private_key.replace(/\\n/g, "\n");
const GOOGLE_CLIENT_EMAIL = process.env.client_email;
const GOOGLE_PROJECT_NUMBER = process.env.project_number;

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

const jwtClient = new google.auth.JWT(
  GOOGLE_CLIENT_EMAIL,
  null,
  GOOGLE_PRIVATE_KEY,
  SCOPES
);

const calendar = google.calendar({
  version: "v3",
  project: GOOGLE_PROJECT_NUMBER,
  auth: jwtClient,
});

const auth = new google.auth.GoogleAuth({
  keyFile: "./keys.json",
  scopes: SCOPES,
});

// app.get("/events", async (req, res) => {
//   try {
//     const { practitioner, minDate, maxDate } = req.query;

//     if (!practitioner || !minDate || !maxDate) {
//       return res
//         .status(400)
//         .json({ error: "practitioner, minDate, and maxDate are required" });
//     }

//     let calendarId;
//     switch (practitioner) {
//       case "hairStylist":
//         calendarId = process.env.HAIR_CALENDAR_ID;
//         break;
//       case "esthetician":
//         calendarId = process.env.ESTHETICIAN_CALENDAR_ID;
//         break;
//       case "nailTechnician":
//         calendarId = process.env.NAIL_CALENDAR_ID;
//         break;
//       default:
//         return res.status(400).json({ error: "Invalid practitioner selected" });
//     }

//     const response = await calendar.events.list({
//       calendarId: calendarId,
//       timeMin: new Date(minDate).toISOString(),
//       timeMax: new Date(maxDate).toISOString(),
//       maxResults: 50,
//       singleEvents: true,
//       orderBy: "startTime",
//     });

//     res.json(response.data.items);
//   } catch (error) {
//     console.error("Error fetching events:", error);
//     res.status(500).send("Error fetching calendar events");
//   }
// });

// //Post event to the google calendar
// app.post("/events", async (req, res) => {
//   try {
//     // Extract event data from the request body
//     const { practitioner, summary, startTime, endTime, description } = req.body;

//     if (!practitioner || !summary || !startTime || !endTime) {
//       return res.status(400).json({
//         error: "practitioner, summary, startTime, and endTime are required",
//       });
//     }

//     // Determine which calendar ID to use
//     let calendarId;
//     switch (practitioner) {
//       case "hairStylist":
//         calendarId = process.env.HAIR_CALENDAR_ID;
//         break;
//       case "esthetician":
//         calendarId = process.env.ESTHETICIAN_CALENDAR_ID;
//         break;
//       case "nailTechnician":
//         calendarId = process.env.NAIL_CALENDAR_ID;
//         break;
//       default:
//         return res.status(400).json({ error: "Invalid practitioner selected" });
//     }

//     // Format the event details
//     const calendarEvent = {
//       summary,
//       description,
//       start: {
//         dateTime: new Date(startTime).toISOString(),
//         timeZone: "Africa/Johannesburg",
//       },
//       end: {
//         dateTime: new Date(endTime).toISOString(),
//         timeZone: "Africa/Johannesburg",
//       },
//     };

//     // Get the auth client and insert the event
//     const authClient = await auth.getClient();
//     const response = await calendar.events.insert({
//       auth: authClient,
//       calendarId: calendarId,
//       resource: calendarEvent,
//     });

//     res
//       .status(201)
//       .json({ message: "Event created successfully", event: response.data });
//   } catch (error) {
//     console.error("Error creating event:", error);
//     res.status(500).json({ error: "Error creating calendar event" });
//   }
// });

// //Deleting an event
// app.delete("/events/:practitioner/:eventId", async (req, res) => {
//   try {
//     const { practitioner, eventId } = req.params; // Get practitioner and event ID from request parameters

//     if (!practitioner || !eventId) {
//       return res
//         .status(400)
//         .json({ error: "Practitioner and Event ID are required" });
//     }

//     // Determine which calendar ID to use
//     let calendarId;
//     switch (practitioner) {
//       case "hairStylist":
//         calendarId = process.env.HAIR_CALENDAR_ID;
//         break;
//       case "esthetician":
//         calendarId = process.env.ESTHETICIAN_CALENDAR_ID;
//         break;
//       case "nailTechnician":
//         calendarId = process.env.NAIL_CALENDAR_ID;
//         break;
//       default:
//         return res.status(400).json({ error: "Invalid practitioner selected" });
//     }

//     // Delete the event from the selected calendar
//     await calendar.events.delete({
//       calendarId: calendarId,
//       eventId: eventId,
//     });

//     res.json({
//       message: `Event ${eventId} deleted successfully from ${practitioner}'s calendar`,
//     });
//   } catch (error) {
//     console.error("Error deleting event:", error);
//     res.status(500).json({ error: "Error deleting event" });
//   }
// });

//#endregion

app.listen(port, host, () => {
  console.log(`Server is running at http://${host}:${port}`);
});
