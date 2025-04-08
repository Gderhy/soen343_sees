import axios from "axios";
import { url } from "./url";

export const fetchFinancialReport = async (eventId: string) => {
  try {
    const response = await axios.post(`${url}/api/user/events/financial-report`, {
      eventId,
    });

    if (response.status !== 200) {
      return { data: null, error: response.statusText };
    }

    if (response.data.error) {
      return { data: null, error: response.data.error };
    }

    console.log("Financial report data:", response.data);

    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};

export const addExpenseToEvent = async (eventId: string, description: string, amount: number) => {
  try {
    const response = await axios.post(`${url}/api/user/events/add-expense`, {
      eventId,
      expenseDetails: {
        description,
        amount,
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

export const fetchEventExpenses = async (eventId: string) => {
  try {
    const response = await axios.post(`${url}/api/user/event/get-expenses`, {
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

export const fetchEventAttendees = async (eventId: string) => {
  try {
    const response = await axios.get(`${url}/api/user/event/${eventId}/attendees`);

    if (response.status !== 200) {
      return { data: null, error: response.statusText };
    }

    if (response.data.error) {
      return { data: null, error: response.data.error };
    }

    console.log("Attendees data:", response.data);

    const attendees = response.data.map((attendee: any) => {
      return {
        id: attendee.users.id,
        name: attendee.users.full_name,
        email: attendee.users.email,
        phone: attendee.users.phone,
        career: attendee.users.career,
        university: attendee.users.university,
        role: attendee.users.system_role,
      };
    });

    console.log("Formatted attendees data:", attendees);

    return { data: attendees, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};

export const removeAttendeeFromEvent = async (eventId: string, attendeeId: string) => {
  try {
    const response = await axios.post(`${url}/api/user/event/remove-attendee`, {
      eventAttendeeDetails: {
        eventId,
        userId: attendeeId,
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
