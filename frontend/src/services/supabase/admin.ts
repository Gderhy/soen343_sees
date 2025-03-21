import { AuthError, createClient, User, UserMetadata } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = import.meta.env.VITE_SERVICE_ROLE_KEY; 

// ✅ Create a Supabase client for admin actions
const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// ✅ Function to fetch all users (Admins only)
export const fetchUsers = async (): Promise<{ data: User[] | null; error: AuthError | null }> => {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();

  console.log(data?.users);
  return { data: data?.users || null, error };
}

export async function updateUserMetaData(userId: string, metadata: UserMetadata) {
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    user_metadata: metadata,
  });

  if (error) {
    console.error("Failed to update user metadata:", error);
  } else {
    console.log("Updated user:", data);
  }

  return { data, error };
}

// ✅ Function to delete user
export async function deleteUser(userId: string) {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  return { success: !error, error };
}
