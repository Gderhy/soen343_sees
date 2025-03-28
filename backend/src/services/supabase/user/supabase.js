const supabase = require("../supabaseAdmin");

// Function to get all stackholders
const fetchStakeholders = async () => {
  const { data, error } = await supabase.from("stakeholders").select("id, full_name, email, phone");
  return { data, error };
};

const createEvent = async (obj) => {
  const event = {
    title: obj.title,
    description: obj.description,
    event_datetime: obj.event_datetime,
    location: obj.location,
    owned_by: obj.userId,
    base_price: obj.basePrice,
    participation: obj.participation, // 'public' or 'university'
    status: obj.stakeholdersIds.length > 0 ? "pending" : "active",
  };

  const { data, error } = await supabase.from("events").insert(event).select("id");

  if (error) {
    return { error };
  }

  // Associate event with universities if participation is 'university'
  if (obj.participation === "university" && obj.selectedUniversitiesIds?.length > 0) {
    const eventUniversities = obj.selectedUniversitiesIds.map((universityId) => ({
      event_id: data[0].id,
      university_id: universityId,
    }));

    const universityResponse = await supabase.from("event_universities").insert(eventUniversities);
    if (universityResponse.error) {
      return { error: universityResponse.error };
    }
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

  return { eventId: data[0].id, error: null };
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
    // Check if the event is restricted to specific universities
    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .select("participation")
      .eq("id", obj.eventId)
      .single();

    if (eventError) {
      console.error("Error fetching event participation:", eventError);
      return { error: eventError.message };
    }

    if (eventData.participation === "university") {
      // Fetch allowed universities for the event
      const { data: allowedUniversities, error: universityError } = await supabase
        .from("event_universities")
        .select("university_id")
        .eq("event_id", obj.eventId);

      if (universityError) {
        console.error("Error fetching allowed universities:", universityError);
        return { error: universityError.message };
      }

      // Fetch university names from the universities table
      const universityIds = allowedUniversities.map((entry) => entry.university_id);
      const { data: universityNames, error: universityNamesError } = await supabase
        .from("universities")
        .select("full_name")
        .in("id", universityIds);

      if (universityNamesError) {
        console.error("Error fetching university names:", universityNamesError);
        return { error: universityNamesError.message };
      }

      // Check if the user's university matches any of the allowed university names
      const { data: userUniversity, error: userError } = await supabase
        .from("users")
        .select("university")
        .eq("id", obj.userId)
        .single();

      if (userError) {
        console.error("Error fetching user's university:", userError);
        return { error: userError.message };
      }

      const isEligible = universityNames.some(
        (entry) => entry.full_name === userUniversity.university
      );

      if (!isEligible) {
        console.error("User is not eligible to RSVP for this event.");
        return { error: "User is not eligible to RSVP for this event." };
      }
    }

    // Proceed with RSVP
    const entry = {
      event_id: obj.eventId,
      user_id: obj.userId,
      status: "accepted",
    };

    const { data, error } = await supabase.from("event_attendance").insert(entry);

    if (error) {
      console.error("Error inserting RSVP:", error);
      return { error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Unexpected error in rsvpToEvent:", err);
    return { error: err.message };
  }
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

const checkIfUserIsOrganizer = async (userId, eventId) => {
  try {
    const { data, error } = await supabase
      .from("event_organizers")
      .select("*")
      .eq("organizer_id", userId)
      .eq("event_id", eventId);

    if (error) {
      return { error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    return { error: err.message };
  }
};

// Function to check if a user is eligible to RSVP to an event
const checkEligibility = async (userId, usersUniversity, eventId, eventParticipation) => {
  try{



  } catch (err) {

  }
};

const fetchAllUniversities = async () => {
  try {
    const { data, error } = await supabase.from("universities").select("id, full_name");
    return { data, error };
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
  checkIfUserIsOrganizer,
  checkEligibility,
  fetchAllUniversities,
};
