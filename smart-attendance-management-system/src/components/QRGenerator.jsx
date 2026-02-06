// src/components/QRGenerator.jsx
import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export default function QRGenerator() {
  const [sessionId, setSessionId] = useState("");
  const [expiresAt, setExpiresAt] = useState(0);
  const [left, setLeft] = useState(0);

  const generateQR = async () => {
    const id = Math.random().toString(36).substring(2, 10).toUpperCase();
    const exp = Date.now() + 60 * 1000; // 60 sec expiry

    await addDoc(collection(db, "qr_sessions"), {
      sessionId: id,
      createdAt: serverTimestamp(),
      expiresAt: exp,
      active: true,
    });

    setSessionId(id);
    setExpiresAt(exp);
    setLeft(60);
  };

  useEffect(() => {
    if (!expiresAt) return;
    const t = setInterval(() => {
      const sec = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      setLeft(sec);
      if (sec === 0) clearInterval(t);
    }, 500);
    return () => clearInterval(t);
  }, [expiresAt]);

  return (
    <div className="card">
      <div className="icon">🔳</div>
      <h3>Generate QR</h3>
      <p>QR valid for 60 seconds.</p>

      <div className="actions">
        <button className="btn2" onClick={generateQR}>
          Generate QR
        </button>
      </div>

      {sessionId && (
        <div style={{ marginTop: 14, textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>
            Session: <b>{sessionId}</b> • Expires in <b>{left}s</b>
          </div>

          {left > 0 ? (
            <QRCodeCanvas value={sessionId} size={210} />
          ) : (
            <div style={{ padding: 14, borderRadius: 12, background: "#f1f5f9" }}>
              QR Expired. Generate a new one.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
