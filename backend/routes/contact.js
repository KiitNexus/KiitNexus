const express = require("express");

const router = express.Router();

const { sendContactEmail } = require("../services/email");

function validatePayload(payload) {
  const errors = [];

  if (!payload.name || String(payload.name).trim().length === 0) {
    errors.push("name");
  }

  if (!payload.email || !/^\S+@\S+\.\S+$/.test(String(payload.email).trim())) {
    errors.push("email");
  }

  if (!payload.subject || String(payload.subject).trim().length === 0) {
    errors.push("subject");
  }

  if (!payload.message || String(payload.message).trim().length < 10) {
    errors.push("message");
  }

  return errors;
}

router.post("/contact", async (req, res) => {
  try {
    const errors = validatePayload(req.body);

    if (errors.length) {
      return res.status(400).json({
        error: "validation_failed",
        details: errors,
      });
    }

    const { name, email, subject, message } = req.body;

    await sendContactEmail({
      name: String(name).trim(),
      email: String(email).trim(),
      subject: String(subject).trim(),
      message: String(message).trim(),
    });

    return res.status(200).json({
      ok: true,
      message: "Your message has been sent successfully.",
    });
  } catch (err) {
    console.error("Contact route error:", err);

    return res.status(500).json({
      error: "server_error",
    });
  }
});

module.exports = router;
