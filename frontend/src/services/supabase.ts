import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Function to create an event
export const createEvent = async (title: string, description: string, event_date: string, location: string) => {
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return { error: "User not authenticated." };
  }

  const { data, error } = await supabase
    .from("events")
    .insert([{ title, description, event_date, location, created_by: userData.user.id }]);

  return { data, error };
};




