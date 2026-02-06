import React, { useEffect, useMemo, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export default function AdminReport() {
  const [rows, setRows] = useState([]);
  const [dateFilter, setDateFilter] = useState(""); // YYYY-MM-DD

  useEffect(() => {
    const load = async () => {
      const q = query(collection(db, "attendance"), orderBy("markedAt", "desc"));
      const snap = await getDocs(q);
      setRows(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!dateFilter) return rows;
    return rows.filter((r) => r.date === dateFilter);
  }, [rows, dateFilter]);

  const exportCSV = () => {
    const header = ["date", "time", "userId", "sessionId"];
    const lines = filtered.map((r) =>
      [r.date, r.time, r.userId, r.sessionId]
        .map((x) => `"${String(x ?? "").replaceAll('"', '""')}"`)
        .join(",")
    );
    const csv = [header.join(","), ...lines].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_${dateFilter || "all"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card">
      <div className="icon">📊</div>
      <h3>Attendance Report</h3>
      <p>View all attendance records and export CSV.</p>

      <div className="actions" style={{ gap: 10, flexWrap: "wrap" }}>
        <input
          className="input"
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          style={{ maxWidth: 220 }}
        />
        <button className="btn2" onClick={exportCSV}>
          Export CSV
        </button>
        {dateFilter && (
          <button className="btn2 btn-outline" onClick={() => setDateFilter("")}>
            Clear
          </button>
        )}
      </div>

      <div style={{ marginTop: 12, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: 10 }}>Date</th>
              <th style={{ textAlign: "left", padding: 10 }}>Time</th>
              <th style={{ textAlign: "left", padding: 10 }}>User ID</th>
              <th style={{ textAlign: "left", padding: 10 }}>Session</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} style={{ borderTop: "1px solid #e2e8f0" }}>
                <td style={{ padding: 10 }}>{r.date}</td>
                <td style={{ padding: 10 }}>{r.time}</td>
                <td style={{ padding: 10 }}>{r.userId}</td>
                <td style={{ padding: 10 }}>{r.sessionId}</td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td style={{ padding: 10 }} colSpan={4}>
                  No attendance found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
