import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { getServiceById, getAllBookings } from "../services/api"; // ← Firebase
import "../style/Navbar.css";

const StarDisplay = ({ value, size = "md" }) => (
  <div className={`sd-stars sd-stars--${size}`}>
    {[1, 2, 3, 4, 5].map((s) => (
      <FaStar key={s} style={{ color: s <= Math.round(value) ? "#f59e0b" : "#d1d5db" }} />
    ))}
  </div>
);

export default function ServiceDetailsPage() {
  const { state }  = useLocation();
  const { id }     = useParams();
  const navigate   = useNavigate();

  const [service,     setService]     = useState(state?.service || null);
  const [loading,     setLoading]     = useState(!state?.service);
  const [error,       setError]       = useState("");
  const [reviews,     setReviews]     = useState([]);
  const [ratingStats, setRatingStats] = useState({ avg: 0, count: 0, dist: [] });

  useEffect(() => {
    if (!service && id) fetchServiceById_();
  }, [id]);

  useEffect(() => {
    if (service) fetchReviews(service.title);
  }, [service]);

  const fetchServiceById_ = async () => {
    try {
      const data = await getServiceById(id); // ← Firebase
      if (data) setService(data);
      else setError("Service not found.");
    } catch (err) {
      console.error(err);
      setError("Service not found.");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (title) => {
    try {
      const allBookings = await getAllBookings(); // ← Firebase
      const rated = allBookings.filter((b) => b.rating && b.serviceTitle === title);
      if (rated.length === 0) { setReviews([]); return; }

      const avg  = rated.reduce((s, b) => s + Number(b.rating), 0) / rated.length;
      const dist = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: rated.filter((b) => Number(b.rating) === star).length,
      }));

      const sorted = [...rated].sort((a, b) => {
        if (a.feedback && !b.feedback) return -1;
        if (!a.feedback && b.feedback) return 1;
        return new Date(b.date) - new Date(a.date);
      });

      setReviews(sorted);
      setRatingStats({ avg, count: rated.length, dist });
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d + "T00:00:00").toLocaleDateString("en-PH", {
      year: "numeric", month: "short", day: "numeric",
    });
  };

  if (loading)
    return (
      <div className="sd-loading">
        <div className="sd-spinner" />
        <p>Fetching service details…</p>
      </div>
    );

  if (error || !service)
    return (
      <div className="sd-error">
        <div className="sd-error__icon">🐾</div>
        <h4 className="sd-error__msg">{error || "Service not found"}</h4>
        <button className="sd-btn-back" onClick={() => navigate("../services")}>
          Back to Services
        </button>
      </div>
    );

  return (
    <div className="sd-page">
      <div className="sd-container">

        <button className="sd-back" onClick={() => navigate(-1)}>← Back</button>

        <div className="sd-card">
          <div className="sd-card__image">
            <img src={service.image} alt={service.title} className="sd-card__img" />
            <div className="sd-card__img-badge">🐾 Professional Grooming</div>
          </div>

          <div className="sd-card__info">
            <span className="sd-card__tag">Service Details</span>
            <h2 className="sd-card__title">{service.title}</h2>

            {ratingStats.count > 0 ? (
              <div className="sd-rating-summary">
                <span className="sd-rating-summary__avg">{ratingStats.avg.toFixed(1)}</span>
                <StarDisplay value={ratingStats.avg} size="sm" />
                <span className="sd-rating-summary__count">
                  {ratingStats.count} review{ratingStats.count !== 1 ? "s" : ""}
                </span>
              </div>
            ) : (
              <p className="sd-rating-summary__none">No reviews yet — be the first!</p>
            )}

            <p className="sd-card__desc">{service.fullDescription}</p>

            {service.hygieneIncludes?.length > 0 && (
              <div className="sd-includes">
                <h5 className="sd-includes__heading">🛁 Pet Hygiene Includes:</h5>
                <ul className="sd-includes__list">
                  {service.hygieneIncludes.map((item, idx) => (
                    <li key={idx} className="sd-includes__item">
                      <span className="sd-includes__dot" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="sd-card__price">₱{service.price}</div>

            <button className="sd-btn-book" onClick={() => navigate("../bookings", { state: { service } })}>
              Book This Service 🐾
            </button>
          </div>
        </div>

        <div className="sd-footer">
          {service.notes?.length > 0 && (
            <div className="sd-notes">
              {service.notes.map((note, idx) => (
                <p key={idx} className="sd-notes__item">* {note}</p>
              ))}
            </div>
          )}
          {service.cancellationPolicy && (
            <div className="sd-policy">
              <h6 className="sd-policy__heading">📋 Cancellation Policy</h6>
              <p className="sd-policy__text">{service.cancellationPolicy}</p>
            </div>
          )}
        </div>

        {reviews.length > 0 && (
          <div className="sd-reviews">
            <h4 className="sd-reviews__heading">⭐ Customer Reviews</h4>

            <div className="sd-reviews__overview">
              <div className="sd-reviews__big-avg">
                <span className="sd-reviews__avg-num">{ratingStats.avg.toFixed(1)}</span>
                <StarDisplay value={ratingStats.avg} size="lg" />
                <span className="sd-reviews__avg-label">
                  {ratingStats.count} review{ratingStats.count !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="sd-reviews__dist">
                {ratingStats.dist.map(({ star, count }) => {
                  const pct = ratingStats.count > 0 ? (count / ratingStats.count) * 100 : 0;
                  return (
                    <div key={star} className="sd-reviews__dist-row">
                      <span className="sd-reviews__dist-label">{star} ★</span>
                      <div className="sd-reviews__dist-track">
                        <div className="sd-reviews__dist-fill"
                          style={{ width: `${pct}%`, background: star >= 4 ? "#f59e0b" : star === 3 ? "#fb923c" : "#ef4444" }} />
                      </div>
                      <span className="sd-reviews__dist-count">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="sd-reviews__list">
              {reviews.slice(0, 6).map((b) => (
                <div key={b.id} className={`sd-review-card${b.feedback?.trim() ? " sd-review-card--has-feedback" : ""}`}>
                  <div className="sd-review-card__top">
                    <div className="sd-review-card__avatar">{b.fullName?.[0]?.toUpperCase() || "?"}</div>
                    <div className="sd-review-card__meta">
                      <p className="sd-review-card__name">{b.fullName}</p>
                      <p className="sd-review-card__pet">🐾 {b.petName} · {b.species}</p>
                    </div>
                    <div className="sd-review-card__right">
                      <StarDisplay value={Number(b.rating)} size="sm" />
                      <span className="sd-review-card__date">{formatDate(b.date)}</span>
                    </div>
                  </div>
                  {b.feedback?.trim() && (
                    <p className="sd-review-card__feedback">"{b.feedback}"</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}