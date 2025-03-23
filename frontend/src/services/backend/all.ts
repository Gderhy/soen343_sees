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

export const fetchEventById = async (eventId: string) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/events/${eventId}`);

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

export const getEventAttendeesCount = async (eventId: string) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/events/${eventId}/attendees-count`);

    console.log("getEventAttendeesCount", response);

    if (response.status !== 200) {
      return { attendees: 0, error: response.statusText };
    }

    if (response.data.error) {
      return { attendees: 0, error: response.data.error };
    }

    return { attendees: response.data, error: null };
  } catch (err) {
    return { attendees: 0, error: err };
  }
};