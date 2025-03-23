import { AuthError, createClient, PostgrestError } from "@supabase/supabase-js";
import { SystemRole } from "../../types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Get attendees for a specific event
// TODO: GOTTA GO TO BACKEND
export async function getEventAttendees(eventId: string) {
  const { data, error } = await supabase
    .from("event_attendance")
    .select("user_id")
    .eq("event_id", eventId); // ✅ Correctly filter by eventId

  return { data, error };
}

// Returns the system role
// Keep this function in frontend
export const getSystemRole = async (): Promise<{
  systemRole: SystemRole;
  error: AuthError | PostgrestError | null;
}> => {
  const {
    data: { session },
    error: roleError,
  } = await supabase.auth.getSession();

  if (roleError) {
    return { systemRole: null, error: roleError };
  }

  const systemRole: SystemRole = session?.user?.user_metadata?.systemRole || null;

  return {
    systemRole,
    error: roleError,
  };
};

// Returns the user id
// Keep this function in frontend
export const getUserId = async (): Promise<string | null> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userId = session?.user?.id || null;

  return userId;
};
