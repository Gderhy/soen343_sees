import axios from "axios";

export const fetchAllActiveEvents = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/events");

    if (response.status !== 200) {
      return { data: null, error: response.statusText };
    }

    if (response.data.error) {
      return { data: null, error: response.data.error };
    }

    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};