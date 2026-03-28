import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSearch, FaBars, FaTimes } from "react-icons/fa";
import "../style/Navbar.css";

const Navbar = () => {
  const user     = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleNav = (path) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/user/${path}`);
    }
    setMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="happynav" ref={menuRef}>
      <div className="happynav__inner">

        {/* ── Logo ── */}
        <Link className="happynav__brand" to="/" onClick={() => setMenuOpen(false)}>
          <img
            src="https://dl.dropbox.com/scl/fi/tp5l3wzf4v2rc9x5ilm1k/Gemini_Generated_Image_z8awplz8v2rc9x5ilm1k-removebg-preview.png?rlkey=fcgrp1ktpw4yyknfappd27lr2&st=q5igy6wd&dl=0"
            alt="HappyPaws Logo"
            className="happynav__logo-img"
          />
          <span className="happynav__brand-name">HappyPaws</span>
        </Link>

        {/* ── Nav Menu (ONLY WHEN LOGGED IN) ── */}
        {user && (
          <ul className={`happynav__links${menuOpen ? " happynav__links--open" : ""}`}>

            <li className="happynav__item">
              <button className="happynav__link" onClick={() => { navigate("/"); setMenuOpen(false); }}>
                Home
              </button>
            </li>

            <li className="happynav__item">
              <button className="happynav__link" onClick={() => handleNav("services")}>
                Services
              </button>
            </li>

            <li className="happynav__item">
              <button className="happynav__link" onClick={() => handleNav("my-bookings")}>
                My Bookings
              </button>
            </li>

            <li className="happynav__item">
              <button className="happynav__link" onClick={() => handleNav("about")}>
                About
              </button>
            </li>

            <li className="happynav__item">
              <button className="happynav__link" onClick={() => handleNav("contact")}>
                Contact
              </button>
            </li>

            {/* ── Mobile-only: Search inside menu ── */}
            <li className="happynav__item happynav__item--mobile-only">
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
            </li>

            {/* ── Mobile-only: Profile inside menu ── */}
            <li className="happynav__item happynav__item--mobile-only">
              <button
                className="happynav__link"
                onClick={() => { navigate("/user/profile"); setMenuOpen(false); }}
              >
                <FaUserCircle style={{ marginRight: 6 }} /> My Profile
              </button>
            </li>

          </ul>
        )}

        {/* ── Auth / User Area ── */}
        <div className="happynav__auth">

          {!user ? (
            <>
              <Link to="/login" className="happynav__btn-login">Login</Link>
              <Link to="/register" className="happynav__btn-register">Register</Link>
            </>
          ) : (
            <>
              {/* Desktop only: Search */}
              <div className="happynav__search happynav__search--desktop">
                <input
                  type="text"
                  className="happynav__search-input"
                  placeholder="Search..."
                />
                <button className="happynav__search-btn">
                  <FaSearch />
                </button>
              </div>

              {/* Desktop only: Profile */}
              <button
                className="happynav__profile happynav__profile--desktop"
                onClick={() => navigate("/user/profile")}
              >
                <FaUserCircle className="happynav__profile-icon" />
              </button>

              {/* Hamburger — mobile only */}
              <button
                className="happynav__hamburger"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;