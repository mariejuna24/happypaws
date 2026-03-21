import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { FaArrowLeft, FaPaw, FaUserPlus } from "react-icons/fa";

export default function UserSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const res = await api.get(`/users?email=${encodeURIComponent(email)}`);
      if (res.data.length > 0) {
        alert("Email already registered. Please login.");
        return;
      }

      const newUser = { name, email, password };
      await api.post("/users", newUser);

      localStorage.setItem("user", JSON.stringify({ ...newUser, role: "user" }));
      navigate("/user/home");
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred. Please try again.");
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
            Create Account
          </h3>
          <p style={{ fontSize: "14px", color: "#777" }}>
            Join HappyPaws and start booking 🐶
          </p>
        </div>

        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input
              type="text"
              className="form-control p-2"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ borderRadius: "10px" }}
              required
            />
          </div>

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
              placeholder="Create a password"
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
            Sign Up
          </button>

          <p className="text-center mb-0" style={{ fontSize: "14px" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#ff914d", fontWeight: "600" }}>
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
