import { Event, EventStatusType } from "../../../../types";
import { useNavigate } from "react-router-dom";

interface EventsTableProps {
  events: Event[];
  displayEventStatus: (status: EventStatusType) => string;
  handleDelete: (eventId: string) => void;
}

const EventsTable: React.FC<EventsTableProps> = ({ events, displayEventStatus, handleDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="table-container">
      <table className="events-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.length > 0 ? (
            events.map((event) => (
              <tr key={event.id}>
                <td onClick={() => navigate(`/event/${event.id}`)}>{event.title}</td>
                <td>{new Date(event.event_datetime).toLocaleDateString()}</td>
                <td>{event.location}</td>
                <td>{displayEventStatus(event.status)}</td>
                <td>
                  <button onClick={() => navigate(`/event/${event.id}`)} className="view-button">
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/edit-event/${event.id}`)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(event.id)} className="delete-button">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>No events found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EventsTable;
