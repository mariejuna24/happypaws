import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Table, Button, Badge, Modal } from "react-bootstrap";
import BookingDetailsModal from "./BookingDetailsModal";
import "../style/AdminStyle.css";

export default function AdminTable({ filterStatus, onAction, refreshKey }) {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 🔔 Confirmation modal state
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionData, setActionData] = useState(null); // { id, status, isLateCancel? }

  // 🕐 Re-render every minute so the no-show badge appears automatically
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

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
  }, [refreshKey]);

  // 🔄 Update Booking Status
  const updateStatus = async (id, status) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;

    await api.put(`/bookings/${id}`, { ...booking, status });

    fetchBookings();
    onAction();

    if (selectedBooking?.id === id) {
      setSelectedBooking({ ...booking, status });
    }
  };

  // 🚨 Trigger Confirmation
  const confirmAction = (id, status, isLateCancel = false) => {
    setActionData({ id, status, isLateCancel });
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (actionData) updateStatus(actionData.id, actionData.status);
    setShowConfirm(false);
    setActionData(null);
  };

  // ⏰ No-show window: 1 hour before appointment or any time after
  const inNoShowWindow = (booking) => {
    if (!booking.date || !booking.time) return false;
    const appt = new Date(`${booking.date}T${booking.time}`);
    const oneHourBefore = new Date(appt.getTime() - 60 * 60 * 1000);
    return new Date() >= oneHourBefore;
  };

  // 🎯 Filter
  const filteredBookings =
    filterStatus === "ALL"
      ? bookings
      : bookings.filter(b => b.status === filterStatus);

  // 🎨 Status Badge
  const getStatusBadge = status => {
    const map = {
      Pending:   "warning",
      Confirmed: "primary",
      Cancelled: "danger",
      Success:   "success",
    };
    return <Badge bg={map[status] || "secondary"}>{status}</Badge>;
  };

  // 🕐 Format time to 12-hour
  const formatTime = (time) => {
    if (!time) return "—";
    const [h, m] = time.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, "0")} ${period}`;
  };

  // 🐾 Resolve pet list (multi-pet aware, falls back to legacy fields)
  const getPets = (booking) => {
    if (booking.pets?.length > 0) return booking.pets;
    if (booking.petName) return [{ id: 1, petName: booking.petName, species: booking.species || "" }];
    return [];
  };

  return (
    <>
      <div className="admin-table-wrapper">
        <Table striped hover responsive className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Ref No.</th>
              <th>Owner</th>
              <th>Pet(s)</th>
              <th>Service</th>
              <th>Date & Time</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.map((b, i) => {
              const noShow  = b.status === "Confirmed" && inNoShowWindow(b);
              const petList = getPets(b);

              return (
                <tr
                  key={b.id}
                  className={[
                    b.status === "Success" ? "row-success" : "",
                    noShow                 ? "row-no-show" : "",
                  ].join(" ").trim()}
                >
                  <td>{i + 1}</td>
                  <td>
                    <code>{b.refNumber || "—"}</code>
                  </td>
                  <td>{b.fullName}<br /><small>{b.phone}</small></td>

                  {/* ── Pet(s) column — multi-pet aware ── */}
                  <td>
                    {petList.map((pet, idx) => (
                      <div key={pet.id ?? idx}>
                        {pet.petName}
                        <br />
                        <small>{pet.species}</small>
                      </div>
                    ))}
                    {petList.length > 1 && (
                      <span className="pet-count">({petList.length} pets)</span>
                    )}
                  </td>

                  <td>{b.serviceTitle}</td>
                  <td>
                    {b.date || "—"}<br />
                    <small>{formatTime(b.time)}</small>
                    {noShow && (
                      <div>
                        <span className="no-show-badge">⏰ No-show window</span>
                      </div>
                    )}
                  </td>
                  <td>₱{b.totalPrice?.toFixed(2)}</td>
                  <td>{getStatusBadge(b.status)}</td>

                  <td>
                    <div className="d-flex flex-wrap gap-1">

                      {/* ── View — always visible ── */}
                      <Button
                        size="sm"
                        variant="info"
                        onClick={() => { setSelectedBooking(b); setShowModal(true); }}
                      >
                        View
                      </Button>

                      {/* ── Pending: Confirm + Cancel ── */}
                      {b.status === "Pending" && (
                        <>
                          <Button size="sm" variant="primary"
                            onClick={() => confirmAction(b.id, "Confirmed")}>
                            Confirm
                          </Button>
                          <Button size="sm" variant="danger"
                            onClick={() => confirmAction(b.id, "Cancelled")}>
                            Cancel
                          </Button>
                        </>
                      )}

                      {/* ── Confirmed: Cancel + Mark Success ── */}
                      {b.status === "Confirmed" && (
                        <>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => confirmAction(b.id, "Cancelled", noShow)}
                            title={noShow ? "Cancel due to no-show" : "Cancel this booking"}
                          >
                            {noShow ? "⏰ No-show" : "Cancel"}
                          </Button>

                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => confirmAction(b.id, "Success")}
                          >
                            Mark Success
                          </Button>
                        </>
                      )}

                      {/* Cancelled / Success: View only */}

                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      {/* Booking Details Modal */}
      <BookingDetailsModal
        booking={selectedBooking}
        show={showModal}
        onHide={() => setShowModal(false)}
        onUpdateStatus={updateStatus}
      />

      {/* 🔔 Confirmation Modal */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {actionData?.isLateCancel ? "⏰ No-Show Cancellation" : "Confirm Action"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {actionData?.isLateCancel ? (
            <>
              <p>
                The appointment time has passed (or is within 1 hour) and the customer
                has <strong>not shown up</strong>.
              </p>
              <p className="mb-0">
                Are you sure you want to <strong>cancel this booking</strong> as a no-show?
              </p>
            </>
          ) : (
            <p className="mb-0">
              Are you sure you want to{" "}
              <strong>
                {actionData?.status === "Confirmed" && "confirm"}
                {actionData?.status === "Cancelled" && "cancel"}
                {actionData?.status === "Success"   && "mark as success"}
              </strong>{" "}
              this booking?
            </p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>No</Button>
          <Button
            variant={
              actionData?.status === "Cancelled" ? "danger"
              : actionData?.status === "Confirmed" ? "primary"
              : "success"
            }
            onClick={handleConfirm}
          >
            Yes, Continue
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}