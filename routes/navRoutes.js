import express from "express";

const router = express.Router();


router.get("/", (req, res) => {
  res.render("book");
});

router.get("/cancelations", (req, res) => {
  res.render("cancel");
});

router.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

export default router;