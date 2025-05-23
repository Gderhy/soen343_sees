import axios from "axios";
import { Event, ParticipationType, PaymentDetails } from "../../types";
import { getUserId, getUsersUniversity } from "../supabase/supabase";
import { url } from "./url";

export const fetchAllStakeholders = async () => {
  try {
    const response = await axios.get(`${url}/api/user/stakeholders`);

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
  participation: ParticipationType,
  stakeholdersIds: string[],
  selectedUniversities: string[] // Added parameter

) => {

  try {
    const response = await axios.post(`${url}/api/user/event`, {
      userId: await getUserId(),
      title,
      description,
      event_datetime,
      location,
      basePrice,
      participation,
      stakeholdersIds,
      selectedUniversitiesIds: selectedUniversities,
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

export const sendMailingList = async (eventId: string) => {
  try {
    const response = await axios.post(
      `${url}/api/user/event/${eventId}/send-mailing-list`
    );

    if (response.status !== 200) {
      throw new Error("Failed to send mailing list.");
    }

    if (
      response.data.error ||
      response.data.message !==
        "Tags updated successfully. Emails will be sent via Mailchimp Journey."
    ) {
      throw new Error(response.data.error);
    }
    return {
      message: "Mailing list sent successfully!",
    };
  } catch (err) {
    console.error("Error in sendMailingList:", (err as Error).message);
    throw err;
  }
};

export const deleteEvent = async (eventId: string) => {
  try {
    const response = await axios.delete(`${url}/api/user/event/${eventId}`);

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
    const response = await axios.get(`${url}/api/user/${userId}/events`);

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
    const response = await axios.put(`${url}/api/user/${userId}/event`, {
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
    const response = await axios.post(`${url}/api/user/rsvp`, {
      userId: await getUserId(),
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
    const response = await axios.delete(`${url}/api/user/rsvp`, {
      data: {
        userId: await getUserId(),
        eventId,
      },
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
    const response = await axios.post(`${url}/api/user/check-rsvp`, {
      userId: await getUserId(),
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
    const response = await axios.post(`${url}/api/user/is-organizer`, {
      userId: await getUserId(),
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
};

export const checkEligibility = async (
  eventId: string,
  eventParticipation: ParticipationType
) => {
  try {
    const response = await axios.post(`${url}/api/user/check-eligibility`, {
      userId: await getUserId(),
      usersUniversity: await getUsersUniversity(),
      eventId,
      eventParticipation,
    });

    if (response.status !== 200) {
      return { isEligible: false, error: response.statusText };
    }

    if (response.data.error) {
      return { isEligible: false, error: response.data.error };
    }

    return { isEligible: response.data.isEligible, error: null };
  } catch (err) {
    return { isEligible: false, error: err };
  }
}

// This function fetches the events that the user is attending
// It uses the userId to get the events from the backend
export const fetchUsersAttendingEvents = async (userId: string) => {
  try {
    const response = await axios.post(`${url}/api/user/attending-events`, {
      userId,
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
}

// This function cancels the attendance of the user to an event
// It uses the userId and eventId to cancel the attendance in the backend
export const cancelAttendance = async (userId: string, eventId: string) => {
  try {
    const response = await axios.delete(`${url}/api/user/rsvp`, {
      data: {
        userId,
        eventId,
      },
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
}

export const rsvpToPaidEvent = async (
  eventId: string,
  paymentDetails: PaymentDetails
) => {
  try {
    const response = await axios.post(`${url}/api/user/rsvp-paid`, {
      userId: await getUserId(),
      eventId,
      paymentDetails,
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

;
