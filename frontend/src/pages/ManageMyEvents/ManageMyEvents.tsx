import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase/supabase";
import { deleteEvent, fetchUsersEvents } from "../../services/backend/user";
import "./ManageMyEvents.css";
import { Event, EventStatusType } from "../../types";
import CalendarView from "../../components/Calendar/CalendarView";
import EventsTable from "../../components/User/ManageMyEvents/EventsTable/EventsTable";

const ManageMyEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"list" | "calendar">("list");
  const eventsPerPage = 5; // Number of events per page

  useEffect(() => {
    async function fetchUser() {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        fetchEvents(userData.user.id);
      }
    }

    async function fetchEvents(userId: string) {
      const { data, error } = await fetchUsersEvents(userId);
      if (error) {
        alert(error.message);
      }
      if (data) {
        setEvents(data);
        setFilteredEvents(data);
      }
    }

    fetchUser();
  }, []);

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (!query) {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter((event) =>
        event.title.toLowerCase().includes(query)
      );
      setFilteredEvents(filtered);
    }
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleDelete = async (eventId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmDelete) return;

    const { error } = await deleteEvent(eventId);
    if (error) {
      alert(error);
    } else {
      alert("Event deleted successfully.");
      setEvents(events.filter((event) => event.id !== eventId));
      setFilteredEvents(filteredEvents.filter((event) => event.id !== eventId));
    }
  };

  // Pagination Logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const displayEventStatus = (status: EventStatusType) => {
    switch (status) {
      case "active":
        return "Active";
      case "cancelled":
        return "Cancelled";
      case "completed":
        return "Completed";
      case "denied":
        return "Denied by: "; // TODO: Add `name(s) of stakeholder(s) who denied the event`
      case "pending":
        return "Pending"; // TODO: Add "Waiting on stakeholder(s) to approve"
      case "postponed":
        return "Postponed";
      default:
        return "Unknown";
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "list":
        return (
          <div className="tab-content">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
            />
            <EventsTable
              events={currentEvents}
              displayEventStatus={displayEventStatus}
              handleDelete={handleDelete}
            />
            {/* Pagination Controls */}
            <div className="pagination">
              {Array.from(
                { length: Math.ceil(filteredEvents.length / eventsPerPage) },
                (_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`page-button ${
                      currentPage === i + 1 ? "active" : ""
                    }`}
                  >
                    {i + 1}
                  </button>
                )
              )}
            </div>
          </div>
        );
      case "calendar":
        return (
          <div className="tab-content">
            <CalendarView events={events} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="manage-events-portal">
      <h1>Manage My Events</h1>
      <div className="tabs">
        <button
          className={`tab ${activeTab === "list" ? "active" : ""}`}
          onClick={() => setActiveTab("list")}
        >
          List View
        </button>
        <button
          className={`tab ${activeTab === "calendar" ? "active" : ""}`}
          onClick={() => setActiveTab("calendar")}
        >
          Calendar View
        </button>
      </div>
      <div className="content">{renderTabContent()}</div>
    </div>
  );
};

export default ManageMyEvents;
