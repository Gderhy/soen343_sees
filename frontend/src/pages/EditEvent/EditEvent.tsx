import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchEventById } from "../../services/backend/all";
import { updateEvent } from "../../services/backend/user";
import "./EditEvent.css";
import { useAuth } from "../../contexts/AuthContext";
import { Event, defaultEvent } from "../../types";



const EditEvent: React.FC = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [event, setEvent] = useState<Event>(defaultEvent);

  useEffect(() => {
    if (!id) {
      navigate("/manage-my-events");
      return;
    }

    async function fetchEvent() {
      const { data, error } = await fetchEventById(id!);

      if (error) {
        setError(error.message);
        navigate("/manage-my-events");
        return;
      } else {
        console.log(data);
        setEvent(data);
      }
    }

    fetchEvent();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    if (!id || !user || !event) {
      return;
    }

    e.preventDefault();
    setError("");

    const userId = user?.id || "";

    const { error } = await updateEvent(userId, event);

    if (error) {
      setError(error.message);
    } else {
      alert("Event Updated Successfully!");
      navigate("/events");
    }
  };

  const formatDateTimeForInput = (dateTimeString:string) => {
    // Remove the timezone offset and seconds
    const formattedDateTime = dateTimeString.split("+")[0].slice(0, 16);
    return formattedDateTime;
  };

  return (
    <div className="container">
      <h2>Edit Event</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={event.title}
          onChange={(e) => setEvent({ ...event, title: e.target.value })}
          required
        />
        <textarea
          value={event.description}
          onChange={(e) => setEvent({ ...event, description: e.target.value })}
          required
        />
        <input
          type="datetime-local"
          value={formatDateTimeForInput(event.event_datetime)}
          onChange={(e) => setEvent({ ...event, event_datetime: e.target.value })}
          required
        />
        <input
          type="text"
          value={event.location}
          onChange={(e) => setEvent({ ...event, location: e.target.value })}
          required
        />
        <button type="submit">Update Event</button>
      </form>
    </div>
  );
};

export default EditEvent;
