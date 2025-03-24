import { AuthError, createClient, PostgrestError } from "@supabase/supabase-js";
import { SystemRole } from "../../types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

export const getUsersUniversity = async (): Promise<string | null> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const university = session?.user?.user_metadata?.university || null;

  return university;
}