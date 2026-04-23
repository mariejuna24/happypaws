import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// AUTH
import AdminLogin from "./auth/AdminLogin";
import UserLogin from "./user/UserLogin";
import UserSignup from "./user/UserSignup";

// DASHBOARDS
import AdminDashboard from "./admin/AdminDashboard";
import AdminStats from "./admin/AdminStats";
import BookingTable from "./admin/BookingTable";
import BookingCalendar from "./admin/BookingCalendar";
import AdminServices from "./admin/AdminServices";
import AdminRatings from "./admin/Adminratings"; 
import ManageUsers from "./admin/ManageUsers";

import UserDashboard from "./user/UserDashboard";

// USER PAGES
import Home from "./user/Home";
import Services from "./user/Services";
import About from "./user/About";
import Profile from "./user/Profile";
import EditProfile from "./user/Editprofile";
import Contact from "./user/Contact";
import ServiceDetailsPage from "./user/ServiceDetailPage";
import BookingForm from "./user/BookingForm";
import MyBookings from "./user/MyBookings";
import UserManual from "./user/UserManual"

import "./style/admin.css";

//ADMIN PROTECTION
function RequireAdmin({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

//USER LOGIN REQUIRED
function RequireUser({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <Routes>
      {/* DEFAULT LANDING */}
      <Route path="/" element={<Navigate to="/user/home" />} />

      {/* PUBLIC AUTH */}
      <Route path="/login" element={<UserLogin />} />
      <Route path="/signup" element={<UserSignup />} />
      <Route path="/user/manual" element={<UserManual />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* USER DASHBOARD */}
      <Route path="/user/*" element={<UserDashboard />}>
        <Route index element={<Navigate to="home" />} />

        {/* PUBLIC PAGES */}
        <Route path="home" element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="service/:id" element={<ServiceDetailsPage />} />
        <Route path="about" element={<About />} />
        <Route path="profile" element={<Profile />} />
        <Route path="edit-profile" element={<EditProfile />} />
        <Route path="contact" element={<Contact />} />

        {/* LOGIN REQUIRED */}
        <Route
          path="bookings"
          element={
            <RequireUser>
              <BookingForm />
            </RequireUser>
          }
        />
        <Route
          path="my-bookings"
          element={
            <RequireUser>
              <MyBookings />
            </RequireUser>
          }
        />
      </Route>

      {/* ADMIN DASHBOARD */}
      <Route
        path="/admin/*"
        element={
          <RequireAdmin>
            <AdminDashboard />
          </RequireAdmin>
        }
      >
        <Route index element={<Navigate to="dashboard" />} />

        {/* 🔹 MAIN DASHBOARD (Stats + Calendar ONLY) */}
        <Route
          path="dashboard"
          element={
            <div className="container py-4">
              {/* STATS AT TOP */}
              <div className="admin-stats-wrapper mb-4">
                <AdminStats
                  onFilter={setFilterStatus}
                  filterStatus={filterStatus}
                  refreshKey={refreshKey}
                />
              </div>

              {/* CALENDAR BELOW */}
              <div className="mt-4">
                <BookingCalendar refreshKey={refreshKey} />
              </div>
            </div>
          }
        />

        {/* 🔹 STATS PAGE (Stats + Table) */}
        <Route
          path="stats"
          element={
            <div className="container py-4">
              <AdminStats
                onFilter={setFilterStatus}
                filterStatus={filterStatus}
                refreshKey={refreshKey}
              />

              <div className="mt-4">
                <BookingTable
                  filterStatus={filterStatus}
                  onAction={() => setRefreshKey((prev) => prev + 1)}
                  refreshKey={refreshKey}
                />
              </div>
            </div>
          }
        />

        {/* OTHER ADMIN PAGES */}
        <Route path="admin-services" element={<AdminServices />} />
        <Route path="ratings"        element={<AdminRatings />} /> {/* ✅ added */}
        <Route path="manage-users"   element={<ManageUsers />} />
      </Route>

      {/* CATCH ALL */}
      <Route path="*" element={<Navigate to="/user/home" />} />
    </Routes>
  );
}