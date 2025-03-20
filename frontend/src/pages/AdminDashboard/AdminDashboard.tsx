import { useEffect, useState } from "react";
import { fetchUsers, updateUserRole, deleteUser } from "../../services/supabase/adminServices";
import "./AdminDashboard.css";

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      const { data, error } = await fetchUsers();
      if (error) {
        alert("Error fetching users: " + error.message);
      } else {
        setUsers(data);
      }
      setLoading(false);
    }

    loadUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    const { error } = await updateUserRole(userId, newRole);
    if (error) {
      alert("Error updating role: " + error.message);
    } else {
      setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)));
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    const { error } = await deleteUser(userId);
    if (error) {
      alert("Error deleting user: " + error.message);
    } else {
      setUsers(users.filter((user) => user.id !== userId));
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      <table className="user-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="organizer">Organizer</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <button className="delete-button" onClick={() => handleDeleteUser(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
