const express = require("express");
const router = express.Router();
const Recruitment = require("../models/Recruitment");
const { sendRecruitmentConfirmation } = require("../services/email");

// Apply for recruitment
router.post("/apply", async (req, res) => {
  try {
    let { name, email, whatsapp, semester, year, branch, domain, resume } = req.body;

    if (email) {
      email = email.toLowerCase().trim();
    }

    // Validate email domain just in case
    if (!email || !email.endsWith("@kiit.ac.in")) {
      return res.status(400).json({ error: "Only @kiit.ac.in email is allowed." });
    }

    // Check if user already applied with this email
    const existing = await Recruitment.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "You have already applied." });
    }

    // Create new recruitment application
    const application = new Recruitment({
      name,
      email,
      whatsapp,
      semester,
      year,
      branch,
      domain,
      resume
    });

    await application.save();

    // Send confirmation email
    try {
      await sendRecruitmentConfirmation({ name, email, whatsapp, semester, year, branch, domain, resume });
    } catch (emailErr) {
      console.error("Error sending recruitment email:", emailErr);
      // We still return success but maybe log the email error
    }

    res.status(201).json({ message: "Application submitted successfully." });
  } catch (error) {
    console.error("Recruitment Apply Error:", error);
    res.status(500).json({ error: "Failed to submit application. Please try again." });
  }
});

// Admin: Get all applications
router.get("/", async (req, res) => {
  try {
    // Basic protection - could add secret key check here later if needed
    const applications = await Recruitment.find().sort({ appliedAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    console.error("Recruitment Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch applications." });
  }
});

module.exports = router;

