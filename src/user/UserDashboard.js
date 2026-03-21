import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../user/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

export default function UserDashboard() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: "80vh" }}>
        <Outlet />
      </div>
      <footer className="bg-light text-center py-4 mt-5 shadow-sm">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} HappyPaws Grooming. All rights reserved.
        </p>
      </footer>
    </>
  );
}