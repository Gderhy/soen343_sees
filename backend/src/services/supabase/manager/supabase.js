const supabase = require("../supabaseAdmin");

const getEventAttendees = async (eventId) => {
  try {
    const { data, error } = await supabase
      .from("event_attendance")
      .select("*")
      .eq("event_id", eventId);

    return {data, error};
  } catch (err) {
    console.error("Error fetching event attendees:", err);
    return { data: null, error: err };
  }
};

module.exports = {
  getEventAttendees,
};
