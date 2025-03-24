import { useState } from "react";
import { format, parseISO, isSameDay } from "date-fns";
import "./CalendarView.css"; // We'll create this CSS file next
import { Event } from "../../types";

interface CalendarViewProps {
  events: Event[];
}

const CalendarView = ({ events } : CalendarViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Group events by date
  const eventsByDate = events.reduce((acc, event) => {
    try {
      const date = format(parseISO(event.event_datetime), "yyyy-MM-dd");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    } catch (e) {
      console.error("Error parsing event date:", event.event_datetime, e);
      return acc;
    }
  }, {});

  // Get days in month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  // Navigate months
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Render day cell
  const renderDayCell = (day) => {
    const dateStr = format(day, "yyyy-MM-dd");
    const dayEvents = eventsByDate[dateStr] || [];

    return (
      <div key={day.toString()} className={`day-cell ${isSameDay(day, new Date()) ? "today" : ""}`}>
        <div className="day-number">{format(day, "d")}</div>
        {dayEvents.slice(0, 2).map((event) => (
          <div
            key={event.id}
            className={`event-item ${event.status}`}
            title={`${event.title}\n${event.description}`}
          >
            {event.title}
          </div>
        ))}
        {dayEvents.length > 2 && <div className="more-events">+{dayEvents.length - 2} more</div>}
      </div>
    );
  };

  const days = getDaysInMonth(currentMonth);

  // Get starting offset (empty cells before first day of month)
  const startOffset = days[0].getDay(); // 0 = Sunday, 1 = Monday, etc.

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={prevMonth}>&lt; Prev</button>
        <h2>{format(currentMonth, "MMMM yyyy")}</h2>
        <button onClick={nextMonth}>Next &gt;</button>
      </div>

      <div className="calendar-grid">
        {/* Day headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}

        {/* Empty cells for days before the first of the month */}
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} className="day-cell empty"></div>
        ))}

        {/* Days of the month */}
        {days.map((day) => renderDayCell(day))}
      </div>

      {/* Event summary modal would go here */}
    </div>
  );
};

export default CalendarView;
