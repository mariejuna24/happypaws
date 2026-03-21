import React, { useEffect, useState } from "react";
import api from "../services/api";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import "../style/AdminStyle.css";

export default function BookingCalendar() {
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookingsForDate, setBookingsForDate] = useState([]);

  // 🔔 Confirmation state
  const [pendingAction, setPendingAction] = useState(null); // { id, status }

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const filtered = bookings
      .filter((b) => b.date === dateStr)
      .sort((a, b) => a.time.localeCompare(b.time));
    setBookingsForDate(filtered);
  }, [selectedDate, bookings]);

  const updateStatus = async (id, status) => {
    const booking = bookings.find((b) => b.id === id);
    if (!booking) return;
    await api.put(`/bookings/${id}`, { ...booking, status });
    fetchBookings();
  };

  const confirmAction = (id, status) => setPendingAction({ id, status });

  const handleConfirm = () => {
    if (pendingAction) updateStatus(pendingAction.id, pendingAction.status);
    setPendingAction(null);
  };

  const STATUS_META = {
    Pending:   { mod: "pending",   icon: "⏳" },
    Confirmed: { mod: "confirmed", icon: "✅" },
    Cancelled: { mod: "cancelled", icon: "❌" },
    Success:   { mod: "success",   icon: "🏆" },
  };

  const ACTION_LABEL = {
    Confirmed: "confirm",
    Cancelled: "cancel",
    Success:   "mark as success",
  };

  return (
    <div className="bc-wrapper">

      {/* ── Calendar Panel ────────────────────── */}
      <div className="bc-calendar-panel">
        <div className="bc-panel-header">
          <span className="bc-panel-header__icon">📅</span>
          <h5 className="bc-panel-header__title">Booking Calendar</h5>
        </div>

        <Calendar
          value={selectedDate}
          onChange={setSelectedDate}
          className="bc-calendar"
          tileContent={({ date, view }) => {
            if (view === "month") {
              const dateStr = format(date, "yyyy-MM-dd");
              const count = bookings.filter((b) => b.date === dateStr).length;
              if (count > 0) {
                return <div className="bc-tile-badge">{count}</div>;
              }
            }
            return null;
          }}
        />
      </div>

      {/* ── Bookings List Panel ───────────────── */}
      <div className="bc-list-panel">
        <div className="bc-panel-header">
          <span className="bc-panel-header__icon">🐾</span>
          <h5 className="bc-panel-header__title">
            Bookings — {format(selectedDate, "MMMM dd, yyyy")}
          </h5>
          {bookingsForDate.length > 0 && (
            <span className="bc-count-badge">{bookingsForDate.length}</span>
          )}
        </div>

        {bookingsForDate.length === 0 ? (
          <div className="bc-empty">
            <span className="bc-empty__icon">🐶</span>
            <p className="bc-empty__text">No bookings for this date.</p>
          </div>
        ) : (
          <div className="bc-list">
            {bookingsForDate.map((b) => {
              const meta = STATUS_META[b.status] || { mod: "default", icon: "📌" };
              return (
                <div key={b.id} className="bc-item">

                  <div className="bc-item__info">
                    <strong className="bc-item__service">{b.serviceTitle}</strong>
                    <div className="bc-item__details">
                      <span className="bc-item__detail">👤 {b.fullName}</span>
                      <span className="bc-item__detail">🐾 {b.petName}</span>
                      <span className="bc-item__detail">🕐 {b.time}</span>
                      <span className="bc-item__detail">₱{b.totalPrice?.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bc-item__actions">
                    <span className={`bc-status bc-status--${meta.mod}`}>
                      {meta.icon} {b.status}
                    </span>

                    {/* Pending: Confirm + Cancel */}
                    {b.status === "Pending" && (
                      <div className="bc-btn-group">
                        <button
                          className="bc-btn bc-btn--confirm"
                          onClick={() => confirmAction(b.id, "Confirmed")}
                        >
                          Confirm
                        </button>
                        <button
                          className="bc-btn bc-btn--cancel"
                          onClick={() => confirmAction(b.id, "Cancelled")}
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {/* Confirmed: Mark Success only */}
                    {b.status === "Confirmed" && (
                      <button
                        className="bc-btn bc-btn--success"
                        onClick={() => confirmAction(b.id, "Success")}
                      >
                        Mark Success
                      </button>
                    )}

                    {/* Cancelled / Success: status badge only — no further actions */}

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Inline Confirmation Prompt ────────── */}
      {pendingAction && (
        <div className="bc-confirm-overlay">
          <div className="bc-confirm-box">
            <p className="bc-confirm-box__text">
              Are you sure you want to{" "}
              <strong>{ACTION_LABEL[pendingAction.status]}</strong> this booking?
            </p>
            <div className="bc-confirm-box__actions">
              <button
                className="bc-btn bc-btn--cancel"
                onClick={() => setPendingAction(null)}
              >
                No
              </button>
              <button
                className={`bc-btn ${
                  pendingAction.status === "Cancelled"
                    ? "bc-btn--cancel"
                    : pendingAction.status === "Confirmed"
                    ? "bc-btn--confirm"
                    : "bc-btn--success"
                }`}
                onClick={handleConfirm}
              >
                Yes, Continue
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}