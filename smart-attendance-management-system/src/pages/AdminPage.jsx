import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <div>
        <h3>Add User</h3>

        <button onClick={() => navigate("/admin/add-user")}>
          Add (next)
        </button>

        <button onClick={() => navigate("/admin/users")}>
          View Users (next)
        </button>
      </div>
    </div>
  );
};

export default AdminPage;
