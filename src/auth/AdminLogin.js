import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield, FaArrowLeft } from "react-icons/fa";
import { loginUser, logoutUser } from "../services/api"; // ← changed

export default function AdminLogin() {
  const [email, setEmail] = useState("");   // ← changed from username to email
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await loginUser(email, password);
      // Check for admin custom claim
      const token = await user.getIdTokenResult();

      if (token.claims.admin === true) {
        localStorage.setItem(
          "user",
          JSON.stringify({ uid: user.uid, email: user.email, role: "admin" })
        );
        navigate("/admin");
      } else {
        await logoutUser();
        alert("Access denied. You are not an admin.");
      }
    } catch (error) {
      console.error("Admin login error:", error);
      alert("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", background: "linear-gradient(135deg, #fdf3e3, #fbdfbb)" }}>
      <div className="card shadow-lg p-4 position-relative"
        style={{ width: "100%", maxWidth: "420px", borderRadius: "20px", border: "none" }}>
        <button className="btn btn-light position-absolute"
          style={{ top: "15px", left: "15px", borderRadius: "50%" }}
          onClick={() => navigate("/user/home")}>
          <FaArrowLeft />
        </button>
        <div className="text-center mb-4 mt-2">
          <FaUserShield size={34} color="#fd610d" />
          <h3 className="fw-bold mt-2 text-dark">Admin Portal</h3>
          <p style={{ fontSize: "14px", color: "#666" }}>Authorized personnel only</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Admin Email</label>
            <input type="email" className="form-control p-2" placeholder="Enter admin email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              style={{ borderRadius: "10px" }} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input type="password" className="form-control p-2" placeholder="Enter password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              style={{ borderRadius: "10px" }} required />
          </div>
          <button type="submit" className="btn w-100 fw-semibold"
            disabled={loading}
            style={{ backgroundColor: "#fd750d", color: "white", borderRadius: "10px" }}>
            {loading ? "Logging in..." : "Login as Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}