import React, { useState, useEffect, useRef } from "react";
import { FaCalendarAlt, FaBrush, FaDog, FaPaw, FaStar } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { getBookingsByUser, updateBookingRating } from "../services/api"; // ← Firebase
import "../style/Navbar.css";

export default function MyBookings() {
  const { state }    = useLocation();
  const navigate     = useNavigate();
  const newRefNumber = state?.newRefNumber || null;

  const [bookings,   setBookings]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showBanner, setShowBanner] = useState(!!newRefNumber);
  const [activeTab,  setActiveTab]  = useState("current");
  const newCardRef = useRef(null);

  const loggedUser = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getBookingsByUser(loggedUser.uid); // ← Firebase
        const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setBookings(sorted);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (newRefNumber) setActiveTab("current");
  }, [newRefNumber]);

  useEffect(() => {
    if (!loading && newRefNumber && newCardRef.current) {
      setTimeout(() => {
        newCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [loading, newRefNumber]);

  useEffect(() => {
    if (showBanner) {
      const t = setTimeout(() => setShowBanner(false), 7000);
      return () => clearTimeout(t);
    }
  }, [showBanner]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "—";
    const [h, m] = timeStr.split(":").map(Number);
    const suffix = h >= 12 ? "PM" : "AM";
    const hour   = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
  };

  /* ── Rating & Feedback state ── */
  const [hoveredRating,    setHoveredRating]    = useState({});
  const [pendingRating,    setPendingRating]     = useState({});
  const [feedbackText,     setFeedbackText]      = useState({});
  const [submittingRating, setSubmittingRating]  = useState(null);

  const handleStarClick = (bookingId, star) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking || booking.rating) return;
    setPendingRating(p => ({ ...p, [bookingId]: star }));
  };

  const submitRating = async (bookingId) => {
    const star     = pendingRating[bookingId];
    const feedback = (feedbackText[bookingId] || "").trim();
    if (!star) return;
    setSubmittingRating(bookingId);
    try {
      await updateBookingRating(bookingId, star, feedback || null); // ← Firebase
      setBookings(prev =>
        prev.map(b => b.id === bookingId ? { ...b, rating: star, feedback: feedback || null } : b)
      );
      setPendingRating(p  => { const n = { ...p };  delete n[bookingId]; return n; });
      setFeedbackText(p   => { const n = { ...p };  delete n[bookingId]; return n; });
    } catch (err) {
      console.error("Failed to submit rating:", err);
    } finally {
      setSubmittingRating(null);
    }
  };

  const currentBookings = bookings.filter((b) =>
    ["pending", "confirmed"].includes(b.status?.toLowerCase())
  );
  const historyBookings = bookings.filter((b) =>
    ["success", "cancelled"].includes(b.status?.toLowerCase())
  );

  const displayed = activeTab === "current" ? currentBookings : historyBookings;

  /* ── helper: resolve pet list from booking ── */
  const getPets = (booking) => {
    if (booking.pets?.length > 0) return booking.pets;
    if (booking.petName) return [{ id: 1, petName: booking.petName, species: booking.species || "" }];
    return [];
  };

  return (
    <div className="mb-page">
      <div className="mb-container">

        {/* ── Confirmation Banner ── */}
        {showBanner && newRefNumber && (
          <div className="mb-banner">
            <div className="mb-banner__icon">🎉</div>
            <div className="mb-banner__body">
              <p className="mb-banner__title">Booking Confirmed!</p>
              <p className="mb-banner__sub">
                Your reference number is&nbsp;
                <strong className="mb-banner__ref">{newRefNumber}</strong>.
                Please keep this for your records.
              </p>
            </div>
            <button className="mb-banner__close" onClick={() => setShowBanner(false)}>✕</button>
          </div>
        )}

        {/* ── Page Heading ── */}
        <div className="mb-heading">
          <div className="mb-heading__icon"><FaPaw color="#7a4419"/></div>
          <div>
            <h2 className="mb-heading__title">My Bookings</h2>
            <p className="mb-heading__sub">Track all your grooming appointments</p>
          </div>
        </div>

        {/* ── Tabs ── */}
        {!loading && (
          <div className="mb-tabs">
            <button
              className={`mb-tab${activeTab === "current" ? " mb-tab--active" : ""}`}
              onClick={() => setActiveTab("current")}
            >
              <span className="mb-tab__icon"></span>
              Current
              {currentBookings.length > 0 && (
                <span className={`mb-tab__badge${activeTab === "current" ? " mb-tab__badge--active" : ""}`}>
                  {currentBookings.length}
                </span>
              )}
            </button>

            <button
              className={`mb-tab${activeTab === "history" ? " mb-tab--active mb-tab--history" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              <span className="mb-tab__icon"></span>
              History
              {historyBookings.length > 0 && (
                <span className={`mb-tab__badge${activeTab === "history" ? " mb-tab__badge--active" : ""}`}>
                  {historyBookings.length}
                </span>
              )}
            </button>
          </div>
        )}

        {/* ── Content ── */}
        {loading ? (
          <div className="mb-loading">
            <div className="mb-spinner" />
            <p>Loading your bookings…</p>
          </div>

        ) : displayed.length === 0 ? (
          <div className="mb-empty">
            {activeTab === "current" ? (
              <>
                <div className="mb-empty__icon"><FaDog/></div>
                <p className="mb-empty__title">No active bookings</p>
                <p className="mb-empty__sub">You don't have any pending or confirmed appointments.</p>
                <button className="mb-empty__btn" onClick={() => navigate("/user/services")}>
                  Book a Service 
                </button>
              </>
            ) : (
              <>
                <div className="mb-empty__icon"><FaCalendarAlt/></div>
                <p className="mb-empty__title">No booking history</p>
                <p className="mb-empty__sub">Completed and cancelled bookings will appear here.</p>
              </>
            )}
          </div>

        ) : (
          <div className="mb-list">
            {displayed.map((booking) => {
              const isNew     = booking.refNumber === newRefNumber;
              const status    = booking.status?.toLowerCase() || "pending";
              const isHistory = activeTab === "history";
              const isSuccess = status === "success";
              const chosen    = pendingRating[booking.id];
              const petList   = getPets(booking); // ← multi-pet

              return (
                <div
                  key={booking.id}
                  ref={isNew ? newCardRef : null}
                  className={`mb-card${isNew ? " mb-card--new" : ""}${isHistory ? " mb-card--history" : ""}`}
                >
                  {isNew && <span className="mb-card__new-badge">New ✓</span>}

                  {/* ── Top row ── */}
                  <div className="mb-card__top">
                    <div className="mb-card__service-wrap">
                      <div className="mb-card__service-icon">{isHistory ? <FaBrush size={20} color="#7a4419"/> : <FaDog size={20} color="#7a4419"/>}</div>
                      <div>
                        <p className="mb-card__service-title">{booking.serviceTitle}</p>
                        {/* ── Multi-pet list ── */}
                        {petList.length > 1 ? (
                          <div className="mb-card__pet-list">
                            {petList.map((pet, idx) => (
                              <p key={pet.id ?? idx} className="mb-card__pet-line">
                                🐾 {pet.petName}
                                <span className="mb-card__species"> · {pet.species}</span>
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p className="mb-card__pet-line">
                            {petList[0]?.petName}
                            <span className="mb-card__species"> · {petList[0]?.species}</span>
                          </p>
                        )}
                      </div>
                    </div>
                    <span className={`mb-card__status mb-card__status--${status}`}>
                      {booking.status}
                    </span>
                  </div>

                  {/* ── Price ── */}
                  <div className="mb-card__price-block">
                    <span className="mb-card__price-label">Total Price</span>
                    <span className="mb-card__price-value">
                      ₱{Number(booking.totalPrice || booking.servicePrice || 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="mb-card__divider" />

                  {/* ── Info rows ── */}
                  <div className="mb-card__info-grid">
                    <div className="mb-card__info-row">
                      <span className="mb-card__info-label"><FaCalendarAlt/> Appointment</span>
                      <span className="mb-card__info-value">
                        {formatDate(booking.date)}&nbsp;
                        <span className="mb-card__time">at {formatTime(booking.time)}</span>
                      </span>
                    </div>

                    {booking.addOns?.length > 0 && (
                      <div className="mb-card__info-row mb-card__info-row--addons">
                        <span className="mb-card__info-label"> Add-ons</span>
                        <div className="mb-card__addons">
                          {booking.addOns.map((a) => (
                            <span key={a.id} className="mb-card__addon-tag">{a.name}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mb-card__divider mb-card__divider--dashed" />

                  {/* ── Reference number ── */}
                  <div className="mb-card__ref">
                    <span className="mb-card__ref-label"># Reference No.</span>
                    <code className="mb-card__ref-value">{booking.refNumber || "—"}</code>
                  </div>

                  {/* ════════════════════════════════
                      RATING + FEEDBACK
                      Only for successful bookings
                  ════════════════════════════════ */}
                  {isSuccess && (
                    <div className="mb-card__rating">
                      <div className="mb-card__divider mb-card__divider--dashed" style={{ margin: "0.75rem 0" }} />

                      {booking.rating ? (
                        <div className="mb-rating__done">
                          <div className="mb-rating__done-top">
                            <div className="mb-rating__stars">
                              {[1, 2, 3, 4, 5].map(star => (
                                <FaStar
                                  key={star}
                                  style={{ color: star <= booking.rating ? "#f59e0b" : "#d1d5db" }}
                                />
                              ))}
                            </div>
                            <span className="mb-rating__thanks">Thanks for your feedback! 🐾</span>
                          </div>
                          {booking.feedback && (
                            <p className="mb-rating__submitted-feedback">
                              "{booking.feedback}"
                            </p>
                          )}
                        </div>

                      ) : (
                        <div className="mb-rating__prompt">
                          <p className="mb-rating__label">How was your experience?</p>

                          <div className="mb-rating__stars">
                            {[1, 2, 3, 4, 5].map(star => (
                              <FaStar
                                key={star}
                                className="mb-rating__star"
                                style={{
                                  color: star <= (hoveredRating[booking.id] ?? chosen ?? 0)
                                    ? "#f59e0b"
                                    : "#d1d5db",
                                  cursor: "pointer",
                                  transition: "color 0.15s ease",
                                  fontSize: "1.4rem",
                                }}
                                onMouseEnter={() => setHoveredRating(p => ({ ...p, [booking.id]: star }))}
                                onMouseLeave={() => setHoveredRating(p => ({ ...p, [booking.id]: 0 }))}
                                onClick={() => handleStarClick(booking.id, star)}
                              />
                            ))}
                          </div>

                          {chosen && (
                            <div className="mb-feedback">
                              <label className="mb-feedback__label">
                                Leave a comment
                                <span className="mb-feedback__optional"> (optional)</span>
                              </label>
                              <textarea
                                className="mb-feedback__textarea"
                                placeholder="Tell us about your experience…"
                                rows={3}
                                maxLength={300}
                                value={feedbackText[booking.id] || ""}
                                onChange={e =>
                                  setFeedbackText(p => ({ ...p, [booking.id]: e.target.value }))
                                }
                              />
                              <div className="mb-feedback__footer">
                                <span className="mb-feedback__char-count">
                                  {(feedbackText[booking.id] || "").length} / 300
                                </span>
                                <button
                                  className="mb-feedback__submit"
                                  onClick={() => submitRating(booking.id)}
                                  disabled={submittingRating === booking.id}
                                >
                                  {submittingRating === booking.id ? "Submitting…" : "Submit Review 🐾"}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}