import React from "react";

export default function Toast({ type = "info", title, message, onClose }) {
  const icon =
    type === "success" ? "✅" : type === "error" ? "⚠️" : type === "loading" ? "⏳" : "ℹ️";

  return (
    <div className="toast">
      <div className="ticon">{icon}</div>
      <div className="tmain">
        <p className="ttitle">{title}</p>
        {message && <p className="tmsg">{message}</p>}
      </div>
      <button className="tclose" onClick={onClose}>Close</button>
    </div>
  );
}
