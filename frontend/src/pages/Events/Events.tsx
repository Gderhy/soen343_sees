import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllEvents } from "../../services/supabase/supabase";
import "./Events.css";

const Events: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await fetchAllEvents();
      if (error) {
        alert(error.message);
      }
      if (data) {
        setEvents(data);
        setFilteredEvents(data);
      }
    }
    fetchEvents();
  }, []);

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (!query) {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter((event) => event.title.toLowerCase().includes(query));
      setFilteredEvents(filtered);
    }
  };

  return (
    <div className="container">
      {/* Header with Centered Title & Right-Aligned Search */}
      <div className="header-container">
        <h1>Upcoming Events</h1>
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      <table className="events-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Date</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <tr key={event.id} onClick={() => navigate(`/event/${event.id}`)}>
                <td>{event.title}</td>
                <td>{event.description}</td>
                <td>{new Date(event.event_date).toLocaleDateString()}</td>
                <td>{event.location}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No events found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Events;
