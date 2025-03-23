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
  }

  const queryReponse2 = await supabase.from("event_organizers").insert(organizersEvents);

  if (queryReponse2.error !== null) {
    return { error: queryReponse2.error };
  }
  
  return { eventId: data[0].id, error };
};

const fetchUsersEvents = async (userId) => {
  const { data, error } = await supabase
    .from("events")
    .select("id, title, description, event_datetime, location")
    .eq("created_by", userId);

  return { data, error };
}

const deleteEvent = async (eventId) => {
  const { data, error } = await supabase.from("events").delete().eq("id", eventId);
  return { data, error };
};

module.exports = {
  fetchStakeholders,
  createEvent,
  fetchUsersEvents,
  deleteEvent,
  // ... other functions
};
