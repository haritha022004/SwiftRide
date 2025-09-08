// src/api.js
export const sendCustomMail = async (email, subject, message) => {
  const res = await fetch("/api/send-mail", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, subject, message }),
  });

  return res.json();
};