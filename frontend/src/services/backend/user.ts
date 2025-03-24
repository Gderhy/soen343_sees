import axios from "axios";
import { Event } from "../../types";
import { getUserId } from "../supabase/supabase";

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
  title: string,
  description: string,
  event_datetime: string,
  location: string,
  basePrice: number,
  stakeholdersIds: string[]
) => {
  try {
    const response = await axios.post("http://localhost:5000/api/user/event", {
      userId: await getUserId(),
      title,
      description,
      event_datetime,
      location,
      basePrice,
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
};

export const rsvpToEvent = async (eventId: string) => {
  try {
    const response = await axios.post(`http://localhost:5000/api/user/rsvp`, {
      userId : await getUserId(),
      eventId,
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

export const removeRsvp = async (eventId: string) => {
  try {
    const response = await axios.delete(`http://localhost:5000/api/user/rsvp`, {
      data: {
        userId : await getUserId(),
        eventId,
      }
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

export const checkRsvp = async (eventId: string) => {
  try {
    const response = await axios.post(`http://localhost:5000/api/user/check-rsvp`, {
      userId : await getUserId(),
      eventId,
    });

    if (response.status !== 200) {
      return { data: null, error: response.statusText };
    }

    if (response.data.error) {
      return { data: null, error: response.data.error };
    }

    return { data: response.data.hasRsvp, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};

export const isUserOrganizer = async (eventId: string) => {
  try {
    const response = await axios.post(`http://localhost:5000/api/user/is-organizer`, {
      userId : await getUserId(),
      eventId,
    });

    if (response.status !== 200) {
      return { isOrganizer: false, error: response.statusText };
    }

    if (response.data.error) {
      return { isOrganizer: false, error: response.data.error };
    }

    return { isOrganizer: response.data.isOrganizer, error: null };
  } catch (err) {
    return { isOrganizer: false, error: err };
  }
}