import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventById } from "../../services/supabase";
import "./EventDetail.css";

const EventDetail: React.FC = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    getEventById(id).then(({ data, error }) => {
      if (error) {
        setError("Event not found.");
      } else {
        setEvent(data);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="event-container">
      <h1>{event.title}</h1>
      <p className="event-description">{event.description}</p>
      <p>
        <strong>Date:</strong> {new Date(event.event_date).toLocaleDateString()}
      </p>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      <p>
        <strong>Created At:</strong> {new Date(event.created_at).toLocaleString()}
      </p>
    </div>
  );
};

export default EventDetail;
