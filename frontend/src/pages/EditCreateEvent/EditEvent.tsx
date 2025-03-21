import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, updateEvent } from "../../services/supabase/supabase";
import "./CreateEvent.css"; // Reuse the styles from CreateEvent

const EditEvent: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    getEventById(id).then(({ data, error }) => {
      if (error) {
        setError("Event not found.");
      } else {
        setTitle(data.title);
        setDescription(data.description);
        setDate(data.event_date);
        setLocation(data.location);
      }
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { error } = await updateEvent(id!, title, description, date, location);

    if (error) {
      setError(error.message);
    } else {
      alert("Event Updated Successfully!");
      navigate("/events");
    }
  };

  return (
    <div className="container">
      <h2>Edit Event</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <button type="submit">Update Event</button>
      </form>
    </div>
  );
};

export default EditEvent;
