import axios from "axios";
import { Event } from "../../types";

export const fetchAllStakeholders = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/user/stakeholders");

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

export const createEvent = async (
  userId: string,
  title: string,
  description: string,
  eventDatetime: string,
  location: string,
  stakeholdersIds: string[]
) => {
  try {
    const response = await axios.post("http://localhost:5000/api/user/event", {
      userId,
      title,
      description,
      event_datetime: eventDatetime,
      location,
      stakeholdersIds,
    });

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

export const deleteEvent = async (eventId: string) => {
  try {
    const response = await axios.delete(`http://localhost:5000/api/user/event/${eventId}`);
    console.log("ssd", response.data);

    if (response.status !== 200) {
      return { error: response.statusText };
    }

    if (response.data.error) {
      return { error: response.data.error };
    }

    return { error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};

export const fetchUsersEvents = async (userId: string) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/user/${userId}/events`);

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

export const updateEvent = async (userId: string, event: Event) => {
  try {
    const response = await axios.put(`http://localhost:5000/api/user/${userId}/event`, {
      event,
    });

    console.log("updateEvent", response);
    if (response.status !== 200) {
      return { data: null, error: response.statusText };
    }

    if (response.data.error) {
      return { data: null, error: response.data.error };
    }

    return { data: response.data, error: null };
  } catch (err) {
    console.log("updateEvent", err);
    return { data: null, error: err };
  }
}

