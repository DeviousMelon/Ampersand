import { useEffect } from "react";
import "./Contact.css";

export default function Contact({ setInputLocked }) {
  // Lock console arrow-key history while on Contact
  useEffect(() => {
    if (setInputLocked) setInputLocked(true);
    return () => setInputLocked(false);
  }, [setInputLocked]);

  return (
    <div className="contact-page">
      <h2>Contact Me</h2>
      <p>
        📧 <a href="mailto:lolwright02@gmail.com">lolwright02@gmail.com</a>
        <a href="mailto:k00300249@student.tus.ie">k00300249@student.tus.ie</a>
      </p>
      <p>
        🔗{" "}
        <a
          href="https://www.linkedin.com/in/lauren-wright-04b63a350"
          target="_blank"
          rel="noopener noreferrer"
        >
          linkedin.com/in/lauren-wright
        </a>
      </p>

      {/* Simple Formspree form—you can swap in your own endpoint */}
      <form
        className="contact-form"
        action="https://formspree.io/f/mvgqwqan"
        method="POST"
      >
        <label>
          Name
          <input type="text" name="name" required />
        </label>
        <label>
          Email
          <input type="email" name="_replyto" required />
        </label>
        <label>
          Message
          <textarea name="message" rows="4" required />
        </label>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
