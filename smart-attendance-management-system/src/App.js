import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";
import AddUser from "./components/AddUser";
import UsersList from "./components/UsersList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/admin/add-user" element={<AddUser />} />
        <Route path="/admin/users" element={<UsersList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
