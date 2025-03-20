const API_URL = "http://localhost:5000";

// Define an Event type
export interface Event {
  id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
}

export async function getEvents(): Promise<Event[]> {
  try {
    const res = await fetch(`${API_URL}/events`);
    if (!res.ok) {
      throw new Error("Failed to fetch events");
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}
