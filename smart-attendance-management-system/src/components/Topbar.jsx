import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export default function Topbar({ title, subtitle, roleBadge }) {
  const email = auth.currentUser?.email || "Unknown";

  const doLogout = async () => {
    await signOut(auth);
    window.location.href = "/"; // simple redirect to login
  };

  return (
    <div className="topbar">
      <div className="left">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      <div className="right">
        <div className="pill">👤 {email}</div>
        {roleBadge}
        <button className="btn2 btn-danger" onClick={doLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
