import { useState } from "react";
import Calendar from "react-calendar";
import { format, parseISO, isSameDay } from "date-fns";
import "react-calendar/dist/Calendar.css";
import "./CalendarView.css";

interface Event {
  id: string;
  title: string;
  description: string;
  status: string;
  event_datetime: string;
}

const CalendarView = ({ events }: { events: Event[] }) => {
  const [date, setDate] = useState(new Date());

  // Group events by date
  const eventsByDate = events.reduce((acc: Record<string, Event[]>, event) => {
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

  // Custom tile content
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return null;

    const dateStr = format(date, "yyyy-MM-dd");
    const dayEvents = eventsByDate[dateStr] || [];

    return (
      <div className="calendar-events">
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

  // Custom tile className
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return null;

    const classes = [];
    if (isSameDay(date, new Date())) {
      classes.push("today");
    }

    const dateStr = format(date, "yyyy-MM-dd");
    if (eventsByDate[dateStr]) {
      classes.push("has-events");
    }

    return classes.join(" ");
  };

  return (
    <div className="calendar-container">
      <h2 className="calendar-title">Event Calendar</h2>
      <Calendar
        onChange={setDate}
        value={date}
        tileContent={tileContent}
        tileClassName={tileClassName}
        prevLabel={<span className="nav-arrow">&lt;</span>}
        nextLabel={<span className="nav-arrow">&gt;</span>}
        prev2Label={null}
        next2Label={null}
      />
    </div>
  );
};

export default CalendarView;
