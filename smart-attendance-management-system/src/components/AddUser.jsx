import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function AddUser() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Email required");
      return;
    }

    try {
      await addDoc(collection(db, "users"), {
        email: email.toLowerCase(),
        role,
        createdAt: serverTimestamp(),
      });

      alert("User added successfully ✅");
      navigate("/admin/users");
    } catch (err) {
      console.error(err);
      alert("Error adding user");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Add User</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">Add</button>
      </form>
    </div>
  );
}
