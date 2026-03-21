import React from "react";
import AdminNavbar from "./AdminNavbar";
import { Outlet } from "react-router-dom";
import "../style/AdminStyle.css";

export default function AdminDashboard() {
  return (
    <div className="admin-layout">
      <AdminNavbar />
      <main className="admin-main">
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}