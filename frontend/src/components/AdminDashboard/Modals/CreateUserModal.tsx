import { useState } from "react";
import { createUserAsAdmin } from "../../../services/supabase/admin";
import "./CreateUserModal.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated?: () => void;
}

const CreateUserModal: React.FC<Props> = ({ isOpen, onClose, onUserCreated }) => {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [systemRole, setSystemRole] = useState<string>("user");
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreateUser = async () => {
    setLoading(true);
    const { error } = await createUserAsAdmin({
      email,
      password,
      phone,
      fullName,
      systemRole,
    });

    if (!error) {
      alert("User created successfully!");
      onClose();
      onUserCreated?.();
    } else {
      alert("Error creating user: " + error.message);
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Create New User</h2>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="phone"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="password"
          placeholder="Temporary Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select value={systemRole} onChange={(e) => setSystemRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="stakeholder">Stakeholder</option>
        </select>

        <div className="modal-actions">
          <button className="cancel-button" onClick={onClose}>Cancel</button>
          <button onClick={handleCreateUser} disabled={loading}>
            {loading ? "Creating..." : "Create User"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;
