import { z } from "zod";

export const userValidation = {
  registerUser: z.object({
    fullName: z.string().min(3, "Full name must be at least 3 characters"),

    email: z
      // .string()
      .email("Invalid email address"),

    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
};
