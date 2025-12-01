import { z } from "zod";

export const userValidation = {
  registerUser: z.object({
    body: z.object({
      fullName: z
        .string({ required_error: "Full name is required" })
        .min(3, "Full name must be at least 3 characters")
        .max(100, "Full name must not exceed 100 characters"),
      email: z
        .string({ required_error: "Email is required" })
        .email("Invalid email address"),
      password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters")
        .max(100, "Password must not exceed 100 characters"),
    }),
  }),
};
