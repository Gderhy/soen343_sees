import { Link } from "react-router-dom";
import { useState } from "react";
import "./Header.css";
import { useAuth } from "../../contexts/AuthContext";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
  };

  console.log(user);

  return (
    <header className="header">
      <Link to="/" className="logo">
        SEES
      </Link>
      <nav>
        <Link to="/events" className="nav-link">
          Events
        </Link>
        <Link to="/manage-my-events" className="nav-link">
          Manage My Events
        </Link>

        {user ? (
          <div className="user-dropdown">
            {/* Avatar & Name (Clickable for Dropdown) */}
            <div className="user-info" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <img
                src={user.user_metadata?.avatar_url || "./default_avatar.png"}
                alt="User Avatar"
                className="user-avatar"
              />
              <span className="user-name">{user.user_metadata?.fullName || "User"}</span>
            </div>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item">
                  Profile
                </Link>
                <Link to="/settings" className="dropdown-item">
                  Settings
                </Link>
                <button onClick={handleLogout} className="dropdown-item logout">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="auth-button">
            Sign In
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
