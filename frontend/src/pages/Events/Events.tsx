import { useEffect, useState } from "react";
import { getEvents, Event } from "../../services/api";
import "./Events.css";

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    getEvents().then(setEvents);
  }, []);

  return (
    <div className="events-container">
      <h1>Upcoming Events</h1>
      <ul>
        {events.length > 0 ? (
          events.map((event) => (
            <li key={event.id}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p>
                📅 {new Date(event.start_time).toLocaleDateString()} -{" "}
                {new Date(event.end_time).toLocaleDateString()}
              </p>
              <p>📍 {event.location}</p>
            </li>
          ))
        ) : (
          <p>No events available.</p>
        )}
      </ul>
    </div>
  );
};

export default Events;
