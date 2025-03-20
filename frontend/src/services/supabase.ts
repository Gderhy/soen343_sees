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
    .insert([{ title, description, event_date, location, created_by: userData.user.id }])
    .select("*")
    .single();

  return { data, error };
};

// Function to fetch an event by id
export async function getEventById(eventId: string) {
  const { data, error } = await supabase.from("events").select("*").eq("id", eventId).single();

  return { data, error };
}

// Update an existing event
export async function updateEvent(eventId: string, title: string, description: string, event_date: string, location: string) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) {
    return { error: "User not authenticated." };
  }

  const { data, error } = await supabase
    .from("events")
    .update({ title, description, event_date, location })
    .eq("id", eventId)
    .eq("created_by", userData.user.id); // Only allow updates by the creator

  return { data, error };
}

// Delete an event
export async function deleteEvent(eventId: string) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) {
    return { error: "User not authenticated." };
  }

  const { data, error } = await supabase
    .from("events")
    .delete()
    .eq("id", eventId)
    .eq("created_by", userData.user.id); // Only allow deletion by the creator

  return { data, error };
}

// Fetch all events
export async function fetchAllEvents() {
  const { data, error } = await supabase.from("events").select("*");

  return { data, error };
};

// Fetch events created by the logged-in user
export async function fetchUserEvents(userId: string) {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("created_by", userId);

  return { data, error };
}



