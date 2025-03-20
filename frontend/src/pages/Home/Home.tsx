import { Link } from "react-router-dom";
import "./Home.css";

const Home: React.FC = () => {
  return (
    <div className="container">
      <h1>Welcome to SEES</h1>
      <p>Manage and create educational events with ease.</p>
      <Link to="/create-event" className="create-event-button">
        Create an Event
      </Link>
    </div>
  );
};

export default Home;
