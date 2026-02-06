import React, { useState } from "react";
import QRScanner from "./QRScanner";
import MyAttendance from "./MyAttendance";
import Topbar from "./Topbar";

export default function UserDashboard() {
  const [showScanner, setShowScanner] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);

  return (
    <div className="dash">
      <div className="shell">
        <Topbar
          title="User Dashboard"
          subtitle="Scan QR to mark attendance and view your logs."
          roleBadge={<div className="badge user">🟣 User Active</div>}
        />

        <div className="grid">
          <div className="card">
            <div className="icon">📷</div>
            <h3>Scan QR</h3>
            <p>Open scanner and scan admin QR to mark attendance.</p>
            <div className="actions">
              <button className="btn2" onClick={() => setShowScanner(true)}>
                Open Scanner
              </button>
              {showScanner && (
                <button className="btn2 btn-outline" onClick={() => setShowScanner(false)}>
                  Close
                </button>
              )}
            </div>
          </div>

          {showScanner && (
            <div className="card wide">
              <QRScanner onClose={() => setShowScanner(false)} />
            </div>
          )}

          <div className="card">
            <div className="icon">🗓️</div>
            <h3>My Attendance</h3>
            <p>View your attendance list and latest records.</p>
            <div className="actions">
              <button className="btn2" onClick={() => setShowAttendance(true)}>
                View
              </button>
              {showAttendance && (
                <button className="btn2 btn-outline" onClick={() => setShowAttendance(false)}>
                  Hide
                </button>
              )}
            </div>
          </div>

          {showAttendance && (
            <div className="card wide">
              <MyAttendance />
            </div>
          )}

          <div className="card">
            <div className="icon">⚙️</div>
            <h3>Profile</h3>
            <p>Next: show user profile details.</p>
            <div className="actions">
              <button className="btn2 btn-outline" disabled>
                Open (next)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
