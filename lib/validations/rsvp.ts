import { z } from "zod";

export const rsvpSchema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name is too long"),
    graduation_year: z
      .string()
      .trim()
      .min(4, "Graduation year is required")
      .max(10, "Graduation year is too long"),
    department: z
      .string()
      .trim()
      .min(2, "Department is required")
      .max(100, "Department is too long"),
    phone_number: z
      .string()
      .trim()
      .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number"),
    email: z
      .string()
      .trim()
      .min(1, "Email address is required")
      .email("Enter a valid email address"),
    attending_status: z.enum(["yes", "no", "maybe"]),
    sadhya_status: z.enum(["yes", "no"]).optional(),
    special_requirements: z.string().trim().max(1000).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.attending_status === "yes" && !data.sadhya_status) {
      ctx.addIssue({
        code: "custom",
        message: "Please select your Onam Sadhya preference",
        path: ["sadhya_status"],
      });
    }
  });

export type RsvpSchema = z.infer<typeof rsvpSchema>;
