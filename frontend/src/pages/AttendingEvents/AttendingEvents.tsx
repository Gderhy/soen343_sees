import React, { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { cancelAttendance, fetchUsersAttendingEvents } from "../../services/backend/user";
import "./AttendingEvents.css"; // Ensure the CSS file is imported
import { useNavigate } from "react-router-dom";
import { Event } from "../../types"; // Adjust the import based on your project structure

const AttendingEvents: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Assuming you have a way to get the current user
  const [events, setEvents] = React.useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return; // Ensure user is available
      const userId = user.id; // Assuming user has an id property

      try {
        const { data, error } = await fetchUsersAttendingEvents(userId); // Replace with your API call to fetch events
        if (error) {
          console.error(error);
          return;
        }

        console.log(data); // Check the data structure returned by your API
        setEvents(data); // Assuming the API returns an array of events in 'events'
      } catch (error) {
        console.error(error);
      }
    };

    fetchEvents();
  }, [user]); // Fetch events when user changes


  const handleViewEvent = (eventId: string) => {
    navigate(`/event/${eventId}`); // Navigate to the event details page
  };

  const handleCancelEvent = async (eventId: string) => {
    if (!user) return; // Ensure user is available
    const userId = user.id; // Assuming user has an id property

    try {
      const { error } = await cancelAttendance(userId, eventId); // Replace with your API call to cancel attendance
      if (error) {
        console.error(error);
        return;
      }

      alert("Event attendance canceled successfully!"); // Notify the user

      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId)); // Update the state to remove the canceled event
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1 className="header">Attending Events</h1>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <table className="events-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Time</th>
              <th>Location</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>{event.title}</td>
                <td>{event.description}</td>
                <td>{new Date(event.event_datetime).toLocaleDateString()}</td>
                <td>{new Date(event.event_datetime).toLocaleTimeString()}</td>
                <td>{event.location}</td>
                <td>${event.base_price}</td>
                <td>
                  <button className="" onClick={() => handleViewEvent(event.id)}>View</button>
                  <button className="cancel-button" onClick={()=>{handleCancelEvent(event.id)}}>Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AttendingEvents;
