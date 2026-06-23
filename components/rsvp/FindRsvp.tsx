"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type FindRsvpProps = {
  onSuccess: (id: string) => void;
  onCancel: () => void;
};

export function FindRsvp({ onSuccess, onCancel }: FindRsvpProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    if (!/^[6-9]\d{9}$/.test(phoneNumber.trim())) {
      setError("Enter a valid 10-digit Indian phone number.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/rsvp/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: phoneNumber.trim(),
          email: email.trim() || undefined,
        }),
      });

      const payload = (await response.json()) as { error?: string; id?: string };

      if (!response.ok) {
        setError(payload.error ?? "No matching RSVP found. Check your details.");
        setLoading(false);
        return;
      }

      if (payload.id) {
        onSuccess(payload.id);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto max-w-md">
      <div className="mb-6">
        <h2 className="font-serif text-2xl text-sargam-crimson">Find My RSVP</h2>
        <p className="mt-2 text-sm text-sargam-green/75">
          Enter the phone number and optional email address used for your registration to recover your session.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Phone Number *"
          placeholder="10-digit mobile number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          maxLength={10}
          inputMode="numeric"
          required
        />
        <Input
          label="Email Address (If provided during registration)"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error ? (
          <p className="rounded-xl border border-sargam-crimson/30 bg-sargam-crimson/5 px-4 py-3 text-sm text-sargam-crimson">
            {error}
          </p>
        ) : null}

        <div className="flex gap-3">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Searching..." : "Find RSVP"}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
