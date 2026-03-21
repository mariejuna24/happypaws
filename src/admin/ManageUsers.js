import React, { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../services/api"; // ← Firebase
import { Table, Button, Badge, Modal } from "react-bootstrap";

export default function ManageUsers({ refreshKey }) {
  const [users,        setUsers]        = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal,    setShowModal]    = useState(false);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers(); // ← Firebase
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => { fetchUsers(); }, [refreshKey]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(id); // ← Firebase
      fetchUsers();
    }
  };

  const getRoleBadge = role => {
    const map = { admin: "danger", user: "primary" };
    return <Badge bg={map[role] || "secondary"}>{role || "User"}</Badge>;
  };

  return (
    <>
      <div className="admin-table-wrapper">
        <h3 className="mb-3">Manage Users</h3>
        <Table striped hover responsive className="admin-table">
          <thead>
            <tr>
              <th>#</th><th>User</th><th>Email</th><th>Role</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id} className={u.role === "admin" ? "row-admin" : ""}>
                <td>{i + 1}</td>
                <td>
                  <strong>{u.name}</strong><br />
                  <small>UID: {u.uid || u.id}</small>
                </td>
                <td>{u.email}</td>
                <td>{getRoleBadge(u.role)}</td>
                <td>
                  <div className="d-flex flex-wrap gap-1">
                    <Button size="sm" variant="info" onClick={() => { setSelectedUser(u); setShowModal(true); }}>View</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(u.id)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>UID:</strong> {selectedUser.uid || selectedUser.id}</p>
              <p><strong>Role:</strong> {selectedUser.role || "User"}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}