// In src/services/supabase/stakeholder/supabase.js
const supabase = require("../supabaseAdmin"); // your supabase client setup

// Function to get all stackholders pending events
const fetchStakeholdersPendingEvents = async (stakeholderId) => {
  const { data, error } = await supabase
    .from("stakeholder_events")
    .select("*")
    .eq("stakeholder_id", stakeholderId)
    .eq("status", "pending");

  return { data, error };
};

const updateStakeholderEventStatus = async (stakeholderId, eventId, status) => {
  const { data, error } = await supabase
    .from("stakeholder_events")
    .update({ status })
    .eq("stakeholder_id", stakeholderId)
    .eq("id", eventId);

  return { data, error };
}

module.exports = {
  fetchStakeholdersPendingEvents,
  updateStakeholderEventStatus,
  // ... other functions
};
