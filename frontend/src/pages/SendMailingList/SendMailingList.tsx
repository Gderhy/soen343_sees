import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase/supabase";
import { sendMailingList } from "../../services/backend/user"; // Assuming you have a backend function for this
import "./SendMailingList.css"; // Create a CSS file for styling if needed
import { Event } from "../../types";

const SendMailingList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    async function fetchUserEvents() {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("organizer_id", userData.user.id);

        if (error) {
          console.error("Error fetching events:", error);
        } else {
          setEvents(data || []);
        }
      }
    }

    fetchUserEvents();
  }, []);

  const handleSendMailingList = async () => {
    if (!selectedEvent) {
      setMessage("Please select an event.");
      return;
    }

    setLoading(true);
    setMessage("");

    console.log("Sending mailing list for event:", selectedEvent);

    try {
      const response = await sendMailingList(selectedEvent); // Backend function to send mailing list
      if (response.message !== "Success") {
        setMessage("Failed to send mailing list.");
      } else {
        setMessage("Mailing list sent successfully!");
      }
    } catch (err) {
      console.error("Error sending mailing list:", err);
      setMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="send-mailing-list-portal">
      <h1>Send Mailing List</h1>
      <p>Select an event to send the mailing list:</p>
      <select
        value={selectedEvent || ""}
        onChange={(e) => setSelectedEvent(e.target.value)}
        className="event-select"
      >
        <option value="" disabled>
          -- Select an Event --
        </option>
        {events.map((event) => (
          <option key={event.id} value={event.id}>
            {event.title}
          </option>
        ))}
      </select>
      <button
        onClick={handleSendMailingList}
        disabled={loading}
        className="send-button"
      >
        {loading ? "Sending..." : "Send Mailing List"}
      </button>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default SendMailingList;
