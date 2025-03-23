const supabaseAdmin = require("../supabaseAdmin");

const fetchAllEvents = async () => {  
  const { data, error } = await supabaseAdmin.from("events").select("*").eq("status", "active");
  return { data, error };
};

module.exports = { fetchAllEvents };