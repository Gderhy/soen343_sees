import { UserMetadata } from '@supabase/supabase-js';
import axios from 'axios';
import { url } from './url';

//TODO: Implement the try catch

export const fetchAllUsers = async () => {
  const response = await axios.get(`${url}/api/admin/users`);
  
  if (response.status !== 200) {
    return { data: null, error: response.statusText };
  }

  return { data: response.data, error: null };
};

export const createUser = async (userData: { email: string; password: string; phone: string; fullName: string, systemRole: string }) => {
  const response = await axios.post(`${url}/api/admin/users`, userData);

  if (response.status !== 200) {
    return { data: null, error: response.statusText };
  }

  if (response.data.error) {
    return { data: null, error: response.data.error };
  }

  return { data: response.data, error: null };

};

export const updateUserMetaData = async (userId: string, userMetadata: UserMetadata) => { 
  const response = await axios.put(`${url}/api/admin/users/${userId}`, { user_metadata: userMetadata });

  console.log("response", response);

  if (response.status !== 200) {
    return { error: response.statusText };
  }

  if (response.data.error) {
    return { error: response.data.error };
  }

  return { data: response.data, error: null };
};

export const deleteUser = async (userId: string) => {
  const response = await axios.delete(`${url}/api/admin/users/${userId}`);

  if (response.status !== 200) {
    return { error: response.statusText };
  }

  if (response.data.error) {
    return { error: response.data.error };
  }

  return { data: response.data, error: null };
};