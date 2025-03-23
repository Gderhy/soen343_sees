import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, fetchUserEvents } from "../../services/supabase/supabase";
import { deleteEvent } from "../../services/backend/user";
import "./ManageMyEvents.css";

const ManageMyEvents: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 5; // Number of events per page

  useEffect(() => {
    async function fetchUser() {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        fetchEvents(userData.user.id);
      }
    }

    async function fetchEvents(userId: string) {
      const { data, error } = await fetchUserEvents(userId);
      if (error) {
        alert(error.message);
      }
      if (data) {
        setEvents(data);
        setFilteredEvents(data);
      }
    }

    fetchUser();
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
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleDelete = async (eventId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;

    const { error } = await deleteEvent(eventId);
    if (error) {
      alert(error);
    } else {
      setEvents(events.filter((event) => event.id !== eventId));
      setFilteredEvents(filteredEvents.filter((event) => event.id !== eventId));
    }
  };

  // Pagination Logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <div className="header-container">
        <h1>Manage My Events</h1>
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      <div className="table-container">
        <table className="events-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentEvents.length > 0 ? (
              currentEvents.map((event) => (
                <tr key={event.id}>
                  <td onClick={() => navigate(`/event/${event.id}`)}>{event.title}</td>
                  <td>{new Date(event.event_datetime).toLocaleDateString()}</td>
                  <td>{event.location}</td>
                  <td>
                    <button onClick={() => navigate(`/event/${event.id}`)} className="view-button">
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/edit-event/${event.id}`)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDelete(event.id)} className="delete-button">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>No events found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredEvents.length / eventsPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`page-button ${currentPage === i + 1 ? "active" : ""}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ManageMyEvents;
