import axios from "axios";
import { url } from "./url";

export const fetchFinancialReport = async (eventId: string) => {
  try{
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
}

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
}