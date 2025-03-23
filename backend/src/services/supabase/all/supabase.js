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

module.exports = { fetchAllEvents, fetchEvent };
