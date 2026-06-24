"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AttendanceSection } from "@/components/rsvp/AttendanceSection";
import { SuccessMessage } from "@/components/rsvp/SuccessMessage";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { rsvpSchema, type RsvpSchema } from "@/lib/validations/rsvp";
import type { Rsvp } from "@/lib/types/rsvp";

const DEPARTMENTS = [
  "Computer Science",
  "Electronics",
  "Mechanical",
  "Civil",
  "Electrical",
  "Information Technology",
  "Other",
];

export function RsvpForm({
  initialData,
  onSuccess,
  isAdmin = false,
}: {
  initialData?: Rsvp;
  onSuccess?: () => void;
  isAdmin?: boolean;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<RsvpSchema>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      full_name: initialData?.full_name ?? "",
      registration_number: initialData?.registration_number ?? "",
      graduation_year: initialData?.graduation_year ?? "",
      department: initialData?.department ?? "",
      current_occupation: initialData?.current_occupation ?? "",
      phone_number: initialData?.phone_number ?? "",
      email: initialData?.email ?? "",
      attending_status: initialData?.attending_status ?? "yes",
      special_requirements: initialData?.special_requirements ?? "",
    },
  });

  const attendingStatus = form.watch("attending_status");

  async function onSubmit(values: RsvpSchema) {
    setSubmitError(null);

    const isEdit = !!initialData;
    const url = isAdmin ? "/api/admin/rsvp" : "/api/rsvp";
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          id: initialData?.id,
          email: values.email || undefined,
          special_requirements: values.special_requirements || undefined,
        }),
      });

      let errorMsg = `Unable to ${isEdit ? "update" : "submit"} RSVP (Status ${response.status}). Please try again.`;

      try {
        const payload = (await response.json()) as { error?: string };
        if (payload && payload.error) {
          errorMsg = payload.error;
        }
      } catch {
        errorMsg = `Server Error (${response.status}): Please check if you have run the database migration and configured the environment variables on Vercel.`;
      }

      if (!response.ok) {
        setSubmitError(errorMsg);
        return;
      }

      if (onSuccess) {
        onSuccess();
      } else {
        setSubmitted(true);
      }
    } catch (err: any) {
      setSubmitError(`Network or connection error: ${err.message || err}`);
    }
  }

  function handleReset() {
    form.reset();
    setSubmitted(false);
    setSubmitError(null);
  }

  if (submitted) {
    return <SuccessMessage onReset={handleReset} />;
  }

  return (
    <Card>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-6 md:grid-cols-2">
          <Input
            label="Full Name *"
            placeholder="Enter your full name"
            error={form.formState.errors.full_name?.message}
            {...form.register("full_name")}
          />
          <Input
            label="Registration Number *"
            placeholder="Enter your registration number"
            error={form.formState.errors.registration_number?.message}
            {...form.register("registration_number")}
          />
          <Input
            label="Graduation Year / Batch *"
            placeholder="e.g. 2020"
            error={form.formState.errors.graduation_year?.message}
            {...form.register("graduation_year")}
          />
          <div className="space-y-2">
            <label
              htmlFor="department"
              className="block text-sm font-medium text-sargam-green"
            >
              Department *
            </label>
            <input
              id="department"
              list="departments"
              placeholder="Select or type your department"
              className="w-full rounded-xl border border-sargam-gold/40 bg-white px-4 py-3 text-sm text-sargam-green placeholder:text-sargam-green/40 focus:border-sargam-gold focus:outline-none focus:ring-2 focus:ring-sargam-gold/30"
              {...form.register("department")}
            />
            <datalist id="departments">
              {DEPARTMENTS.map((department) => (
                <option key={department} value={department} />
              ))}
            </datalist>
            {form.formState.errors.department?.message ? (
              <p className="text-sm text-sargam-crimson">
                {form.formState.errors.department.message}
              </p>
            ) : null}
          </div>
          <Input
            label="What are you currently doing? *"
            placeholder="e.g. Software Engineer at Google, Higher Studies, etc."
            error={form.formState.errors.current_occupation?.message}
            {...form.register("current_occupation")}
          />
          <Input
            label="Phone Number *"
            placeholder="10-digit mobile number"
            inputMode="numeric"
            maxLength={10}
            error={form.formState.errors.phone_number?.message}
            {...form.register("phone_number")}
          />
          <div className="md:col-span-2">
            <Input
              label="Email Address *"
              type="email"
              placeholder="you@example.com"
              error={form.formState.errors.email?.message}
              {...form.register("email")}
            />
          </div>
        </div>

        <AttendanceSection
          attendingStatus={attendingStatus}
          form={form}
        />

        {submitError ? (
          <p className="rounded-xl border border-sargam-crimson/30 bg-sargam-crimson/5 px-4 py-3 text-sm text-sargam-crimson">
            {submitError}
          </p>
        ) : null}

        <div className="flex gap-4">
          <Button
            type="submit"
            className="flex-1 sm:flex-none sm:px-8"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Submitting..."
              : initialData
                ? "Update RSVP"
                : "Submit RSVP"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
