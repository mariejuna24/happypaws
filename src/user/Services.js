import React, { useState, useEffect } from "react";
import { FaCut, FaPaw, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getServices, getAllBookings } from "../services/api"; // ← changed
import "../style/Navbar.css";

const StarRating = ({ avg, count }) => {
  if (!count) return <span className="svc-rating__none">No reviews yet</span>;
  return (
    <div className="svc-rating">
      <div className="svc-rating__stars">
        {[1, 2, 3, 4, 5].map((s) => (
          <FaStar
            key={s}
            className="svc-rating__star"
            style={{ color: s <= Math.round(avg) ? "#f59e0b" : "#d1d5db" }}
          />
        ))}
      </div>
      <span className="svc-rating__score">{avg.toFixed(1)}</span>
      <span className="svc-rating__count">({count})</span>
    </div>
  );
};

export default function Services() {
  const [services,  setServices]  = useState([]);
  const [ratingMap, setRatingMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
    fetchRatings();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await getServices(); // ← changed
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchRatings = async () => {
    try {
      const allBookings = await getAllBookings(); // ← changed
      const rated = allBookings.filter((b) => b.rating);
      const map = {};
      rated.forEach((b) => {
        const key = b.serviceTitle;
        if (!map[key]) map[key] = { total: 0, count: 0 };
        map[key].total += Number(b.rating);
        map[key].count += 1;
      });
      const avgMap = {};
      Object.entries(map).forEach(([key, { total, count }]) => {
        avgMap[key] = { avg: total / count, count };
      });
      setRatingMap(avgMap);
    } catch (err) {
      console.error("Error fetching ratings:", err);
    }
  };

  const goToDetails = (service) => {
    navigate(`/user/service/${service.id}`, { state: { service, ratingMap } });
  };

  const goToBookingForm = (service) => {
    navigate("/user/bookings", { state: { service } });
  };

  // ── JSX is exactly the same as before, no changes needed ──
  return (
    <div className="svc-page">
      <div className="svc-hero">
        <div className="svc-hero__paws" aria-hidden="true">
          <span><FaPaw color="#ffff"/></span><span><FaCut color="#ffff"/></span><span><FaPaw color="#ffff"/></span>
          <span>🛁</span><span><FaPaw color="#ffff"/></span><span><FaCut color="#ffff"/></span>
          <span><FaPaw color="#ffff"/></span><span>🛁</span><span><FaPaw color="#ffff"/></span>
        </div>
        <div className="svc-hero__content">
          <h1 className="svc-hero__title">Our Grooming<br /><em>Services</em></h1>
          <p className="svc-hero__sub">
            Tailored care for every furry friend —<br />big or small, fluffy or smooth.
          </p>
        </div>
        <div className="svc-hero__wave" aria-hidden="true">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#ffffff" />
          </svg>
        </div>
      </div>

      <div className="svc-container">
        <div className="svc-list">
          {services.length === 0 ? (
            <p className="svc-empty">No services available.</p>
          ) : (
            services.map((service) => {
              const r = ratingMap[service.title];
              return (
                <div key={service.id} className="svc-card">
                  {service.image && (
                    <div className="svc-card__img-wrap">
                      <img src={service.image} alt={service.title} className="svc-card__img" />
                    </div>
                  )}
                  <div className="svc-card__body">
                    <h5 className="svc-card__name" onClick={() => goToDetails(service)}>{service.title}</h5>
                    <p className="svc-card__desc" onClick={() => goToDetails(service)}>{service.desc}</p>
                    <StarRating avg={r?.avg || 0} count={r?.count || 0} />
                    <span className="svc-card__price">₱{service.price}</span>
                  </div>
                  <div className="svc-card__action">
                    <button className="svc-card__btn" onClick={() => goToBookingForm(service)}>Book Now</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}