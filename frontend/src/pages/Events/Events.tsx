import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase, deleteEvent, fetchAllEvents } from "../../services/supabase";
import "./Events.css";

const Events: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await fetchAllEvents(); 
      if (error) {
        alert(error.message);
      }
      if (data) setEvents(data);
    }
    fetchEvents();

    async function fetchUser() {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        setUserId(userData.user.id);
      }
    }
    fetchUser();
  }, []);

  const handleDelete = async (eventId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;

    const { error } = await deleteEvent(eventId);
    if (error) {
      alert(error.message);
    } else {
      setEvents(events.filter((event) => event.id !== eventId));
    }
  };

  return (
    <div className="container">
      <h1>Upcoming Events</h1>
      <table className="events-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Date</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.length > 0 ? (
            events.map((event) => (
              <tr key={event.id}>
                <td>{event.title}</td>
                <td>{event.description}</td>
                <td>{new Date(event.event_date).toLocaleDateString()}</td>
                <td>{event.location}</td>
                <td>
                  <Link to={`/event/${event.id}`} className="details-link">
                    View
                  </Link>
                  {userId === event.created_by && (
                    <>
                      <Link to={`/edit-event/${event.id}`} className="edit-link">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(event.id)} className="delete-button">
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No events available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Events;
