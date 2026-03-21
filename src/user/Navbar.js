import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSearch } from "react-icons/fa";
import "../style/Navbar.css";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleNav = (path) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/user/${path}`);
    }
  };

  return (
    <nav className="happynav">
      <div className="happynav__inner">

        {/* ── Logo ─────────────────────────────── */}
        <Link className="happynav__brand" to="/">
          <img
            src="https://dl.dropbox.com/scl/fi/tp5l3wzf4v2rc9x5ilm1k/Gemini_Generated_Image_z8awplz8v2rc9x5ilm1k-removebg-preview.png?rlkey=fcgrp1ktpw4yyknfappd27lr2&st=q5igy6wd&dl=0"
            alt="HappyPaws Logo"
            className="happynav__logo-img"
          />
          <span className="happynav__brand-name">HappyPaws</span>
        </Link>

        {/* ── Nav Menu (ONLY WHEN LOGGED IN) ───────────────── */}
        {user && (
          <ul className="happynav__links">

            <li className="happynav__item">
              <button className="happynav__link" onClick={() => navigate("/")}>
                Home
              </button>
            </li>

            <li className="happynav__item">
              <button
                className="happynav__link"
                onClick={() => handleNav("services")}
              >
                Services
              </button>
            </li>

            <li className="happynav__item">
              <button
                className="happynav__link"
                onClick={() => handleNav("my-bookings")}
              >
                My Bookings
              </button>
            </li>

            <li className="happynav__item">
              <button
                className="happynav__link"
                onClick={() => handleNav("about")}
              >
                About
              </button>
            </li>

            <li className="happynav__item">
              <button
                className="happynav__link"
                onClick={() => handleNav("contact")}
              >
                Contact
              </button>
            </li>

          </ul>
        )}

        {/* ── Auth / User Area ───────────────── */}
        <div className="happynav__auth">

          {!user ? (
            <>
              <Link to="/login" className="happynav__btn-login">
                Login
              </Link>

              <Link to="/register" className="happynav__btn-register">
                Register
              </Link>
            </>
          ) : (
            <>
              {/* Search */}
              <div className="happynav__search">
                <input
                  type="text"
                  className="happynav__search-input"
                  placeholder="Search..."
                />
                <button className="happynav__search-btn">
                  <FaSearch />
                </button>
              </div>

              {/* Profile */}
              <button
                className="happynav__profile"
                onClick={() => navigate("/user/profile")}
              >
                <FaUserCircle className="happynav__profile-icon" />
              </button>
            </>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;