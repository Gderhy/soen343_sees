const supabase = require("../supabaseAdmin");

// Function to get all stackholders
const fetchStakeholders = async () => {
  const { data, error } = await supabase.from("stakeholders").select("id, full_name, email, phone");
  return { data, error };
};

const createEvent = async (obj) => {
  // insert event into the events table
  const event = {
    title: obj.title,
    description: obj.description,
    event_datetime: obj.event_datetime,
    location: obj.location,
    created_by: obj.userId,
    status: "pending",
  };

  const { data, error } = await supabase.from("events").insert(event).select("id");

  if (error) {
    return { error };
  }

  // insert event into event_stakeholders table
  const stackholdersEvents = obj.stakeholdersIds.map((stackholder) => {
    return {
      event_id: data[0].id,
      stakeholder_id: stackholder,
      status: "pending",
    };
  });

  const queryReponse = await supabase.from("event_stakeholders").insert(stackholdersEvents);

  if (queryReponse.error !== null) {
    return { error: queryReponse.error };
  }

  // insert event into event_organizers table
  const organizersEvents = {
    event_id: data[0].id,
    organizer_id: obj.userId,
  };

  const queryReponse2 = await supabase.from("event_organizers").insert(organizersEvents);

  if (queryReponse2.error !== null) {
    return { error: queryReponse2.error };
  }

  return { eventId: data[0].id, error };
};

const fetchUsersEvents = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("event_organizers")
      .select("events (*)")
      .eq("organizer_id", userId);

    if (error) {
      console.error("Error fetching user's events:", error);
      return { error };
    }

    // Destructure the events from the array
    const events = data.map((item) => item.events);

    return { data: events, error: null };
  } catch (err) {
    return { error: err };
  }
};
const deleteEvent = async (eventId) => {
  const { data, error } = await supabase.from("events").delete().eq("id", eventId);
  return { data, error };
};

const updateEvent = async (userId, obj) => {
  try {
    // Destructure the event object from obj
    const { event } = obj;

    // Check if the user is an organizer of the event
    const { data: organizer, error: organizerError } = await supabase
      .from("event_organizers")
      .select("*")
      .eq("organizer_id", userId)
      .eq("event_id", event.id);

    if (organizerError !== null) {
      return { error: organizerError.message }; // Return the error message
    }

    if (organizer.length === 0) {
      return { error: "User is not an organizer of the event" };
    }

    // Update the event
    const { data, error } = await supabase
      .from("events")
      .update(event) // Use event instead of obj
      .eq("id", event.id);

    if (error) {
      return { error: error.message }; // Return the error message
    }

    return { data, error: null }; // Return success with no error
  } catch (err) {
    return { error: err.message }; // Return the error message
  }
};

const rsvpToEvent = async (obj) => {
  try {
    const entry = {
      event_id: obj.eventId,
      user_id: obj.userId,
      status: "accepted", // TODO: implement a way to accept or decline on managers portal
    };

    const { data, error } = await supabase.from("event_attendance").insert(entry);

    if (error) {
      return { error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    return { error: err.message };
  };
};

const deleteRsvp = async (obj) => {
  try {
    const { data, error } = await supabase
      .from("event_attendance")
      .delete()
      .eq("event_id", obj.eventId)
      .eq("user_id", obj.userId);

    if (error) {
      return { error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    return { error: err.message };
  }
};

const checkRsvp = async (userId, eventId) => {
  try {
    const { data, error } = await supabase
      .from("event_attendance")
      .select("*")
      .eq("event_id",eventId)
      .eq("user_id", userId);

    if (error) {
      return { error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    return { error: err.message };
  }
};


module.exports = {
  fetchStakeholders,
  createEvent,
  fetchUsersEvents,
  deleteEvent,
  updateEvent,
  rsvpToEvent,
  deleteRsvp,
  checkRsvp,
  // ... other functions
};
