import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

export default function QRScanner({ onClose }) {
  const [msg, setMsg] = useState("");
  const html5QrCodeRef = useRef(null);
  const scanningRef = useRef(false);

  const safeStop = async () => {
    const qr = html5QrCodeRef.current;
    if (!qr) return;
    try {
      if (qr.getState() === Html5QrcodeScannerState.SCANNING) {
        await qr.stop();
      }
    } catch (_) {
      // ignore stop errors
    }
  };

  const markAttendance = async (sessionId) => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return setMsg("Please login again.");

      const clean = String(sessionId || "").trim();
      if (!clean) return;

      const qs = query(
        collection(db, "qr_sessions"),
        where("sessionId", "==", clean),
        limit(1)
      );
      const snap = await getDocs(qs);
      if (snap.empty) return setMsg("Invalid QR (session not found).");

      const session = snap.docs[0].data();
      if (Date.now() > Number(session.expiresAt))
        return setMsg("QR expired. Ask admin to generate new QR.");

      const q2 = query(
        collection(db, "attendance"),
        where("userId", "==", uid),
        where("sessionId", "==", clean),
        limit(1)
      );
      const existing = await getDocs(q2);
      if (!existing.empty) return setMsg("Attendance already marked.");

      const now = new Date();
      await addDoc(collection(db, "attendance"), {
        userId: uid,
        sessionId: clean,
        date: now.toISOString().slice(0, 10),
        time: now.toTimeString().slice(0, 5),
        markedAt: Date.now(),
      });

      setMsg("✅ Attendance marked successfully!");
      scanningRef.current = false;
      await safeStop();
    } catch (e) {
      setMsg(e?.message || "Something went wrong.");
    }
  };

  useEffect(() => {
    let cancelled = false;
    const start = async () => {
      try {
        const qr = new Html5Qrcode("qr-reader");
        html5QrCodeRef.current = qr;
        scanningRef.current = true;

        await qr.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          async (decodedText) => {
            if (cancelled || !scanningRef.current) return;
            scanningRef.current = false;
            await markAttendance(decodedText);
          }
        );
      } catch (e) {
        setMsg("Camera start failed. Allow permission / use https.");
      }
    };

    start();
    return () => {
      cancelled = true;
      safeStop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="card">
      <div className="icon">📷</div>
      <h3>Scanner</h3>
      <p>Scan admin QR to mark attendance.</p>

      {/* Modern QR Container */}
      <div 
        id="qr-reader" 
        style={{ 
          width: "100%", 
          marginTop: 12, 
          borderRadius: 18, 
          overflow: "hidden",
          border: '1px solid rgba(255,255,255,0.1)' 
        }} 
      />

      {msg && (
        <p style={{ 
          marginTop: 10, 
          color: msg.includes('✅') ? '#10b981' : '#ef4444',
          fontWeight: 'bold' 
        }}>
          {msg}
        </p>
      )}

      <div className="actions" style={{ marginTop: 12 }}>
        <button
          className="btn2"
          onClick={async () => {
            scanningRef.current = false;
            await safeStop();
            onClose();
          }}
        >
          Close Scanner
        </button>
      </div>
    </div>
  );
}