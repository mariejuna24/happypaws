import React from "react";
import { FaPencilAlt, FaStickyNote, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../style/Navbar.css";

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Guest",
    email: "Not logged in",
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleEditProfile   = () => navigate("/user/edit-profile");
  const handleBookingHistory = () => window.location.href = "/booking-history";
  const handleOtherActions  = () => window.location.href = "/other-actions";

  const initial = user.name ? user.name[0].toUpperCase() : "G";

  return (
    <div className="prof-page">

      {/* ── Background mesh ───────────────────── */}
      <div className="prof-mesh" aria-hidden="true" />

      <div className="prof-wrapper">

        {/* ══ LEFT — Identity Panel ══════════════ */}
        <div className="prof-identity">

          <div className="prof-avatar-ring">
            <div className="prof-avatar-ring__pulse" />
            <div className="prof-avatar">
              {initial}
            </div>
          </div>

          <h2 className="prof-name">{user.name}</h2>
          <p className="prof-email">{user.email}</p>

        </div>

        {/* ══ RIGHT — Actions Panel ══════════════ */}
        <div className="prof-actions-panel">

          <div className="prof-section-label">Account</div>

          <button className="prof-action-btn" onClick={handleEditProfile}>
            <span className="prof-action-btn__icon"><FaPencilAlt size={25} color="#e8712a"/></span>
            <span className="prof-action-btn__text">
              <strong>Edit Profile</strong>
              <small>Update your name, email & photo</small>
            </span>
            <span className="prof-action-btn__arrow">›</span>
          </button>

          <button className="prof-action-btn" onClick={handleBookingHistory}>
            <span className="prof-action-btn__icon"><FaStickyNote size={25} color="#e8712a"/></span>
            <span className="prof-action-btn__text">
              <strong>Booking History</strong>
              <small>View all past appointments</small>
            </span>
            <span className="prof-action-btn__arrow">›</span>
          </button>

          <button className="prof-action-btn" onClick={handleOtherActions}>
            <span className="prof-action-btn__icon"><FaCog size={25} color="#e8712a"/></span>
            <span className="prof-action-btn__text">
              <strong>More Actions</strong>
              <small>Settings & preferences</small>
            </span>
            <span className="prof-action-btn__arrow">›</span>
          </button>

          <div className="prof-divider" />

          <button className="prof-logout-btn" onClick={handleLogout}>
            <span><FaSignOutAlt size={25} color="#e8712a"/></span> Logout
          </button>

        </div>
      </div>
    </div>
  );
}