import React, { useState, useEffect } from "react";
import "./ViewEvents.css";

import { mockEvents } from "./mockData";
import { Event } from "../../../types";

const ViewEventsGrid: React.FC = () => {
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

export default ViewEventsGrid;
