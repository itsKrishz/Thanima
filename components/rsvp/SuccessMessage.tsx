"use client";

import { Card } from "@/components/ui/Card";

export function SuccessMessage({ onReset }: { onReset: () => void }) {
  return (
    <Card className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sargam-green/10">
        <span className="text-3xl text-sargam-green">✓</span>
      </div>
      <h2 className="font-serif text-3xl text-sargam-crimson">
        RSVP Submitted Successfully
      </h2>
      <p className="mt-3 text-sargam-green/80">
        Thank you for confirming your response. We look forward to celebrating
        SARGAM&apos;26 with you.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 text-sm font-semibold text-sargam-crimson underline-offset-4 hover:underline"
      >
        Submit another response
      </button>
    </Card>
  );
}
