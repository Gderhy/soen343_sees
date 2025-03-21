import axios from "axios";

export const getPendingStakeholderEvent = async (stakeholderId: string) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/stakeholder/${stakeholderId}/events/pending`
    );

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

export const updateStakeholderEventStatus = async (
  stakeholderId: string,
  eventId: string,
  status: string
) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/api/stakeholder/${stakeholderId}/events/${eventId}/status`,
      { status }
    );

    if (response.status !== 200) {
      return { error: response.statusText };
    }

    if (response.data.error) {
      return { error: response.data.error };
    }

    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};

export const fetchAllStakeHolderEvents = async (stakeholderId: string) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/stakeholder/${stakeholderId}/events`
    );

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
