import { z } from "zod";

export const registerValidation = z.object({
  body: z.object({
    fullName: z.string().min(2, "Name is required"),
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be 6+ chars"),
  }),
});
