import React, { useEffect, useState } from "react";
import { getAllBookings, getServices } from "../services/api"; // ← Firebase
import "../style/admin.css";

const StarDisplay = ({ rating, size = "sm" }) => (
  <div className={`ar-stars ar-stars--${size}`}>
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} style={{ color: s <= rating ? "#f59e0b" : "#d1d5db" }}>★</span>
    ))}
  </div>
);

export default function AdminRatings() {
  const [bookings,  setBookings]  = useState([]);
  const [services,  setServices]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [filterService, setFilterService] = useState("ALL");
  const [filterStar,    setFilterStar]    = useState("ALL");
  const [sortBy,        setSortBy]        = useState("newest");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // ← Firebase: both use our api functions
        const [allBookings, allServices] = await Promise.all([
          getAllBookings(),
          getServices(),
        ]);
        setBookings(allBookings);
        setServices(allServices);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const rated = bookings.filter((b) => b.rating);

  const serviceStats = services.map((svc) => {
    const svcRatings = rated.filter(
      (b) => b.serviceId === svc.id || b.serviceTitle === svc.title
    );
    const avg = svcRatings.length > 0
      ? svcRatings.reduce((s, b) => s + Number(b.rating), 0) / svcRatings.length
      : null;
    const dist = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: svcRatings.filter((b) => Number(b.rating) === star).length,
    }));
    return { ...svc, ratingCount: svcRatings.length, avg, dist };
  }).filter((s) => s.ratingCount > 0);

  const totalRated  = rated.length;
  const overallAvg  = totalRated > 0
    ? (rated.reduce((s, b) => s + Number(b.rating), 0) / totalRated).toFixed(1)
    : "—";
  const fiveStarPct = totalRated > 0
    ? Math.round((rated.filter((b) => Number(b.rating) === 5).length / totalRated) * 100)
    : 0;

  const filtered = rated
    .filter((b) => filterService === "ALL" || b.serviceTitle === filterService)
    .filter((b) => filterStar    === "ALL" || Number(b.rating) === Number(filterStar))
    .sort((a, b) => {
      if (sortBy === "newest")  return new Date(b.date) - new Date(a.date);
      if (sortBy === "highest") return Number(b.rating) - Number(a.rating);
      if (sortBy === "lowest")  return Number(a.rating) - Number(b.rating);
      return 0;
    });

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d + "T00:00:00").toLocaleDateString("en-PH", {
      year: "numeric", month: "short", day: "numeric",
    });
  };

  if (loading) return (
    <div className="ar-loading">
      <div className="ar-spinner" />
      <p>Loading ratings…</p>
    </div>
  );

  return (
    <div className="ar-page">

      <div className="ar-header">
        <div className="ar-header__left">
          <span className="ar-header__icon">⭐</span>
          <div>
            <h3 className="ar-header__title">Ratings & Reviews</h3>
            <p className="ar-header__sub">{totalRated} review{totalRated !== 1 ? "s" : ""} from customers</p>
          </div>
        </div>
      </div>

      <div className="ar-summary">
        <div className="ar-summary-card ar-summary-card--avg">
          <span className="ar-summary-card__icon">⭐</span>
          <div>
            <p className="ar-summary-card__value">{overallAvg}</p>
            <p className="ar-summary-card__label">Overall Rating</p>
          </div>
        </div>
        <div className="ar-summary-card ar-summary-card--total">
          <span className="ar-summary-card__icon">💬</span>
          <div>
            <p className="ar-summary-card__value">{totalRated}</p>
            <p className="ar-summary-card__label">Total Reviews</p>
          </div>
        </div>
        <div className="ar-summary-card ar-summary-card--five">
          <span className="ar-summary-card__icon">🏆</span>
          <div>
            <p className="ar-summary-card__value">{fiveStarPct}%</p>
            <p className="ar-summary-card__label">5-Star Rate</p>
          </div>
        </div>
        <div className="ar-summary-card ar-summary-card--services">
          <span className="ar-summary-card__icon">✂️</span>
          <div>
            <p className="ar-summary-card__value">{serviceStats.length}</p>
            <p className="ar-summary-card__label">Rated Services</p>
          </div>
        </div>
      </div>

      <div className="ar-tabs">
        <button className={`ar-tab${activeTab === "overview" ? " ar-tab--active" : ""}`} onClick={() => setActiveTab("overview")}>
          📊 By Service
        </button>
        <button className={`ar-tab${activeTab === "reviews" ? " ar-tab--active" : ""}`} onClick={() => setActiveTab("reviews")}>
          💬 All Reviews
          {totalRated > 0 && <span className="ar-tab__badge">{totalRated}</span>}
        </button>
      </div>

      {totalRated === 0 ? (
        <div className="ar-empty">
          <span className="ar-empty__icon">⭐</span>
          <p className="ar-empty__title">No ratings yet</p>
          <p className="ar-empty__sub">Ratings will appear here once customers review their completed bookings.</p>
        </div>
      ) : (
        <>
          {activeTab === "overview" && (
            <div className="ar-overview">
              {serviceStats.length === 0 ? (
                <div className="ar-empty"><p>No service ratings yet.</p></div>
              ) : (
                serviceStats.map((svc) => (
                  <div key={svc.id} className="ar-svc-card">
                    <div className="ar-svc-card__top">
                      <img src={svc.image || "https://placehold.co/60x60?text=🐾"} alt={svc.title}
                        className="ar-svc-card__img"
                        onError={e => { e.target.src = "https://placehold.co/60x60?text=🐾"; }} />
                      <div className="ar-svc-card__info">
                        <p className="ar-svc-card__title">{svc.title}</p>
                        <p className="ar-svc-card__count">{svc.ratingCount} review{svc.ratingCount !== 1 ? "s" : ""}</p>
                      </div>
                      <div className="ar-svc-card__avg-wrap">
                        <span className="ar-svc-card__avg">{svc.avg.toFixed(1)}</span>
                        <StarDisplay rating={Math.round(svc.avg)} size="md" />
                      </div>
                    </div>
                    <div className="ar-dist">
                      {svc.dist.map(({ star, count }) => {
                        const pct = svc.ratingCount > 0 ? (count / svc.ratingCount) * 100 : 0;
                        return (
                          <div key={star} className="ar-dist__row">
                            <span className="ar-dist__label">{star} ★</span>
                            <div className="ar-dist__bar-track">
                              <div className="ar-dist__bar-fill"
                                style={{ width: `${pct}%`, background: star >= 4 ? "#f59e0b" : star === 3 ? "#fb923c" : "#ef4444" }} />
                            </div>
                            <span className="ar-dist__count">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="ar-reviews">
              <div className="ar-filters">
                <select className="ar-select" value={filterService} onChange={e => setFilterService(e.target.value)}>
                  <option value="ALL">All Services</option>
                  {[...new Set(rated.map(b => b.serviceTitle))].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <select className="ar-select" value={filterStar} onChange={e => setFilterStar(e.target.value)}>
                  <option value="ALL">All Stars</option>
                  {[5, 4, 3, 2, 1].map(s => <option key={s} value={s}>{s} Star{s !== 1 ? "s" : ""}</option>)}
                </select>
                <select className="ar-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="newest">Newest First</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                </select>
                <span className="ar-filters__count">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
              </div>

              <div className="ar-table-wrap">
                <table className="ar-table">
                  <thead>
                    <tr>
                      <th>#</th><th>Customer</th><th>Pet</th><th>Service</th>
                      <th>Date</th><th>Rating</th><th>Ref No.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((b, i) => (
                      <tr key={b.id}>
                        <td>{i + 1}</td>
                        <td><strong>{b.fullName}</strong><br /><small>{b.phone}</small></td>
                        <td>{b.petName}<br /><small>{b.species}</small></td>
                        <td>{b.serviceTitle}</td>
                        <td>{formatDate(b.date)}</td>
                        <td>
                          <div className="ar-table__rating">
                            <StarDisplay rating={Number(b.rating)} size="sm" />
                            <span className="ar-table__rating-num">{b.rating}/5</span>
                          </div>
                        </td>
                        <td><code className="ar-table__ref">{b.refNumber || "—"}</code></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="ar-empty ar-empty--inline"><p>No reviews match the selected filters.</p></div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}