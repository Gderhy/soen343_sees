// In src/services/supabase/stakeholder/supabase.js
const supabase = require("../supabaseAdmin"); // your supabase client setup

const { handleEventStatus } = require("./helperFunctions/handleEventStatus");

// Function to get all stackholders pending events
const fetchStakeholdersPendingEvents = async (stakeholderId) => {
  const { data, error } = await supabase
    .from("event_stakeholders")
    .select("events (*)")
    .eq("stakeholder_id", stakeholderId)
    .eq("status", "pending");

  return { data, error };
};

const updateStakeholderEventStatus = async (stakeholderId, eventId, status) => {
  try {
    const { data, error } = await supabase
      .from("event_stakeholders")
      .update({ status })
      .eq("stakeholder_id", stakeholderId)
      .eq("event_id", eventId);

    if (error) {
      return { error };
    }

    console.log("Calling handleEventStatus");
    const { error: handleEventStatusError } = handleEventStatus(eventId, status);
    console.log("handleEventStatusError: ", handleEventStatusError);
    
    if (handleEventStatusError) {
      return { error: handleEventStatusError };
    }

    return { data, error };
  } catch (err) {
    return { error: err.message };
  };
};

module.exports = {
  fetchStakeholdersPendingEvents,
  updateStakeholderEventStatus,
  // ... other functions
};
