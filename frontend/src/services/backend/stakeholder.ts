import axios from "axios";
import { StakeholderEventStatusType } from "../../types";
import { url } from "./url";

export const getPendingStakeholderEvent = async (stakeholderId: string) => {
  try {
    const response = await axios.get(
      `${url}/api/stakeholder/${stakeholderId}/events/pending`
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
  status: StakeholderEventStatusType
) => {
  try {
    const response = await axios.put(
      `${url}/api/stakeholder/${stakeholderId}/events/${eventId}/status`,
      { status }
    );

    console.log(response);
    if (response.status !== 200) {
      return { error: response.statusText };
    }

    if (response.data.error) {
      return { error: response.data.error };
    }

    return { error: null };
  } catch (err) {
    return { error: err };
  }
};

export const fetchAllStakeHolderEvents = async (stakeholderId: string) => {
  try {
    const response = await axios.get(
      `${url}/api/stakeholder/${stakeholderId}/events`
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
