import React from "react";
import { useNavigate } from "react-router-dom";
import QRGenerator from "./QRGenerator";
import AdminReport from "./AdminReport";
import Topbar from "./Topbar";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dash">
      <div className="shell">
        <Topbar
          title="Admin Dashboard"
          subtitle="Manage users, generate QR and check attendance logs."
          roleBadge={<div className="badge">🟢 Admin Active</div>}
        />

        <div className="grid">
          <div className="card">
            <div className="icon">👤</div>
            <h3>Add User</h3>
            <p>Create new student accounts and assign role/userId.</p>

            <div className="actions">
              <button
                type="button"
                className="btn2"
                onClick={() => navigate("/admin/add-user")}
              >
                Add User
              </button>

              <button
                type="button"
                className="btn2 btn-outline"
                onClick={() => navigate("/admin/users")}
              >
                View Users
              </button>
            </div>
          </div>

          <QRGenerator />

          <div className="card wide">
            <AdminReport />
          </div>
        </div>
      </div>
    </div>
  );
}
