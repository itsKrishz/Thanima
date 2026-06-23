import { Card } from "@/components/ui/Card";
import type { RsvpSummary } from "@/lib/types/rsvp";

const cards: Array<{
  label: string;
  key: keyof RsvpSummary;
  accent: string;
}> = [
  { label: "Total Responses", key: "totalResponses", accent: "text-sargam-green" },
  { label: "Attending", key: "attending", accent: "text-sargam-green" },
  { label: "Not Attending", key: "notAttending", accent: "text-sargam-crimson" },
  { label: "Maybe", key: "maybe", accent: "text-sargam-gold" },
  { label: "Total Sadhya Count", key: "totalSadhya", accent: "text-sargam-crimson" },
];

export function SummaryCards({ summary }: { summary: RsvpSummary }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.key} className="p-5">
          <p className="text-sm font-medium text-sargam-green/70">{card.label}</p>
          <p className={`mt-2 font-serif text-4xl ${card.accent}`}>
            {summary[card.key]}
          </p>
        </Card>
      ))}
    </div>
  );
}
