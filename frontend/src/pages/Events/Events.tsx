import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import "./Events.css";
import { useNavigate } from "react-router-dom";

const Events: React.FC = () => {

  const navigate = useNavigate();

  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      const { data } = await supabase.from("events").select("*");
      if (data) setEvents(data);
    }
    fetchEvents();
  }, []);

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
          </tr>
        </thead>
        <tbody>
          {events.length > 0 ? (
            events.map((event) => (
              <tr onClick={()=>{navigate(`/event/${event.id}`);}} key={event.id}>
                <td>{event.title}</td>
                <td>{event.description}</td>
                <td>{new Date(event.event_date).toLocaleDateString()}</td>
                <td>{event.location}</td>
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
