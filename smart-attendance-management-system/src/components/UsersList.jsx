import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

export default function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      setUsers(snap.docs.map((d) => d.data()));
    });

    return () => unsub();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Users List</h2>
      <Link to="/admin">← Back to Admin</Link>

      <ul>
        {users.map((u, i) => (
          <li key={i}>
            {u.email} — <b>{u.role}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}
