import React, { useState, useEffect } from "react";
import "./ViewEvents.css";

import { Event } from "../../../types";
import { fetchAllStakeHolderEvents } from "../../../services/backend/stakeholder";
import { useAuth } from "../../../contexts/AuthContext";

const ViewEventsGrid: React.FC = () => {
  const { user } = useAuth();

  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    // Fetch events from API
    const fetchEvents = async () => {
      const stakeholderId = user?.id || "";
      const { data, error } = await fetchAllStakeHolderEvents(stakeholderId);

      if (error) {
        console.error("Error fetching events: ", error);
      } else if (data) {
        setEvents(data);
        setFilteredEvents(data);
      }
    };
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      filtered = filtered.filter((event) => event.event_datetime >= startDate);
    }
    // Filter by end date
    if (endDate) {
      filtered = filtered.filter((event) => event.event_datetime <= endDate);
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
    <div className="view-events-grid">
      <div className="filters">
        <h2>Filters</h2>
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

      <div className="events-grid">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div key={event.id} className="event-card">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p>
                <strong>Date:</strong> {new Date(event.event_datetime).toLocaleDateString()}
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

export default ViewEventsGrid;
