import type { Rsvp } from "@/lib/types/rsvp";
import { formatAttendingStatus, formatDate, formatSadhyaStatus } from "@/lib/utils/format";

function escapeCsvValue(value: string | number | null | undefined): string {
  const stringValue = value == null ? "" : String(value);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

export function rsvpsToCsv(rsvps: Rsvp[]): string {
  const headers = [
    "Name",
    "Batch",
    "Department",
    "Phone Number",
    "Email",
    "Attendance Status",
    "Sadhya Status",
    "Special Requirements",
    "Submission Date",
  ];

  const rows = rsvps.map((rsvp) =>
    [
      rsvp.full_name,
      rsvp.graduation_year,
      rsvp.department,
      rsvp.phone_number,
      rsvp.email ?? "",
      formatAttendingStatus(rsvp.attending_status),
      formatSadhyaStatus(rsvp.sadhya_status),
      rsvp.special_requirements ?? "",
      formatDate(rsvp.created_at),
    ]
      .map(escapeCsvValue)
      .join(","),
  );

  return [headers.join(","), ...rows].join("\n");
}
