import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { FaArrowLeft, FaPaw } from "react-icons/fa";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const res = await api.get(`/users?email=${encodeURIComponent(email)}`);
      if (res.data.length > 0) {
        const user = res.data[0];
        if (user.password === password) {
          localStorage.setItem("user", JSON.stringify({ ...user, role: "user" }));
          navigate("/user/home");
        } else {
          alert("Incorrect password. Please try again.");
        }
      } else {
        alert("User not found. Please sign up first.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred while logging in. Please try again.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fdf2e9, #ffe5d0)"
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
        {/* 🔙 Back Button */}
        <button
          className="btn btn-light position-absolute"
          style={{ top: "15px", left: "15px", borderRadius: "50%" }}
          onClick={() => navigate("/user/home")}
        >
          <FaArrowLeft />
        </button>

        <div className="text-center mb-4 mt-2">
          <FaPaw size={32} color="#ff914d" />
          <h3 className="fw-bold mt-2" style={{ color: "#ff914d" }}>
            Welcome Back
          </h3>
          <p style={{ fontSize: "14px", color: "#777" }}>
            Login to continue booking services 🐾
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control p-2"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ borderRadius: "10px" }}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control p-2"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ borderRadius: "10px" }}
              required
            />
          </div>

          <button
            type="submit"
            className="btn w-100 mb-3 fw-semibold"
            style={{
              backgroundColor: "#ff914d",
              color: "white",
              borderRadius: "10px"
            }}
          >
            Login
          </button>

          <p className="text-center mb-0" style={{ fontSize: "14px" }}>
            Don’t have an account?{" "}
            <Link to="/signup" style={{ color: "#ff914d", fontWeight: "600" }}>
              Sign up here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
