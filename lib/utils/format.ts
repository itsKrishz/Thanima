import type { AttendingStatus, Rsvp, RsvpSummary } from "@/lib/types/rsvp";

export function formatAttendingStatus(status: AttendingStatus): string {
  const labels: Record<AttendingStatus, string> = {
    yes: "Attending",
    no: "Not Attending",
    maybe: "Maybe",
  };
  return labels[status];
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateString));
}

export function computeSummary(rsvps: Rsvp[]): RsvpSummary {
  return rsvps.reduce<RsvpSummary>(
    (summary, rsvp) => {
      if (rsvp.is_deleted) return summary;

      summary.totalResponses += 1;

      if (rsvp.attending_status === "yes") {
        summary.attending += 1;
      } else if (rsvp.attending_status === "no") {
        summary.notAttending += 1;
      } else {
        summary.maybe += 1;
      }

      return summary;
    },
    {
      totalResponses: 0,
      attending: 0,
      notAttending: 0,
      maybe: 0,
    },
  );
}
