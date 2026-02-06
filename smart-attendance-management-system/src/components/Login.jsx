import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import Toast from "./Toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    setToast({ type: "loading", title: "Signing in...", message: "Please wait" });

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const uid = userCredential.user.uid;
      const userSnap = await getDoc(doc(db, "users", uid));

      if (!userSnap.exists()) {
        setToast({ type: "error", title: "Role missing", message: "users/{UID} not found" });
        setBusy(false);
        return;
      }

      const role = userSnap.data().role;

      setToast({ type: "success", title: "Login successful", message: `Welcome (${role})` });

      setTimeout(() => {
        if (role === "admin") navigate("/admin");
        else navigate("/user");
      }, 350);
    } catch (err) {
      setToast(null);
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="brand">
          <div className="logo">SA</div>
          <h1>Smart Attendance Management</h1>
          <p>Secure login • QR based attendance</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="field">
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={busy}
            />
          </div>

          <div className="field">
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={busy}
            />
          </div>

          <button className="btn" type="submit" disabled={busy}>
            {busy ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {error && <div className="err">{error}</div>}
      </div>

      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
