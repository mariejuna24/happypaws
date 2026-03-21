import React, { useState, useEffect, useRef } from "react";
import { FaCalendarAlt, FaCarAlt, FaCut, FaPaw, FaHeart, FaMedal, FaShieldAlt, FaCameraRetro, FaRegClock, FaSync } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../style/Navbar.css";

// ── Animated counter hook ──────────────────────────────────────────
function useCountUp(target, duration = 1800, startWhen = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!startWhen) return;
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, startWhen]);
  return count;
}

// ── Intersection observer hook ─────────────────────────────────────
function useInView(threshold = 0.3) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ── Static data ────────────────────────────────────────────────────
const TRUST_REASONS = [
  { icon: <FaMedal size={50} color="#e8712a"/>, title: "Certified Groomers", desc: "Every groomer is professionally trained and certified with years of hands-on experience." },
  { icon: <FaShieldAlt size={50} color="#e8712a"/>, title: "Safe & Stress-Free", desc: "We use only pet-safe, hypoallergenic products in a calm, loving environment your pet will adore." },
  { icon: <FaCameraRetro size={50} color="#e8712a"/>, title: "Photo Updates", desc: "Receive adorable photo updates during your pet's session so you're never left wondering." },
  { icon: <FaRegClock size={50} color="#e8712a"/>, title: "On-Time, Every Time", desc: "We respect your schedule. Appointments start promptly — no long waits, ever." },
  { icon: <FaHeart size={50} color="#e8712a"/>, title: "We Love Pets", desc: "This isn't just a job for us — we're pet owners too. Your fur baby is in the hands of true animal lovers." },
  { icon: <FaSync size={50} color="#e8712a"/>, title: "Satisfaction Guaranteed", desc: "Not happy with the groom? We'll make it right — no questions asked." },
];

const STEPS = [
  { num: "01", icon: <FaCalendarAlt size={50} color="#e8712a"/>, title: "Book an Appointment", desc: "Choose your service and pick a time that fits your schedule — online in seconds." },
  { num: "02", icon: <FaCarAlt size={50} color="#e8712a"/>, title: "Drop Off Your Pet", desc: "Bring your furry friend to our salon. We'll greet them with treats and love." },
  { num: "03", icon: <FaCut size={50} color="#e8712a"/>, title: "We Work Our Magic", desc: "Our certified groomers pamper your pet with care, skill, and plenty of cuddles." },
  { num: "04", icon: <FaPaw size={50} color="#e8712a"/>, title: "Pick Up a Happy Pet", desc: "Take home a clean, fluffy, tail-wagging friend — ready for all the compliments." },
];

const TESTIMONIALS = [
  { name: "Maria Santos", pet: "Owner of Mochi 🐩", avatar: "🧑‍🦱", rating: 5, text: "HappyPaws is absolutely amazing! Mochi always comes back looking like a show dog. The staff treats her like their own." },
  { name: "Carlo Reyes", pet: "Owner of Kobe 🐕", avatar: "👨‍🦲", rating: 5, text: "I've tried other salons but none compare. The photo updates are a great touch — I could see Kobe was happy the whole time!" },
  { name: "Liza Bautista", pet: "Owner of Luna 🐈", avatar: "👩‍🦰", rating: 5, text: "Even my anxious cat Luna was calm here! The environment is so peaceful. We're customers for life." },
];

const STATS = [
  { value: 1200, suffix: "+", label: "Happy Pets Groomed" },
  { value: 98,   suffix: "%", label: "Customer Satisfaction" },
  { value: 5,    suffix: "★", label: "Average Rating" },
  { value: 8,    suffix: "+", label: "Years of Experience" },
];

// ══════════════════════════════════════════════════════════════════
export default function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [services, setServices] = useState([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [statsRef, statsInView] = useInView(0.4);

  useEffect(() => {
    fetchServices();
    const timer = setInterval(() => {
      setActiveTestimonial((p) => (p + 1) % TESTIMONIALS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get("/services");
      setServices(res.data);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    }
  };

  const handleBookNow = () => navigate(user ? "/user/services" : "/login");
  const handleLogin = () => navigate("/login");
  const handleServiceBooking = (service) => {
    if (!user) navigate("/login");
    else navigate("/user/service/" + service.id, { state: { service } });
  };

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="paw-bg" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => <span key={i}>🐾</span>)}
        </div>
        <div className="container hero-container">
          <div className="hero-text">
            <div className="hero-badge">Grooming &amp; Care</div>
            <h1 className="hero-title">
              HappyPaws<br /><span>Grooming</span>
            </h1>
            <p className="hero-desc">
              At HappyPaws Grooming, we care for every pet in a safe and calm place.
              Our friendly team provides quality grooming to keep your pet clean,
              healthy, and happy.
            </p>
            <div className="hero-actions">
              <button className="btn-primary-hero" onClick={handleBookNow}>Book Now</button>
              {!user && (
                <button className="btn-outline-hero" onClick={handleLogin}>Log In</button>
              )}
            </div>
            <div className="hero-mini-stats">
              <div className="hero-mini-stat"><strong>1,200+</strong><span>Pets Served</span></div>
              <div className="hero-mini-divider" />
              <div className="hero-mini-stat"><strong>98%</strong><span>Satisfaction</span></div>
              <div className="hero-mini-divider" />
              <div className="hero-mini-stat"><strong>5★</strong><span>Rated</span></div>
            </div>
          </div>
          <div className="hero-image-wrap">
            <div className="hero-blob"></div>
            <img
              src="https://dl.dropbox.com/scl/fi/jrktneb03yx3r6sbdmi84/IMG_20260121_170332.jpg?rlkey=vzpuc79luonknbqhwe6m8w1hk&st=3pjggts9&dl=0"
              alt="Pet Grooming"
              className="hero-img"
            />
            <div className="hero-bubble hero-bubble--1"><FaCut size={12} color="#e8712a"/> Expert Groomers</div>
            <div className="hero-bubble hero-bubble--2"><FaHeart size={12} color="#e8712a"/> Pet-Friendly</div>
          </div>
        </div>
        <div className="hero-wave" aria-hidden="true">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* ── STATS BANNER ─────────────────────────────────── */}
      <section className="stats-section" ref={statsRef}>
        <div className="container stats-grid">
          {STATS.map((s, i) => (
            <StatCard key={i} {...s} animate={statsInView} delay={i * 150} />
          ))}
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────── */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">What We Offer</span>
            <h2 className="section-title">Our Grooming Services</h2>
          </div>
          <div className="services-grid">
            {services.length === 0 ? (
              <p className="no-services">No services available.</p>
            ) : (
              services.map((s) => (
                <div key={s.id} className="service-card">
                  {s.image && (
                    <div className="service-card__img-wrap">
                      <img src={s.image} alt={s.title} className="service-card__img" />
                      <div className="service-card__img-overlay"></div>
                    </div>
                  )}
                  <div className="service-card__body">
                    <h5 className="service-card__title">{s.title}</h5>
                    <p className="service-card__desc">{s.desc}</p>
                    <button className="service-card__btn" onClick={() => handleServiceBooking(s)}>
                      Book Now
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section className="how-section">
        <div className="how-bg-shape" aria-hidden="true" />
        <div className="container">
          <div className="section-header">
            <span className="section-tag green">How It Works</span>
            <h2 className="section-title">Easy as 1-2-3-4</h2>
          </div>
          <div className="steps-grid">
            {STEPS.map((step, i) => (
              <div className="step-card" key={i}>
                <div className="step-num">{step.num}</div>
                <div className="step-icon">{step.icon}</div>
                <h4 className="step-title">{step.title}</h4>
                <p className="step-desc">{step.desc}</p>
                {i < STEPS.length - 1 && <div className="step-connector" aria-hidden="true">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY TRUST US ─────────────────────────────────── */}
      <section className="trust-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag orange">Why Trust HappyPaws?</span>
            <h2 className="section-title">Your Pet Deserves the Best</h2>
          </div>
          <div className="trust-grid">
            {TRUST_REASONS.map((r, i) => (
              <div className="trust-card" key={i}>
                <div className="trust-icon">{r.icon}</div>
                <h4 className="trust-title">{r.title}</h4>
                <p className="trust-desc">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section className="testimonials-section">
        <div className="testimonials-wave-top" aria-hidden="true">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C480,80 960,0 1440,40 L1440,0 L0,0 Z" fill="#ffffff" />
          </svg>
        </div>
        <div className="container">
          <div className="section-header light">
            <span className="section-tag pink">Testimonials</span>
            <h2 className="section-title">Pet Parents Love Us</h2>
          </div>
          <div className="testimonials-carousel">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={`testimonial-card ${i === activeTestimonial ? "active" : ""}`}>
                <div className="testimonial-stars">{"★".repeat(t.rating)}</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.avatar}</div>
                  <div className="testimonial-info">
                    <strong>{t.name}</strong>
                    <span>{t.pet}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="testimonial-dots">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                className={`dot ${i === activeTestimonial ? "active" : ""}`}
                onClick={() => setActiveTestimonial(i)}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────── */}
      <section className="cta-section">
        <div className="cta-paws" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, i) => <span key={i}>🐾</span>)}
        </div>
        <div className="container cta-inner">
          <div className="cta-text">
            <h2>Ready to Spoil Your Pet?</h2>
            <p>Book a grooming session today and give your fur baby the pampering they deserve.</p>
          </div>
          <button className="cta-btn" onClick={handleBookNow}>
             Book an Appointment
          </button>
        </div>
      </section>


    </>
  );
}

// ── Stat Card sub-component ────────────────────────────────────────
function StatCard({ value, suffix, label, animate, delay }) {
  const count = useCountUp(value, 1800, animate);
  return (
    <div className="stat-card" data-index={Math.round(delay / 150)}>
      <div className="stat-value">{count}{suffix}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}