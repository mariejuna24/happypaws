import React from "react";
import { Modal, Button, Row, Col, Badge } from "react-bootstrap";

export default function BookingDetailsModal({ booking, show, onHide, onUpdateStatus }) {
  if (!booking) return null;

  const getStatusBadge = (status) => {
    const map = {
      Pending: "warning",
      Confirmed: "primary",
      Cancelled: "danger",
      Success: "success",
    };
    return <Badge bg={map[status] || "secondary"}>{status}</Badge>;
  };

  const InfoRow = ({ label, value }) => (
    <Row className="mb-2">
      <Col xs={4} className="fw-bold">{label}:</Col>
      <Col xs={8}>{value || "—"}</Col>
    </Row>
  );

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Booking Details - {booking.serviceTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3 text-center">
          Status: {getStatusBadge(booking.status)}
        </div>

        <Row>
          <Col md={6}>
            <InfoRow label="Customer" value={booking.fullName} />
            <InfoRow label="Phone" value={booking.phone} />
            <InfoRow label="Email" value={booking.email} />
            <InfoRow label="Pet Name" value={booking.petName} />
            <InfoRow label="Breed" value={booking.species} />
          </Col>
          <Col md={6}>
            <InfoRow label="Service" value={booking.serviceTitle} />
            <InfoRow label="Date" value={booking.date} />
            <InfoRow label="Time" value={booking.time} />
            <InfoRow label="Total Price" value={`₱${booking.totalPrice?.toFixed(2)}`} />
            <InfoRow label="Notes" value={booking.notes} />
            {booking.addOns && booking.addOns.length > 0 && (
              <InfoRow
                label="Add-Ons"
                value={booking.addOns.map((a, i) => (
                  <Badge bg="info" text="dark" key={i} className="me-1">{a.name} ₱{parseFloat(a.price).toFixed(2)}</Badge>
                ))}
              />
            )}
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        {booking.status === "Pending" && (
          <>
            <Button variant="success" onClick={() => onUpdateStatus(booking.id, "Confirmed")}>Confirm</Button>
            <Button variant="danger" onClick={() => onUpdateStatus(booking.id, "Cancelled")}>Cancel</Button>
          </>
        )}
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
