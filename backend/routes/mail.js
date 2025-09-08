const express = require("express");
const router = express.Router();
const transporter = require("../utils/transporter");

// 📩 Send mail (custom subject + message)
router.post("/send-mail", async (req, res) => {
  const { email, subject, message } = req.body;

  if (!email || !subject || !message) {
    return res
      .status(400)
      .json({ success: false, message: "Email, subject, and message are required" });
  }

  try {
    await transporter.sendMail({
      from: "sainikhilchitra@gmail.com",
      to: email,
      subject,
      text: message,
    });

    res.json({ success: true, message: "Mail sent successfully ✅" });
  } catch (err) {
    console.error("Error sending mail:", err);
    res.status(500).json({ success: false, message: "Failed to send mail ❌" });
  }
});

module.exports = router;