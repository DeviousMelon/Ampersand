/* eslint-disable no-unused-vars */
// ampersand-site/src/contact.js
const form = document.getElementById("contact-form");
const status = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    name: form.name.value,
    email: form.email.value,
    message: form.message.value,
  };
  
  try {
    const res = await fetch("/.netlify/functions/send-email", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res.ok) {
      status.textContent = "Thanks! Your message has been sent.";
      form.reset();
    } else {
      status.textContent = "Oops! There was a problem. Please try again later.";
    }
  } catch (err) {
    status.textContent = "Oops! There was a problem. Please try again later.";
  }
});