import React, { useEffect, useState } from "react";
import { getPendingStakeholderEvent, updateStakeholderEventStatus } from "../../../services/backend/stakeholder";
import "./PendingEvents.css";
import { Event, EventStatusType } from "../../../types";
import { useAuth } from "../../../contexts/AuthContext";

const PendingEvents: React.FC = () => {
  const { user } = useAuth();
  const [pendingEvents, setPendingEvents] = useState<Event[]>([]);
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
      setLoading(false);
    };

    fetchPendingEvents();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApprove = async (eventId: string) => {
    const active: EventStatusType = "active";
    const stakeholderId = user?.id || "";
    const { error } = await updateStakeholderEventStatus(stakeholderId, eventId, active);
    if (error) {
      alert("Error approving event: " + error);
    } else {
      setPendingEvents(pendingEvents.filter((event) => event.id !== eventId));
    }
  };

  const handleDeny = async (eventId: string) => {
    const denied: EventStatusType = "denied";
    const stakeholderId = user?.id || "";
    const { error } = await updateStakeholderEventStatus(stakeholderId, eventId, denied);
    if (error) {
      alert("Error denying event: " + error);
    } else {
      setPendingEvents(pendingEvents.filter((event) => event.id !== eventId));
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
            {pendingEvents.map((event) => (
              <tr key={event.id}>
                <td>{event.title}</td>
                <td>{new Date(event.event_date).toLocaleDateString()}</td>
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
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingEvents;
