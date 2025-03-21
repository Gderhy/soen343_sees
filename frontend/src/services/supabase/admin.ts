import { createClient } from "@supabase/supabase-js";

// ✅ Replace with your Supabase project URL
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

// ✅ Replace with your Service Role Key (⚠️ Keep this secret, never expose in frontend)
const SERVICE_ROLE_KEY = import.meta.env.VITE_SERVICE_ROLE_KEY; 

// ✅ Create a Supabase client for admin actions
const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// ✅ Function to fetch all users (Admins only)
export async function fetchUsers() {
  const {data, error} = await supabaseAdmin.auth.admin.listUsers();

  console.log(data.users);
  return { data: data.users, error };
}

// ✅ Function to update user role
export async function updateUserRole(userId: string, newRole: string) {
  const { error } = await supabaseAdmin
    .from("system_roles") // ✅ Updates user role in system_roles instead
    .update({ role: newRole })
    .eq("user_id", userId);

  return { success: !error, error };
}

// ✅ Function to delete user
export async function deleteUser(userId: string) {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  return { success: !error, error };
}
