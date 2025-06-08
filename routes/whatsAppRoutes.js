import fetch from "node-fetch";
import express from "express";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables

const router = express.Router();

router.post("/send-whatsapp", async (req, res) => {
  const { phoneNumber, bookingCode, name, date } = req.body;

  if (!phoneNumber || !bookingCode || !name || !date) {
    return res.status(400).json({
      error: "Missing required fields",
      required: ["phoneNumber", "bookingCode", "name", "date"],
    });
  }

  const url = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!process.env.WHATSAPP_PHONE_NUMBER_ID || !token) {
    console.error("Missing environment variables:", {
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
      token: !!token, // Log true/false to avoid logging the actual token
    });
    return res.status(500).json({ error: "Server configuration error" });
  }

  const messageData = {
    messaging_product: "whatsapp",
    to: phoneNumber,
    type: "text",
    text: {
      body: `Hello ${name}, your appointment has been made for ${date}.\nYour booking code is: ${bookingCode}. Use this if you would like to cancel your appointment.`,
    },
  };

  try {
    console.log("Sending WhatsApp message with data:", messageData);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    });

    const data = await response.json();
    console.log("WhatsApp API response:", data);

    if (!response.ok || data.error) {
      console.error("WhatsApp API error:", data.error);
      return res.status(500).json({
        error: "Failed to send WhatsApp message",
        details: data.error?.message || "Unknown error",
      });
    }

    res.json({
      message: "WhatsApp message sent successfully",
      messageId: data.messages?.[0]?.id,
    });
  } catch (error) {
    console.error("Error in WhatsApp request:", error.message);
    res.status(500).json({
      error: "Error sending message",
      details: error.message,
    });
  }
});

// Export the router to use in the main server file
export default router;