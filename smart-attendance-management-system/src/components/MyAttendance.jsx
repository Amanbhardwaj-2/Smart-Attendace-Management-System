import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

export default function MyAttendance() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const load = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const q = query(
        collection(db, "attendance"),
        where("userId", "==", uid),
        orderBy("markedAt", "desc")
      );

      const snap = await getDocs(q);
      setRows(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };

    load();
  }, []);

  return (
    <div className="card">
      <div className="icon">🗓️</div>
      <h3>My Attendance</h3>
      <p>Your latest attendance records</p>

      <div style={{ marginTop: 12, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: 10 }}>Date</th>
              <th style={{ textAlign: "left", padding: 10 }}>Time</th>
              <th style={{ textAlign: "left", padding: 10 }}>Session</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} style={{ borderTop: "1px solid #e2e8f0" }}>
                <td style={{ padding: 10 }}>{r.date}</td>
                <td style={{ padding: 10 }}>{r.time}</td>
                <td style={{ padding: 10 }}>{r.sessionId}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td style={{ padding: 10 }} colSpan={3}>
                  No attendance marked yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
