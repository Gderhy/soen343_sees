const supabaseAdmin = require("../supabaseAdmin");

const fetchAllEvents = async () => {
  try {
    const { data, error } = await supabaseAdmin.from("events").select("*").eq("status", "active");
    return { data, error };
  } catch (err) {
    return { error: err.message };
  }
};

const fetchEvent = async (eventId) => {
  try {
    const { data, error } = await supabaseAdmin.from("events").select("*").eq("id", eventId).single();
    return { data, error };
  } catch (err) {
    return { error: err.message };
  }
};

const fetchEventAttendeeCount = async (eventId) => {
  try {
    const { count, error } = await supabaseAdmin
      .from("event_attendance")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId);

    if (error) {
      return { error };
    }

    return { count, error: null };
  } catch (err) {
    return { error: err.message };
  }
};

const fetchAllUniversities = async () => {
  try{
    const { data, error } = await supabaseAdmin.from("universities").select("id, full_name, phone, address, email");
    return { data, error };
  } catch (err) { 
    return { error: err.message };
  }
};

module.exports = { fetchAllEvents, fetchEvent, fetchEventAttendeeCount, fetchAllUniversities };
