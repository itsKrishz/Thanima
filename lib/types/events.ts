/** Reserved for future multi-event support (QR, tickets, notifications). */
export interface Event {
  id: string;
  name: string;
  slug: string;
  starts_at: string;
  ends_at: string | null;
  is_active: boolean;
}
