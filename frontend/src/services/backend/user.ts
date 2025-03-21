import axios from "axios";

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
}

export const createEvent = async (userId: string, title: string, description: string, eventDatetime: string, location: string, stakeholdersIds: string[]) => {
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

    console.log(response.data);
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}