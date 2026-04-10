import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaHome, FaChartBar, FaCut, FaStar, FaCog,
  FaUsers, FaSignOutAlt, FaLock, FaChevronDown,
  FaChevronRight, FaAngleLeft, FaAngleRight,
} from "react-icons/fa";
import { logoutUser } from "../services/api";
import "../style/AdminStyle.css";

const AdminNavbar = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [manageOpen, setManageOpen] = useState(false);
  const [collapsed,  setCollapsed]  = useState(false);

  const handleNav = (path) => navigate(`/admin/${path}`);

  const handleLogout = async () => {
    await logoutUser();
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  const isActive = (path) => location.pathname.includes(`/admin/${path}`);

  return (
    <aside className={`admin-sidebar ${collapsed ? "admin-sidebar--collapsed" : ""}`}>

      <div className="admin-sidebar__brand">
        <Link to="/admin/dashboard" className="admin-sidebar__brand-link">
          <img
            src="https://dl.dropbox.com/scl/fi/tp5l3wzf4v2rc9x5ilm1k/Gemini_Generated_Image_z8awplz8v2rc9x5ilm1k-removebg-preview.png?rlkey=fcgrp1ktpw4yyknfappd27lr2&st=q5igy6wd&dl=0"
            alt="HappyPaws Logo"
            className="admin-sidebar__logo"
          />
          <div className="admin-sidebar__brand-text">
            <span className="admin-sidebar__brand-name">HappyPaws</span>
            <span className="admin-sidebar__brand-role">Admin Panel</span>
          </div>
        </Link>
        <button className="admin-sidebar__toggle" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">
          {collapsed ? <FaAngleRight size={14} /> : <FaAngleLeft size={14} />}
        </button>
      </div>

      <div className="admin-sidebar__divider" />

      <nav className="admin-sidebar__nav">
        <span className="admin-sidebar__section-label">Main</span>

        <button className={`admin-nav-item ${isActive("dashboard") ? "active" : ""}`} onClick={() => handleNav("dashboard")}>
          <span className="admin-nav-item__icon"><FaHome size={14} /></span>
          <span className="admin-nav-item__label">Dashboard</span>
          {isActive("dashboard") && <span className="admin-nav-item__dot" />}
        </button>

        <button className={`admin-nav-item ${isActive("stats") ? "active" : ""}`} onClick={() => handleNav("stats")}>
          <span className="admin-nav-item__icon"><FaChartBar size={14} /></span>
          <span className="admin-nav-item__label">Bookings</span>
          {isActive("stats") && <span className="admin-nav-item__dot" />}
        </button>

        <button className={`admin-nav-item ${isActive("admin-services") ? "active" : ""}`} onClick={() => handleNav("admin-services")}>
          <span className="admin-nav-item__icon"><FaCut size={14} /></span>
          <span className="admin-nav-item__label">Services</span>
          {isActive("admin-services") && <span className="admin-nav-item__dot" />}
        </button>

        <button className={`admin-nav-item ${isActive("ratings") ? "active" : ""}`} onClick={() => handleNav("ratings")}>
          <span className="admin-nav-item__icon"><FaStar size={14} /></span>
          <span className="admin-nav-item__label">Ratings</span>
          {isActive("ratings") && <span className="admin-nav-item__dot" />}
        </button>

        <span className="admin-sidebar__section-label">Manage</span>

        <button className={`admin-nav-item admin-nav-item--dropdown ${manageOpen ? "open" : ""}`} onClick={() => setManageOpen(!manageOpen)}>
          <span className="admin-nav-item__icon"><FaCog size={14} /></span>
          <span className="admin-nav-item__label">Manage</span>
          <span className="admin-nav-item__chevron">
            {manageOpen ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
          </span>
        </button>

        {manageOpen && (
          <div className="admin-nav-submenu">
            <button className={`admin-nav-subitem ${isActive("manage-users") ? "active" : ""}`} onClick={() => handleNav("manage-users")}>
              <FaUsers size={12} /> Users
            </button>
          </div>
        )}
      </nav>

      <div className="admin-sidebar__spacer" />

      <div className="admin-sidebar__bottom">
        <div className="admin-sidebar__divider" />
        <div className="admin-sidebar__admin-info">
          <div className="admin-sidebar__admin-avatar">A</div>
          <div className="admin-sidebar__admin-text">
            <span className="admin-sidebar__admin-name">Administrator</span>
            <span className="admin-sidebar__admin-badge"><FaLock size={10} /> Admin</span>
          </div>
        </div>
        <button className="admin-logout-btn" onClick={handleLogout}>
          <FaSignOutAlt size={14} />
          <span className="admin-nav-item__label">Logout</span>
        </button>
      </div>

    </aside>
  );
};

export default AdminNavbar;