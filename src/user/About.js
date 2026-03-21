import React from "react";
import { FaCut, FaMedal, FaShieldAlt } from "react-icons/fa";
import "../style/Navbar.css";

export default function About() {
  return (
    <div className="about-page">

      {/* ── Hero Banner ───────────────────────── */}
      <div className="about-hero">
        <div className="about-hero__paws" aria-hidden="true">
          <span>🐾</span><span>❤️</span><span>🐾</span>
          <span>✂️</span><span>🐾</span><span>❤️</span>
          <span>🐾</span><span>✂️</span><span>🐾</span>
        </div>
        <div className="about-hero__content">
          <span className="about-hero__tag">Who We Are</span>
          <h1 className="about-hero__title">About <em>HappyPaws</em></h1>
          <p className="about-hero__sub">Passionate about pets. Dedicated to their care.</p>
        </div>
        <div className="about-hero__wave" aria-hidden="true">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#ffffff" />
          </svg>
        </div>
      </div>

      {/* ── Main Content ──────────────────────── */}
      <div className="about-container">

        {/* Mission card */}
        <div className="about-card">
          <div className="about-card__icon"><FaMedal size={30} color="#e8712a"/></div>
          <div className="about-card__body">
            <h3 className="about-card__title">Our Mission</h3>
            <p className="about-card__text">
              At <strong>HappyPaws Grooming</strong>, we are committed to providing exceptional care for your pets.
              Our mission is to ensure that every pet receives the highest standard of grooming services,
              combining professional expertise with genuine compassion.
            </p>
          </div>
        </div>

        {/* Services card */}
        <div className="about-card">
          <div className="about-card__icon"><FaCut size={30} color="#e8712a"/></div>
          <div className="about-card__body">
            <h3 className="about-card__title">What We Do</h3>
            <p className="about-card__text">
              Our team of experienced groomers specializes in a comprehensive range of services,
              from essential hygiene maintenance to personalized styling. We take pride in creating
              a safe, comfortable, and enjoyable experience for every pet that visits our facility.
            </p>
          </div>
        </div>

        {/* Values card */}
        <div className="about-card">
          <div className="about-card__icon"><FaShieldAlt size={30} color="#e8712a"/></div>
          <div className="about-card__body">
            <h3 className="about-card__title">Why Choose Us</h3>
            <p className="about-card__text">
              By choosing HappyPaws, you are trusting a dedicated team that values the well-being,
              happiness, and confidence of your beloved pets. We strive to build lasting relationships
              with both pets and their owners through excellence, professionalism, and care.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}