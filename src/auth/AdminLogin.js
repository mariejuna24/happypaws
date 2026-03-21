import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield, FaArrowLeft } from "react-icons/fa";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "123") {
      localStorage.setItem("user", JSON.stringify({ username, role: "admin" }));
      navigate("/admin");
    } else {
      alert("Invalid admin credentials!");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fdf3e3, #fbdfbb)"
      }}
    >
      <div
        className="card shadow-lg p-4 position-relative"
        style={{
          width: "100%",
          maxWidth: "420px",
          borderRadius: "20px",
          border: "none"
        }}
      >
        {/* 🔙 Back to Site */}
        <button
          className="btn btn-light position-absolute"
          style={{ top: "15px", left: "15px", borderRadius: "50%" }}
          onClick={() => navigate("/user/home")}
        >
          <FaArrowLeft />
        </button>

        <div className="text-center mb-4 mt-2">
          <FaUserShield size={34} color="#fd610d" />
          <h3 className="fw-bold mt-2 text-dark">Admin Portal</h3>
          <p style={{ fontSize: "14px", color: "#666" }}>
            Authorized personnel only
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <input
              type="text"
              className="form-control p-2"
              placeholder="Enter admin username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ borderRadius: "10px" }}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control p-2"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ borderRadius: "10px" }}
              required
            />
          </div>

          <button
            type="submit"
            className="btn w-100 fw-semibold"
            style={{
              backgroundColor: "#fd750d",
              color: "white",
              borderRadius: "10px"
            }}
          >
            Login as Admin
          </button>
        </form>
      </div>
    </div>
  );
}
