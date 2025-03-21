import { useEffect, useState } from "react";
import { fetchUsers, updateUserMetaData, deleteUser } from "../../services/supabase/admin";
import "./AdminDashboard.css";
import { User, UserMetadata } from "@supabase/supabase-js";
import CreateUserModal from "../../components/AdminDashboard/Modals/CreateUserModal";

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      const { data, error } = await fetchUsers();
      if (error) {
        alert("Error fetching users: " + error.message);
      } else {
        if (data) setUsers(data);
        console.log(data);
      }
      setLoading(false);
    }

    loadUsers();
  }, [showModal]);

  const handleRoleChange = async (user: User, newRole: string) => {
  
    const updatedUserMetaData: UserMetadata = {
      ...user.user_metadata,
      systemRole: newRole,
    };

    const { error } = await updateUserMetaData(user.id, updatedUserMetaData);

    if (error) {
      alert("Error updating user role: " + error.message);
    } else {
      setUsers(users.map((u) => (u.id === user.id ? { ...u, user_metadata: updatedUserMetaData } : u)));
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
      <button onClick={() => setShowModal(true)}>➕ Create New User</button>
      <table className="user-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const userSystemRole = user?.user_metadata?.systemRole;
            return (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>
                <select
                  value={userSystemRole}
                  onChange={(e) => handleRoleChange(user, e.target.value)}
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
          )})}
        </tbody>
      </table>
      <CreateUserModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onUserCreated={() => {
          // Optional: refresh user list
        }}
      />
    </div>
  );
};

export default AdminDashboard;
