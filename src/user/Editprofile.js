import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Navbar.css";

export default function EditProfile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || { name: "", email: "" };

  const [formData, setFormData] = useState({
    name:            user.name     || "",
    email:           user.email    || "",
    phone:           user.phone    || "",
    address:         user.address  || "",
    currentPassword: "",
    newPassword:     "",
    confirmPassword: "",
  });

  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("");

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setStatus("New passwords do not match.");
      setStatusType("error");
      return;
    }

    // Save updated user info (excluding password fields)
    const updatedUser = {
      ...user,
      name:    formData.name,
      email:   formData.email,
      phone:   formData.phone,
      address: formData.address,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setStatus("Profile updated successfully!");
    setStatusType("success");
  };

  const initial = formData.name ? formData.name[0].toUpperCase() : "G";

  return (
    <div className="ep-page">
      <div className="ep-mesh" aria-hidden="true" />

      <div className="ep-wrapper">

        {/* ── Header ────────────────────────────── */}
        <div className="ep-header">
          <button className="ep-back" onClick={() => navigate(-1)}>← Back</button>
          <div className="ep-header__avatar">{initial}</div>
          <div className="ep-header__info">
            <span className="ep-header__tag">Editing Profile</span>
            <h2 className="ep-header__name">{user.name || "Your Profile"}</h2>
          </div>
        </div>

        {/* ── Form Card ─────────────────────────── */}
        <div className="ep-card">

          <form className="ep-form" onSubmit={handleSubmit}>

            {/* Personal info */}
            <div className="ep-section">
              <h4 className="ep-section__title">
                <span className="ep-section__icon">👤</span> Personal Info
              </h4>
              <div className="ep-fields-grid">
                <div className="ep-field">
                  <label className="ep-label">Full Name</label>
                  <input
                    className="ep-input"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div className="ep-field">
                  <label className="ep-label">Email Address</label>
                  <input
                    className="ep-input"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@email.com"
                    required
                  />
                </div>
                <div className="ep-field">
                  <label className="ep-label">Phone Number</label>
                  <input
                    className="ep-input"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+63 912 345 6789"
                  />
                </div>
                <div className="ep-field">
                  <label className="ep-label">Address</label>
                  <input
                    className="ep-input"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Your address"
                  />
                </div>
              </div>
            </div>

            <div className="ep-divider" />

            {/* Change password */}
            <div className="ep-section">
              <h4 className="ep-section__title">
                <span className="ep-section__icon">🔒</span> Change Password
                <span className="ep-section__optional">optional</span>
              </h4>
              <div className="ep-fields-grid">
                <div className="ep-field ep-field--full">
                  <label className="ep-label">Current Password</label>
                  <input
                    className="ep-input"
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter current password"
                  />
                </div>
                <div className="ep-field">
                  <label className="ep-label">New Password</label>
                  <input
                    className="ep-input"
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="New password"
                  />
                </div>
                <div className="ep-field">
                  <label className="ep-label">Confirm Password</label>
                  <input
                    className="ep-input"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat new password"
                  />
                </div>
              </div>
            </div>

            {/* Status message */}
            {status && (
              <div className={`ep-status ep-status--${statusType}`}>
                {statusType === "success" ? "✅" : "❌"} {status}
              </div>
            )}

            {/* Actions */}
            <div className="ep-actions">
              <button type="button" className="ep-btn-cancel" onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button type="submit" className="ep-btn-save">
                Save Changes 🐾
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}