import React, { useEffect, useState } from "react";
import "./ManageAttendees.css";
import { useParams } from "react-router-dom";
import { fetchEventAttendees, removeAttendeeFromEvent } from "../../services/backend/managers";

interface Attendee {
  id: string;
  name: string;
  email: string;
  phone: string;
  career: string;
  university?: string;
}

const ManageAttendees: React.FC = () => {
  const { id: eventId } = useParams();
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!eventId) {
      setError("Event ID is required.");
      setLoading(false);
      return;
    }

    const fetchAttendees = async () => {
      setLoading(true);
      const { data, error } = await fetchEventAttendees(eventId);

      if (error) {
        setError(error);
      } else {
        setAttendees(data || []);
      }
      setLoading(false);
    };

    fetchAttendees();
  }, [eventId]);

  const handleKickOut = async (attendeeId: string) => {
    if (!eventId) return;

    const { error } = await removeAttendeeFromEvent(eventId, attendeeId);

    if (error) {
      alert("Error kicking out attendee: " + error);
      return;
    }

    alert("Attendee kicked out successfully!");
    setAttendees((prevAttendees) => prevAttendees.filter((attendee) => attendee.id !== attendeeId));
  };

  if (loading) return <p>Loading attendees...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <div className="manage-attendees-container">
      <h1>Manage Attendees</h1>
      {attendees.length === 0 ? (
        <p>No attendees found.</p>
      ) : (
        <table className="attendees-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Career</th>
              <th>University</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendees.map((attendee) => (
              <tr key={attendee.id}>
                <td>{attendee.name}</td>
                <td>{attendee.email}</td>
                <td>{attendee.phone}</td>
                <td>{attendee.career}</td>
                <td>{attendee.university || "N/A"}</td>
                <td>
                  <button style={{ background: "red" }} onClick={() => handleKickOut(attendee.id)}>
                    Kick out
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageAttendees;
