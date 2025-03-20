import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getEventById,
  rsvpToEvent,
  removeRsvp,
  checkUserRsvp,
  getEventAttendees,
} from "../../services/supabase";
import { supabase } from "../../services/supabase"; // ✅ Import Supabase for authentication
import "./EventDetail.css";

const EventDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [isAttending, setIsAttending] = useState(false);
  const [attendees, setAttendees] = useState<number>(0);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function fetchEventData() {
      const { data, error } = await getEventById(id);
      if (error) {
        setError("Event not found.");
      } else {
        setEvent(data);
      }

      const { data: rsvpData } = await checkUserRsvp(id);
      setIsAttending(!!rsvpData);

      const { data: attendeesData } = await getEventAttendees(id);
      setAttendees(attendeesData?.length || 0);

      // Check if logged-in user is the event owner
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user?.id === data?.created_by) {
        setIsOwner(true);
      }

      setLoading(false);
    }

    fetchEventData();
  }, [id]);

  const handleRsvp = async () => {
    if (!id) return;

    if (isAttending) {
      await removeRsvp(id);
      setIsAttending(false);
      setAttendees((prev) => prev - 1);
    } else {
      await rsvpToEvent(id);
      setIsAttending(true);
      setAttendees((prev) => prev + 1);
    }
  };

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
        <strong>Attendees:</strong> {attendees}
      </p>

      {/* RSVP Button */}
      <button
        onClick={handleRsvp}
        className={isAttending ? "rsvp-button attending" : "rsvp-button"}
      >
        {isAttending ? "Cancel RSVP" : "RSVP to Event"}
      </button>

      {/* Modify Event Button (Only for Owner) */}
      {isOwner && (
        <button onClick={() => navigate(`/edit-event/${id}`)} className="modify-button">
          Modify Event
        </button>
      )}
    </div>
  );
};

export default EventDetail;
