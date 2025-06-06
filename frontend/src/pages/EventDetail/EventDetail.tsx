import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchEventById,
  getEventAttendeesCount,
  fetchEventStakeholders,
} from "../../services/backend/all";
import {
  rsvpToEvent,
  removeRsvp,
  checkRsvp,
  isUserOrganizer,
} from "../../services/backend/user";
import "./EventDetail.css";
import { Event, defaultEvent } from "../../types";
import { sendMailingList } from "../../services/backend/user";
import { checkEligibility } from "../../services/backend/user";
import { getUsersUniversity } from "../../services/supabase/supabase";
import PaymentModal from "../../components/PaymentModal/PaymentModal";
import FinancialReportModal from "../../components/FinancialReportModal/FinancialReportModal";
import ManageExpenseModal from "../../components/ManageExpenseModal/ManageExpenseModal";
import RegistratioTrendChart from "../../components/RegistratioTrendChart/RegistratioTrendChart";
import { Stakeholder } from "../../types";


const EventDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // id -> event id

  const [event, setEvent] = useState<Event>(defaultEvent);
  const [isAttending, setIsAttending] = useState<boolean>(false);
  const [attendees, setAttendees] = useState<number>(0);
  const [isOrganizer, setIsOrganizer] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [viewPaymentModal, setViewPaymentModal] = useState<boolean>(false);
  const [viewFinancialReportModal, setViewFinancialReportModal] = useState<boolean>(false);
  const [viewManageExpenseModal, setViewManageExpenseModal] = useState<boolean>(false);
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);


  useEffect(() => {
    if (!id) return;

    async function fetchEventData() {
      if (!id) {
        navigate("/events");
        return;
      }

      // Fetch event details
      const { data, error: eventError } = await fetchEventById(id);
      if (eventError) {
        setError("Event not found.");
        setLoading(false);
        return;
      }
      setEvent(data);

      // Check if the user has RSVP'd
      const { data: hasRsvp, error: rsvpError } = await checkRsvp(id);
      if (rsvpError) {
        console.error("Error checking RSVP:", rsvpError);
      } else {
        setIsAttending(!!hasRsvp);
      }

      // Fetch attendees
      const { attendees, error: attendeesError } = await getEventAttendeesCount(
        id
      );
      if (attendeesError) {
        console.error("Error fetching attendees:", attendeesError);
      } else {
        setAttendees(attendees || 0);
      }

      // Check if the user is an organizer
      const { isOrganizer: organizerStatus, error: organizerError } =
        await isUserOrganizer(id);
      if (organizerError) {
        console.error("Error checking organizer status:", organizerError);
      } else {
        setIsOrganizer(organizerStatus);
      }

      // TODO: fetch stakeholders and universities
      const { data: stakeholdersData, error: stakeholdersError } = await fetchEventStakeholders(id);
      if (stakeholdersError) {
        console.error("Error fetching stakeholders:", stakeholdersError);
      } else {
        console.log("Fetched stakeholders:", stakeholdersData);
        setStakeholders(stakeholdersData || []);
      }


      setLoading(false);
    }

    fetchEventData();
  }, [id, navigate]);

  const handleSendMailingList = async () => {
    if (!id) {
      alert("Please select an event.");
      return;
    }

    setLoading(true);
    console.log("Sending mailing list for event:", id);

    try {
      const response = await sendMailingList(id); // Backend function to send mailing list
      if (response.message === "Mailing list sent successfully!") {
        alert("Mailing list sent successfully!");
      } else {
        alert("Failed to send mailing list. Please try again.");
      }
    } catch (err) {
      console.error("Error sending mailing list:", err);
      alert("An error occurred while sending the mailing list.");
    } finally {
      setLoading(false);
    }
  };

  const handleRsvp = async () => {
    if (!id) return;

    if (event.participation === "university" && getUsersUniversity === null) {
      setError("You must be a member of a university to RSVP to this event.");
      return;
    }

    try {
      if (isAttending) {
        // Remove RSVP
        const { error: removeError } = await removeRsvp(id);
        if (removeError) {
          console.error("Error removing RSVP:", removeError);
          setError("Failed to cancel RSVP.");
        } else {
          setIsAttending(false);
          setAttendees((prev) => prev - 1);
        }
      } else {
        // Add RSVP

        if (event.participation === "university") {
          const eligible = checkEligibility(event.id, event.participation);

          if (!eligible) return;
        }

        if (event.base_price > 0) {
          // Open payment modal here
          // Payment logic should be handled in the PaymentModal component
          setViewPaymentModal(true);
          return;
        }

        const { error: rsvpError } = await rsvpToEvent(id);
        if (rsvpError) {
          console.error("Error adding RSVP:", rsvpError);
          setError("Failed to RSVP.");
        } else {
          setIsAttending(true);
          setAttendees((prev) => prev + 1);
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred.");
    }
  };

  const handleGenerateFinancialReport = async () => {
    if (!id) return;
    try {
      // const { data, error } = await fetchFinancialReport(id);
      // if (error) {
      //   setError("Failed to generate financial report.");
      //   return;
      // }
      // Handle the financial report data (e.g., download it or display it)
      // TODO: Implement the logic to handle the financial report data

      setViewFinancialReportModal(true);
      
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred.");
    }
  };

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="event-container">
      <h1>{event.title}</h1>
      <p className="event-description">{event.description}</p>
      <p>
        <strong>Date:</strong> {new Date(event.event_datetime).toLocaleDateString()}
      </p>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      {event.base_price > 0 && (
        <p>
          <strong>Price: </strong>${event.base_price}
        </p>
      )}
      <p>
        <strong>Attendees:</strong> {attendees}
      </p>
      <p>
        <strong>Stakeholders:</strong>{" "}
        {stakeholders.length > 0 ? (
          stakeholders.map((stakeholder, index) => (
            <span key={index}>
              {stakeholder.full_name}
              {index < stakeholders.length - 1 ? ", " : ""}
            </span>
          ))
        ) : (
          <span>No stakeholders available.</span>
        )}
      </p>

      {/* Access Live Event Page */}
      {isAttending == true ? (
        <button onClick={() => navigate(`/event/live/${id}`)}>Access Live Event Page</button>
      ) : null}

      {/* RSVP Button */}
      {!isOrganizer && (
        <button
          onClick={handleRsvp}
          className={isAttending ? "rsvp-button attending" : "rsvp-button"}
        >
          {isAttending ? "Cancel RSVP" : "RSVP to Event"}
        </button>
      )}

      {/* Organizer Tools */}
      {isOrganizer && (
        <>
          <button onClick={() => navigate(`/edit-event/${id}`)} className="modify-button">
            Modify Event
          </button>
          <button onClick={handleGenerateFinancialReport} className="financial-report-button">
            Generate Financial Report
          </button>
          <button
            onClick={() => {
              setViewManageExpenseModal(true);
            }}
            className="manage-expense-button"
          >
            Manage Expense
          </button>
          <button
            onClick={() => navigate(`/manage-attendees/${id}`)}
            className="manage-attendees-button"
          >
            Manage Attendees
          </button>
          <button
            type="button"
            className="send-mailing-list-button"
            onClick={handleSendMailingList}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Out Mailing List"}
          </button>
          <RegistratioTrendChart eventId={event.id} />
        </>
      )}
      <PaymentModal
        isOpen={viewPaymentModal}
        onClose={() => setViewPaymentModal(false)}
        eventId={event.id}
        eventCost={event.base_price}
      />
      <FinancialReportModal
        isOpen={viewFinancialReportModal}
        onClose={() => setViewFinancialReportModal(false)}
        numberOfAttendees={attendees}
        eventId={event.id}
        eventBasePrice={event.base_price}
      />
      {/* Manage Expense Modal */}
      <ManageExpenseModal
        isOpen={viewManageExpenseModal}
        onClose={() => setViewManageExpenseModal(false)}
        eventId={event.id}
      />
    </div>
  );
};

export default EventDetail;
