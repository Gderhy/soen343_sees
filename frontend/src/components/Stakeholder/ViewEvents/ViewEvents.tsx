import React, { useState, useEffect } from "react";
import "./ViewEvents.css";

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  status: "active" | "cancelled" | "postponed";
}

// Sample mock data
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Tech Conference 2023",
    description: "A conference about emerging tech trends.",
    event_date: "2023-04-20",
    location: "Montreal",
    status: "active",
  },
  {
    id: "2",
    title: "Art Workshop",
    description: "A creative art workshop for beginners.",
    event_date: "2023-05-05",
    location: "Toronto",
    status: "cancelled",
  },
  {
    id: "3",
    title: "Science Expo",
    description: "Showcasing breakthrough scientific discoveries.",
    event_date: "2023-06-15",
    location: "Vancouver",
    status: "active",
  },
  {
    id: "4",
    title: "Business Seminar",
    description: "Strategies for modern business growth.",
    event_date: "2023-07-10",
    location: "Montreal",
    status: "postponed",
  },
];

const ViewEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(mockEvents);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    let filtered = events;

    // Filter by search query in event title
    if (searchQuery) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by start date
    if (startDate) {
      filtered = filtered.filter((event) => event.event_date >= startDate);
    }
    // Filter by end date
    if (endDate) {
      filtered = filtered.filter((event) => event.event_date <= endDate);
    }

    // Filter by location (case-insensitive match)
    if (locationFilter) {
      filtered = filtered.filter((event) =>
        event.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Filter by status (if not "all")
    if (statusFilter !== "all") {
      filtered = filtered.filter((event) => event.status === statusFilter);
    }

    setFilteredEvents(filtered);
  }, [searchQuery, startDate, endDate, locationFilter, statusFilter, events]);

  return (
    <div className="view-events-container">
      <h1>View Events</h1>
      <div className="filters">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <input
          type="date"
          placeholder="Start date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          placeholder="End date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by location..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="cancelled">Cancelled</option>
          <option value="postponed">Postponed</option>
        </select>
      </div>

      <div className="events-list">
        {filteredEvents.length ? (
          filteredEvents.map((event) => (
            <div key={event.id} className="event-card">
              <h2>{event.title}</h2>
              <p>{event.description}</p>
              <p>
                <strong>Date:</strong> {new Date(event.event_date).toLocaleDateString()}
              </p>
              <p>
                <strong>Location:</strong> {event.location}
              </p>
              <p>
                <strong>Status:</strong> {event.status}
              </p>
            </div>
          ))
        ) : (
          <p>No events found.</p>
        )}
      </div>
    </div>
  );
};

export default ViewEvents;
