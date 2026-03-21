import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../style/AdminStyle.css";

export default function AdminStats({ onFilter, filterStatus, refreshKey }) {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0,
    avgRating: null,
    ratingCount: 0,
  });

  const fetchStats = async () => {
    const res = await api.get("/bookings");
    const bookings = res.data;

    const rated = bookings.filter((b) => b.rating);
    const avgRating =
      rated.length > 0
        ? (rated.reduce((sum, b) => sum + Number(b.rating), 0) / rated.length).toFixed(1)
        : null;

    setStats({
      total:       bookings.length,
      pending:     bookings.filter((b) => b.status === "Pending").length,
      confirmed:   bookings.filter((b) => b.status === "Confirmed").length,
      cancelled:   bookings.filter((b) => b.status === "Cancelled").length,
      completed:   bookings.filter((b) => b.status === "Success").length,
      avgRating,
      ratingCount: rated.length,
    });
  };

  useEffect(() => {
    fetchStats();
  }, [refreshKey]);

  const CARDS = [
    { label: "Total",     value: stats.total,     status: "ALL",       mod: "total"     },
    { label: "Pending",   value: stats.pending,   status: "Pending",   mod: "pending"   },
    { label: "Confirmed", value: stats.confirmed, status: "Confirmed", mod: "confirmed" },
    { label: "Cancelled", value: stats.cancelled, status: "Cancelled", mod: "cancelled" },
    { label: "Completed", value: stats.completed, status: "Success",   mod: "success"   },
  ];

  return (
    <div className="as-wrapper">

      {/* ── Stat Cards ── */}
      <div className="as-grid">
        {CARDS.map(({ label, value, status, icon, mod }) => (
          <button
            key={status}
            className={`as-card as-card--${mod} ${
              filterStatus === status ? "as-card--active" : ""
            }`}
            onClick={() => onFilter(status)}
          >

            <div className="as-card__body">
              <span className="as-card__value">{value}</span>
              <span className="as-card__label">{label}</span>
            </div>
            {filterStatus === status && <div className="as-card__indicator" />}
          </button>
        ))}
      </div>
    </div>
  );
}