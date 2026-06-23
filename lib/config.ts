export const RSVP_CONFIG = {
  // Configurable RSVP edit deadline.
  // Set to a past date to disable editing, or a future date to allow editing.
  // Format: ISO 8601 string (e.g. "2026-12-31T23:59:59Z").
  EDIT_DEADLINE: "2026-12-31T23:59:59Z",
};

export function isEditDeadlinePassed(): boolean {
  const deadlineStr = process.env.NEXT_PUBLIC_RSVP_EDIT_DEADLINE || RSVP_CONFIG.EDIT_DEADLINE;
  if (!deadlineStr) return false;
  const deadline = new Date(deadlineStr);
  return new Date() > deadline;
}
