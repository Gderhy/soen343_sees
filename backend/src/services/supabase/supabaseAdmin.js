// src/services/supabaseAdmin.js
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log(SUPABASE_URL, SERVICE_ROLE_KEY);

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
  global: { headers: { Authorization: `Bearer ${SERVICE_ROLE_KEY}` } },
});

module.exports = supabaseAdmin;
