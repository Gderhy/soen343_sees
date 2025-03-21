// src/services/supabase/admin/supabase.js
const supabaseAdmin = require("../supabaseAdmin");

// Fetch all users using the Supabase Admin client
async function fetchUsers() {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();
  console.log(data?.users);
  return { data: data?.users || null, error };
}

// Update user metadata
async function updateUserMetaData(userId, metadata) {
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

// Delete user
async function deleteUser(userId) {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  return { success: !error, error };
}

// Create a user 
async function createUser({ email, password, fullName, phone, systemRole = "user" }) {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { fullName, systemRole, phone },
  });
  if (error) {
    console.error("Failed to create user:", error);
  }
  return { data, error };
}

module.exports = {
  fetchUsers,
  updateUserMetaData,
  deleteUser,
  createUser,
};
