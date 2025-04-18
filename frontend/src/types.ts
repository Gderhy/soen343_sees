export type SignInProps = {
  email: string;
  password: string;
};

export type SignUpProps = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  systemRole?: SystemRole;
  university?: string;
  career?: string;
};

export type SystemRole = "admin" | "stakeholder" | "user" | null;
export type EventRole = "organizer" | "attendee" | null;

// Make sure to update the db schema to match the new Event type
export type EventStatusType =
  | "pending"
  | "active"
  | "denied"
  | "cancelled"
  | "postponed"
  | "completed";
// Make sure to update the db schema to match the new Event type
export type StakeholderEventStatusType = "pending" | "denied" | "approved";
// Make sure to update the db schema to match the new Event type
export interface Event {
  id: string;
  title: string;
  description: string;
  event_datetime: string;
  location: string;
  status: EventStatusType;
  owned_by: string;
  basePrice: number;
  base_price: number;
  participation: ParticipationType;
}
export const defaultEvent: Event = {
  id: "",
  title: "",
  description: "",
  event_datetime: "",
  location: "",
  status: "pending",
  owned_by: "",
  base_price: 0,
  basePrice: 0,
  participation: "public",
};

export interface Stakeholder {
  id: string;
  full_name: string;
  email: string;
  phone: string;
}

export type EventAttendanceStatus = "pending" | "accepted" | "declined";

export interface University {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
}

export type ParticipationType = "public" | "university";

export interface PaymentDetails {
  name: string;
  number: string;
  exp_mm: string;
  exp_yyyy: string;
  card_type: string;
  code: string;
  amount: number;
}

export interface Revenue {
  id: string;
  eventId: string;
  amount: number;
  events_attendance_id: string;
  created_at: string;
}

export interface Expense {
  id: string;
  created_at: string;
  event_id: string;
  amount: number;
  description: string;
}