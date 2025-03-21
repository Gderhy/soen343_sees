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
};

export type SystemRole = "admin" | "stakeholder" | "user" | null;
export type EventRole = "organizer" | "attendee" | null;

// Make sure to update the db schema to match the new Event type
export type EventStatusType = "pending" | "active" | "denied" | "cancelled" | "postponed"; 
// Make sure to update the db schema to match the new Event type
export type StakeholderEventStatusType = "pending" | "denied" | "approved";
// Make sure to update the db schema to match the new Event type
export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  status: EventStatusType;
  created_by: string;
}