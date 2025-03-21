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

  // insert event into stackholdersEvents table
  const stackholdersEvents = obj.stakeholdersIds.map((stackholder) => {
    return {
      event_id: data[0].id,
      stakeholder_id: stackholder,
      status: "pending",
    };
  });

  const queryReponse = await supabase.from("stakeholder_events").insert(stackholdersEvents);

  if (queryReponse.error !== null) {
    return { error: queryReponse.error };
  }


  return { eventId: data[0].id, error };
};

module.exports = {
  fetchStakeholders,
  createEvent,
  // ... other functions
};
