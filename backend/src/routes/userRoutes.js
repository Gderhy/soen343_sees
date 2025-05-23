// src/routes/userRoutes.js

const express = require("express");
const router = express.Router();
const {
  fetchStakeholders,
  createEvent,
  deleteEvent,
  fetchUsersEvents,
  updateEvent,
  rsvpToEvent,
  deleteRsvp,
  checkRsvp,
  checkIfUserIsOrganizer,
  checkEligibility,
  fetchAllUniversities,
  fetchUserAttendingEvents,
  rsvpToPaidEvent,
  getEventExpenses,
  getEventRevenue,
  addExpenseToEvent,
  fetchEventAttendees,
  sendMailingList,
} = require("../services/supabase/user/supabase");

// GET /api/user/stakeholders
// Fetch all stakeholders from the database
// Public -- TODO: need to move to all users
router.get("/stakeholders", async (req, res) => {
  try {
    const { data, error } = await fetchStakeholders();
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    console.log("Stakeholders fetched successfully: ", data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/user/event
// Create an event
// Private for users
router.post("/event", async (req, res) => {
  try {
    const obj = req.body;

    // insert event into the events table
    const { eventId, error } = await createEvent(obj);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    console.log("Event created successfully: ", eventId);
    res.json(eventId);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/event/:eventId/send-mailing-list", async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!eventId) {
      return res.status(400).json({ error: "Missing required field: eventId" });
    }

    // Call the Mailchimp service function
    const result = await sendMailingList(eventId);

    console.log("Mailing list sent successfully for event: ", result);
    // Send the response back to the client

    if (
      result.error ||
      result.message !== "Tags updated successfully. Emails will be sent via Mailchimp Journey."
    ) {
      return res.status(500).json({ error: result.error });
    }

    res.json(result);
  } catch (err) {
    console.error("Error in /event/:eventId/send-mailing-list:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/user/:userId/event
// Fetch all events for a user
router.get("/:userId/events", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { data, error } = await fetchUsersEvents(userId);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    console.log("Events fetched successfully for user: ", userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/user/event/:eventId
// Delete an event
router.delete("/event/:eventId", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { error } = await deleteEvent(eventId);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    console.log("Event deleted successfully: ", req.params.eventId);
    res.json({ message: `Event: ${eventId} deleted successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/user/:userId/event
// Update an event
// Private for users
router.put("/:userId/event/", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { error } = await updateEvent(userId, req.body);

    if (error) {
      console.error("Error updating event:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log("Event updated successfully:", req.body.event.id);
    res.json({ message: `Event ${req.body.event.id} updated successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/user/rsvp
// Allow users to RSVP to events
router.post("/rsvp", async (req, res) => {
  try {
    const { userId, eventId } = req.body;

    if (!userId || !eventId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await rsvpToEvent({ userId, eventId });

    if (error) {
      console.error("RSVP error:", error); // Log the error
      return res.status(500).json({ error }); // Return the error in the response
    }

    console.log("RSVP successful for user:", userId);
    res.json({ message: "RSVP successful", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/user/rsvp
// Allow for users to delete their RSVP to events
// Private for users
router.delete("/rsvp", async (req, res) => {
  try {
    const { error } = await deleteRsvp(req.body);
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    console.log("RSVP deleted successfully for user: ", req.body.userId);
    res.json({ message: "RSVP deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/user/check-rsvp
// Check if a user has RSVP'd to an event
router.post("/check-rsvp", async (req, res) => {
  try {
    const { userId, eventId } = req.body;
    if (!userId || !eventId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await checkRsvp(userId, eventId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const hasRsvp = data.length > 0;

    console.log(
      `User: ${userId} has RSVP'd to this event: ${eventId}? ${hasRsvp}`
    );

    const message = hasRsvp
      ? "User has RSVP'd to this event"
      : "User has not RSVP'd to this event";
    res.json({ message, hasRsvp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/is-organizer", async (req, res) => {
  try {
    const { userId, eventId } = req.body;
    if (!userId || !eventId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await checkIfUserIsOrganizer(userId, eventId);
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const isOrganizer = data.length > 0;
    const message = isOrganizer
      ? "User is an organizer of this event"
      : "User is not an organizer of this event";

    console.log(message);
    res.json({ message, isOrganizer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/user/check-eligibility
// To check the eligibility of a user to attend an event
router.post("/check-eligibility", async (req, res) => {
  try {
    const { userId, usersUniversity, eventId, eventParticipation } = req.body;
    if (!userId || !usersUniversity || !eventId || !eventParticipation) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await checkEligibility(
      userId,
      usersUniversity,
      eventId,
      eventParticipation
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/user/universities
// Fetch all universities from the database
router.get("/universities", async (req, res) => {
  try {
    const { data, error } = await fetchAllUniversities();
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/user/attending-events
// Fetch all events a user is attending
router.post("/attending-events", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await fetchUserAttendingEvents(userId);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/user/rsvp-paid
// RSVP to a paid event
router.post("/rsvp-paid", async (req, res) => {
  try {
    const { userId, eventId, paymentDetails } = req.body;

    console.log("Payment Details: ", paymentDetails);

    if (!userId || !eventId || !paymentDetails) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const { data, error } = await rsvpToPaidEvent(eventId, userId, paymentDetails);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: "RSVP to paid event successful", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/user/event/get-expenses
router.post("/event/get-expenses", async (req, res) => {
  try {
    const { eventId } = req.body;
    if (!eventId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await getEventExpenses(eventId);

    console.log("Event expenses: ", data);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/user/events/financial-report`
// Generate a financial report for an event
router.post("/events/financial-report", async (req, res) => {
  try {
    const { eventId } = req.body;
    if (!eventId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Call the function to generate the financial report
    const { data: eventExpensesData, error: eventExpensesError } = await getEventExpenses(eventId);
    if (eventExpensesError) {
      return res.status(500).json({ error: eventExpensesError.message });
    }

    const { data: eventRevenueData, error: eventRevenueError } = await getEventRevenue(eventId);
    if (eventRevenueError) {
      return res.status(500).json({ error: eventRevenueError.message });
    }

    const data = {
      eventExpenses: eventExpensesData,
      eventRevenue: eventRevenueData,
    };

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/user/events/add-expense
// Add an expense to an event
router.post("/events/add-expense", async (req, res) => {
  try {
    const { eventId, expenseDetails } = req.body;
    if (!eventId || !expenseDetails) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Call the function to add the expense
    const { data, error } = await addExpenseToEvent(eventId, expenseDetails);
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: "Expense added successfully", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/user/event/:eventId/attendees
// Fetch all attendees for an event
router.get("/event/:eventId/attendees", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { data, error } = await fetchEventAttendees(eventId);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    console.log("Attendees fetched successfully for event: ", eventId);
    console.log("Attendees: ", data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/user/event/remove-attendee
// Remove an attendee from an event
router.post("/event/remove-attendee", async (req, res) => {
  try {
    const { eventId, userId } = req.body.eventAttendeeDetails;
    console.log("Event ID: ", eventId);
    console.log("User ID: ", userId);
    if (!eventId || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Call the function to remove the attendee
    const { data, error } = await deleteRsvp({ eventId, userId });
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: "Attendee removed successfully", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
