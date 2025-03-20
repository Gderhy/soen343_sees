export type SignInProps = {
  email: string;
  password: string;
};

export type SignUpProps = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
};

export type SystemRole = "admin" | "stakeholder" | "user" | null;
export type EventRole = "organizer" | "attendee" | null;