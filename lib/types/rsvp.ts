export type AttendingStatus = "yes" | "no" | "maybe";
export type SadhyaStatus = "yes" | "no";

export interface Rsvp {
  id: string;
  full_name: string;
  registration_number: string;
  graduation_year: string;
  department: string;
  current_occupation: string;
  phone_number: string;
  email: string | null;
  attending_status: AttendingStatus;
  sadhya_status: SadhyaStatus | null;
  guest_count: number;
  special_requirements: string | null;
  created_at: string;
  updated_at?: string | null;
  is_deleted?: boolean;
  deleted_at?: string | null;
}

export interface RsvpFormInput {
  full_name: string;
  registration_number: string;
  graduation_year: string;
  department: string;
  current_occupation: string;
  phone_number: string;
  email?: string;
  attending_status: AttendingStatus;
  sadhya_status?: SadhyaStatus;
  special_requirements?: string;
}

export interface RsvpSummary {
  totalResponses: number;
  attending: number;
  notAttending: number;
  maybe: number;
}
