// In src/services/supabase/stakeholder/supabase.js
const supabase = require("../supabaseAdmin"); // your supabase client setup

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
  const { data, error } = await supabase
    .from("event_stakeholders")
    .update({ status })
    .eq("stakeholder_id", stakeholderId)
    .eq("event_id", eventId);

  return { data, error };
};

module.exports = {
  fetchStakeholdersPendingEvents,
  updateStakeholderEventStatus,
  // ... other functions
};
