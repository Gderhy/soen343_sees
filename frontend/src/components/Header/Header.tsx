import { Link } from "react-router-dom";
import { useState } from "react";
import "./Header.css";
import { useAuth } from "../../contexts/AuthContext";

const Header: React.FC = () => {
  const { session, getUserSystemRole, logout } = useAuth(); // ✅ Use session instead of user
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
  };

  const systemRole = getUserSystemRole();

  return (
    <header className="header">
      <Link to="/" className="logo">SEES</Link>
      <nav>
        <Link to="/events" className="nav-link">Events</Link>

        {/* Normal users & organizers can manage their events */}
        {(systemRole === "user" ) && (
          <>
          <Link to="/attending-events" className="nav-link">Attending Events</Link>
          <Link to="/create-event" className="nav-link">Create Event</Link>
          <Link to="/manage-my-events" className="nav-link">Manage My Events</Link>
          </>
        )}

        {/* ✅ Move Admin Dashboard to Navigation */}
        {systemRole === "admin" && (
          <Link to="/admin-dashboard" className="nav-link admin-nav">
            Admin Dashboard
          </Link>
        )}

        {/* Stakeholder Portal (To be implemented later) */}
        {systemRole === "stakeholder" && (
          <Link to="/stakeholder-portal" className="nav-link admin-nav">
            Stakeholder Portal
          </Link>
        )}

        {session ? ( // ✅ Check if session exists instead of user
          <div className="user-dropdown">
            {/* Avatar & Name (Clickable for Dropdown) */}
            <div className="user-info" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <img
                src={session.user.user_metadata?.avatar_url || "./default_avatar.png"}
                alt="User Avatar"
                className="user-avatar"
              />
              <span className="user-name">{session.user.user_metadata?.fullName || "User"}</span>
            </div>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item">Profile</Link>
                <Link to="/settings" className="dropdown-item">Settings</Link>
                <button onClick={handleLogout} className="dropdown-item logout">Sign Out</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="auth-button">Sign In</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
