import axios from "axios";
import { url } from "./url";
import {Stakeholder} from "../../types";

export const fetchAllActiveEvents = async () => {
  try {
    const response = await axios.get(`${url}/api/events`);

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
    const response = await axios.get(`${url}/api/events/${eventId}`);

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
    const response = await axios.get(`${url}/api/events/${eventId}/attendees-count`);

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

// some comment
export const fetchUniversities = async () => {
  try {
    const response = await axios.get(`${url}/api/user/universities`);
    if (response.status !== 200) {
      return { data: null, error: response.statusText };
    }
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};

// storing messages in backend for demo
export const sendChatMessage = async (message: string, eventId?: string) => {
  try {
    const apiEndpoint =
      eventId != undefined && eventId?.length > 0
        ? `${url}/api/events/${eventId}/messages`
        : `${url}/api/events/post/messages`;
    const response = await axios.post(apiEndpoint, message);
    return response.data;
  } catch (err) {
    console.error("Error sending message:", err);
    throw err;
  }
};

export const fetchMessages = async (eventId: string) => {
  try {
    const response = await axios.get(`${url}/api/events/${eventId}/messages`);
    return response.data;
  } catch (err) {
    console.error("Error fetching messages:", err);
    throw err;
  }
};

export const getViewCount = async (eventId: string) => {
  try {
    const response = await axios.get(`${url}/api/event/${eventId}/message/view`);
    return response.data;
  } catch (err) {
    console.error("Error getting view count:", err);
    throw err;
  }
};

export const fetchEventStakeholders = async (eventId: string) => {
  try {
    const response = await axios.post(`${url}/api/event/stakeholders`, { eventId });
    if (response.status !== 200) {
      return { data: null, error: response.statusText };
    }

    const stakeholders = response.data.map(({stakeholders} : {stakeholders:Stakeholder}) => ({
      id: stakeholders.id,
      full_name: stakeholders.full_name,
      email: stakeholders.email,
      phone: stakeholders.phone, 
    }));

    return { data: stakeholders, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};
