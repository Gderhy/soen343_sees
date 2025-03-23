import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  removeRsvp,
  checkUserRsvp,
  getEventAttendees,
  isUserOrganizer,
} from "../../services/supabase/supabase";
import { fetchEventById } from "../../services/backend/all";
import { rsvpToEvent } from "../../services/backend/user";
import "./EventDetail.css";
import { Event, defaultEvent } from "../../types";

const EventDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event>(defaultEvent);
  const [isAttending, setIsAttending] = useState(false);
  const [attendees, setAttendees] = useState<number>(0);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function fetchEventData() {
      if (!id) {
        navigate("/events");
        return;
      }

      const { data, error } = await fetchEventById(id);
      if (error) {
        setError("Event not found.");
      } else {
        setEvent(data);
      }

      const { data: rsvpData } = await checkUserRsvp(id);
      setIsAttending(!!rsvpData);

      const { data: attendeesData } = await getEventAttendees(id);
      setAttendees(attendeesData?.length || 0);

      const { isOrganizer } = await isUserOrganizer(id);
      setIsOrganizer(isOrganizer);

      setLoading(false);
    }

    fetchEventData();
  }, [id, navigate]);

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
        <strong>Date:</strong> {new Date(event.event_datetime).toLocaleDateString()}
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

      {/* Organizer Tools */}
      {isOrganizer && (
        <>
          <button onClick={() => navigate(`/edit-event/${id}`)} className="modify-button">
            Modify Event
          </button>
          <button
            onClick={() => navigate(`/manage-attendees/${id}`)}
            className="manage-attendees-button"
          >
            Manage Attendees
          </button>
        </>
      )}
    </div>
  );
};

export default EventDetail;
