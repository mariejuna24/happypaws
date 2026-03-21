import React, { useState } from "react";
import { FaLocationArrow, FaMailBulk, FaPhone, FaRegClock, FaCheckCircle } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import "../style/Navbar.css";

// ← Removed axios import entirely — contact form just shows success UI
// To add real email sending later, integrate EmailJS or Firebase Functions

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("");
    // Simulate success — replace with EmailJS or Firebase Function if needed
    setStatus("success");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="contact-page">

      <div className="contact-hero">
        <div className="contact-hero__paws" aria-hidden="true">
          <span>🐾</span><span>💬</span><span>🐾</span>
          <span>📬</span><span>🐾</span><span>💬</span>
          <span>🐾</span><span>📬</span><span>🐾</span>
        </div>
        <div className="contact-hero__content">
          <span className="contact-hero__tag">Get In Touch</span>
          <h1 className="contact-hero__title">Contact <em>Us</em></h1>
          <p className="contact-hero__sub">We'd love to hear from you!</p>
        </div>
        <div className="contact-hero__wave" aria-hidden="true">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#ffffff" />
          </svg>
        </div>
      </div>

      <div className="contact-container">
        <div className="contact-layout">

          <div className="contact-info">
            <h3 className="contact-info__title">Let's Talk</h3>
            <p className="contact-info__desc">
              Have a question, a special request, or just want to say hi?
              Drop us a message and we'll get back to you as soon as possible.
            </p>
            <div className="contact-info__items">
              <div className="contact-info__item">
                <span className="contact-info__icon"><FaMailBulk size={12} color="#e8712a"/></span>
                <span>hello@happypaws.ph</span>
              </div>
              <div className="contact-info__item">
                <span className="contact-info__icon"><FaPhone size={12} color="#e8712a"/></span>
                <span>+63 912 345 6789</span>
              </div>
              <div className="contact-info__item">
                <span className="contact-info__icon"><FaLocationArrow size={12} color="#e8712a"/></span>
                <span>Quezon City, Metro Manila</span>
              </div>
              <div className="contact-info__item">
                <span className="contact-info__icon"><FaRegClock size={12} color="#e8712a"/></span>
                <span>Mon – Sat, 8:00 AM – 5:00 PM</span>
              </div>
            </div>
          </div>

          <div className="contact-card">
            <h3 className="contact-card__heading">Send a Message</h3>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-field">
                <label className="contact-label">Full Name</label>
                <input className="contact-input" name="name" value={formData.name}
                  onChange={handleChange} placeholder="Your full name" required />
              </div>

              <div className="contact-field">
                <label className="contact-label">Email Address</label>
                <input className="contact-input" type="email" name="email" value={formData.email}
                  onChange={handleChange} placeholder="you@email.com" required />
              </div>

              <div className="contact-field">
                <label className="contact-label">Your Message</label>
                <textarea className="contact-textarea" name="message" value={formData.message}
                  onChange={handleChange} placeholder="Write your message here..." rows="5" required />
              </div>

              <button type="submit" className="contact-btn">Send Message</button>

              {status === "success" && (
                <div className="contact-status contact-status--success">
                  <FaCheckCircle size={12} color="#28a745"/> Your message has been sent successfully!
                </div>
              )}
              {status === "error" && (
                <div className="contact-status contact-status--error">
                  <FaCircleXmark size={12} color="#dc3545"/> Sorry, something went wrong. Please try again.
                </div>
              )}
            </form>
          </div>

        </div>
      </div>

    </div>
  );
}