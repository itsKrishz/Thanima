"use client";

import type { UseFormReturn } from "react-hook-form";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { Textarea } from "@/components/ui/Textarea";
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
            form.setValue("sadhya_status", undefined);
            form.setValue("special_requirements", "");
          } else if (!form.getValues("sadhya_status")) {
            form.setValue("sadhya_status", "yes");
          }
        }}
        error={form.formState.errors.attending_status?.message}
      />

      {attendingStatus === "yes" ? (
        <>
          <RadioGroup
            name="sadhya_status"
            label="Will you attend the Onam Sadhya? *"
            value={form.watch("sadhya_status") ?? "yes"}
            options={[
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ]}
            onChange={(value: SadhyaStatus) =>
              form.setValue("sadhya_status", value, { shouldValidate: true })
            }
            error={form.formState.errors.sadhya_status?.message}
          />

          <Textarea
            label="Any Special Requirements?"
            placeholder="Dietary restrictions, accessibility needs, or other notes"
            error={form.formState.errors.special_requirements?.message}
            {...form.register("special_requirements")}
          />
        </>
      ) : null}
    </div>
  );
}
