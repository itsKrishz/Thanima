"use client";

import type { UseFormReturn } from "react-hook-form";
import { RadioGroup } from "@/components/ui/RadioGroup";
import type { AttendingStatus, SadhyaStatus } from "@/lib/types/rsvp";
import type { RsvpSchema } from "@/lib/validations/rsvp";

export function AttendanceSection({
  attendingStatus,
  form,
}: {
  attendingStatus: AttendingStatus;
  form: UseFormReturn<RsvpSchema>;
}) {
  return (
    <div className="space-y-6 border-t border-sargam-gold/20 pt-6">
      <RadioGroup
        name="attending_status"
        label="Will you be attending SARGAM'26? *"
        value={attendingStatus}
        options={[
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
          { label: "Maybe", value: "maybe" },
        ]}
        onChange={(value: AttendingStatus) => {
          form.setValue("attending_status", value, { shouldValidate: true });
          if (value !== "yes") {
            form.setValue("special_requirements", "");
          }
        }}
        error={form.formState.errors.attending_status?.message}
      />

      {/* Special requirements textarea removed */}
    </div>
  );
}
