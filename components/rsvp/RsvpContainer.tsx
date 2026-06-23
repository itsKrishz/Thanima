"use client";

import { useState } from "react";
import { RsvpForm } from "@/components/rsvp/RsvpForm";
import { FindRsvp } from "@/components/rsvp/FindRsvp";
import { CountdownTimer } from "@/components/rsvp/CountdownTimer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { Rsvp } from "@/lib/types/rsvp";
import { formatAttendingStatus, formatSadhyaStatus } from "@/lib/utils/format";
import { isEditDeadlinePassed } from "@/lib/config";

export function RsvpContainer({ initialRsvp }: { initialRsvp: Rsvp | null }) {
  const [rsvp] = useState<Rsvp | null>(initialRsvp);
  const [mode, setMode] = useState<"form" | "already_submitted" | "edit" | "find">(
    initialRsvp ? "already_submitted" : "form",
  );

  const deadlinePassed = isEditDeadlinePassed();

  if (mode === "already_submitted" && rsvp) {
    return (
      <div className="space-y-6">
        <Card className="border-sargam-gold bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sargam-gold">
                Registration Confirmed
              </p>
              <h2 className="font-serif text-2xl text-sargam-crimson mt-1">
                You have already submitted an RSVP.
              </h2>
            </div>
            {!deadlinePassed ? (
              <Button onClick={() => setMode("edit")} className="self-start md:self-auto">
                Edit Response
              </Button>
            ) : null}
          </div>

          {deadlinePassed ? (
            <div className="mb-6 rounded-xl border border-sargam-gold/30 bg-sargam-cream/50 px-4 py-3 text-sm text-sargam-green/80">
              <strong>Notice:</strong> The editing deadline has passed. If you need to make any changes to your RSVP, please contact the organizers directly at <strong>info@sargam26.org</strong>.
            </div>
          ) : null}

          <div className="divide-y divide-sargam-gold/10">
            <div className="grid grid-cols-3 py-3 text-sm">
              <span className="font-medium text-sargam-green/60">Full Name</span>
              <span className="col-span-2 text-sargam-green font-semibold">{rsvp.full_name}</span>
            </div>
            <div className="grid grid-cols-3 py-3 text-sm">
              <span className="font-medium text-sargam-green/60">Batch / Year</span>
              <span className="col-span-2 text-sargam-green">{rsvp.graduation_year}</span>
            </div>
            <div className="grid grid-cols-3 py-3 text-sm">
              <span className="font-medium text-sargam-green/60">Department</span>
              <span className="col-span-2 text-sargam-green">{rsvp.department}</span>
            </div>
            <div className="grid grid-cols-3 py-3 text-sm">
              <span className="font-medium text-sargam-green/60">Phone Number</span>
              <span className="col-span-2 text-sargam-green">{rsvp.phone_number}</span>
            </div>
            <div className="grid grid-cols-3 py-3 text-sm">
              <span className="font-medium text-sargam-green/60">Email</span>
              <span className="col-span-2 text-sargam-green">{rsvp.email || "—"}</span>
            </div>
            <div className="grid grid-cols-3 py-3 text-sm">
              <span className="font-medium text-sargam-green/60">Attendance</span>
              <span className="col-span-2 text-sargam-green font-semibold">
                {formatAttendingStatus(rsvp.attending_status)}
              </span>
            </div>
            {rsvp.attending_status === "yes" && (
              <>
                <div className="grid grid-cols-3 py-3 text-sm">
                  <span className="font-medium text-sargam-green/60">Onam Sadhya</span>
                  <span className="col-span-2 text-sargam-green font-semibold">
                    {formatSadhyaStatus(rsvp.sadhya_status)}
                  </span>
                </div>
                <div className="grid grid-cols-3 py-3 text-sm">
                  <span className="font-medium text-sargam-green/60">Special Requirements</span>
                  <span className="col-span-2 text-sargam-green">
                    {rsvp.special_requirements || "None"}
                  </span>
                </div>
              </>
            )}
          </div>
        </Card>
        <CountdownTimer targetDate="2026-08-19T10:00:00" />
      </div>
    );
  }

  if (mode === "edit" && rsvp) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-sargam-crimson">Edit Your RSVP</h2>
          <Button variant="secondary" onClick={() => setMode("already_submitted")}>
            Cancel
          </Button>
        </div>
        <RsvpForm
          initialData={rsvp}
          onSuccess={() => {
            window.location.reload();
          }}
        />
      </div>
    );
  }

  if (mode === "find") {
    return (
      <FindRsvp
        onSuccess={() => {
          window.location.reload();
        }}
        onCancel={() => setMode(rsvp ? "already_submitted" : "form")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <RsvpForm
        onSuccess={() => {
          window.location.reload();
        }}
      />
      <div className="text-center">
        <button
          onClick={() => setMode("find")}
          className="text-sm font-medium text-sargam-gold hover:text-sargam-crimson transition-colors"
        >
          Already submitted an RSVP? Find and edit it here
        </button>
      </div>
    </div>
  );
}
