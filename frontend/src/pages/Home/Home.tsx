import { Link } from "react-router-dom";
import "./Home.css";

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <h1 className="home-h1">Welcome to SEES</h1>
      <p>Manage and create educational events with ease.</p>

      <div className="home-actions">
        <Link to="/create-event" className="create-event-button">
          Create an Event
        </Link>

        <div className="stakeholder-section">
          <h2>Are you a Stakeholder?</h2>
          <p>Register to get involved in event planning and engagement.</p>
          <Link to="/register-stakeholder" className="stakeholder-button">
            Register as Stakeholder
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
