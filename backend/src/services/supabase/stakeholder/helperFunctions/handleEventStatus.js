const supabaseAdmin = require("../../supabaseAdmin");

const handleEventStatus = async (eventId, status) => {
  // Have to update the status of all events
  // Order is important
  // if event has one stakeholders denied then update the event status to denied
  // if event has all stakeholders approved then update the event status to approved
  // if event has one stakeholders pending then update the event status to pending -- this is the default status so no need to update
  //  export type EventStatusType = "pending" | "active" | "denied" | "cancelled" | "postponed" | "completed";
  // Make sure to update the db schema to match the new Event type
  // export type StakeholderEventStatusType = "pending" | "denied" | "approved";
  // Make sure to update the db schema to match the new Event type

  if (status === "denied") {
    const { error } = denyEvent(eventId);
    if (error) {
      return { error };
    }

    // Return early if event is denied
    return;
  }

  const { data, error } = await fetchStakeholderEventStatusCounts(eventId);
  if (error) {
    return { error };
  }

  const { pending, approved, denied } = data; // Destructure status counts

  // Calculate the total number of stakeholders
  const totalStakeholders = pending + approved + denied;
  console.log("totalStakeholders: ", totalStakeholders);

  if (denied > 0) {
    const { error } = denyEvent(eventId);
    if (error) {
      return { error };
    }
  } else if (approved === totalStakeholders) {
    // All stakeholders approved
    const { error } = approveEvent(eventId);
    if (error) {
      return { error };
    }
  } else if (pending > 0) {
    // All stakeholders pending
    return;
  } else {
    return;
  }
};

const fetchStakeholderEventStatusCounts = async (eventId) => {
  try {
    // Fetch all rows for the event
    const { data, error } = await supabaseAdmin
      .from("event_stakeholders")
      .select("*")
      .eq("event_id", eventId);

    if (error) {
      return { error };
    }
    // Initialize status counts
    const statusCountsInitialValue = {
      pending: 0,
      approved: 0,
      denied: 0,
    };

    // Group the rows by status and count them
    const statusCounts = data.reduce((acc, row) => {
      acc[row.status] = (acc[row.status] || 0) + 1;
      return acc;
    }, statusCountsInitialValue);

    return { data: statusCounts };
  } catch (err) {
    return { error: err.message };
  }
};

const denyEvent = async (eventId) => {
  try {
    const { error } = await supabaseAdmin
      .from("events")
      .update({ status: "denied" })
      .eq("id", eventId);

    if (error) {
      return { error };
    }
  } catch (err) {
    return { error: err.message };
  }
};

const approveEvent = async (eventId) => {
  try {
    const { error } = await supabaseAdmin
      .from("events")
      .update({ status: "active" })
      .eq("id", eventId);

    if (error) {
      return { error };
    }
  } catch (err) {
    return { error: err.message };
  }
};

module.exports = { handleEventStatus };
