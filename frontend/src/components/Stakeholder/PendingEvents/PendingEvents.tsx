import React, { useEffect, useState } from "react";
import {
  getPendingStakeholderEvent,
  updateStakeholderEventStatus,
} from "../../../services/backend/stakeholder";
import "./PendingEvents.css";
import { Event } from "../../../types";
import { useAuth } from "../../../contexts/AuthContext";

// TODO: destructure the events object correctly in the backend...
interface ReceivedEvents {
  events: Event;
}

const PendingEvents: React.FC = () => {
  const { user } = useAuth();
  const [pendingEvents, setPendingEvents] = useState<ReceivedEvents[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchPendingEvents = async () => {
      const stakeholderId = user?.id || "";

      const { data, error } = await getPendingStakeholderEvent(stakeholderId);
      if (error) {
        setError(error.message);
      } else if (data) {
        setPendingEvents(data);
      }
      console.log(data);
      setLoading(false);
    };

    fetchPendingEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApprove = async (eventId: string) => {
    const stakeholderId = user?.id || "";
    const { error } = await updateStakeholderEventStatus(stakeholderId, eventId, "approved");
    if (error) {
      alert("Error approving event: " + error);
    } else {
      alert("Event approved successfully.");
      setPendingEvents(pendingEvents.filter(({events: event}) => event.id !== eventId)); // ✅ Correctly destructuring the events object
    }
  };

  const handleDeny = async (eventId: string) => {
    const stakeholderId = user?.id || "";
    const { error } = await updateStakeholderEventStatus(stakeholderId, eventId, "denied");
    if (error) {
      alert("Error denying event: " + error);
    } else {
      alert("Event denied successfully.");
      setPendingEvents(pendingEvents.filter(({events: event}) => event.id !== eventId)); // ✅ Correctly destructuring the events object
    }
  };

  if (loading) return <p>Loading pending events...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <div className="pending-events-container">
      <h1>Pending Events</h1>
      {pendingEvents.length === 0 ? (
        <p>No pending events.</p>
      ) : (
        <table className="pending-events-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingEvents.map(
              (
                { events: event } // ✅ Correctly destructure the events object
              ) => (
                <tr key={event.id}>
                  <td>{event.title}</td>
                  <td>{event.event_datetime}</td> {/* TODO: display nicely*/}
                  <td>{event.location}</td>
                  <td>
                    <button className="approve-button" onClick={() => handleApprove(event.id)}>
                      Approve
                    </button>
                    <button className="deny-button" onClick={() => handleDeny(event.id)}>
                      Deny
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingEvents;
