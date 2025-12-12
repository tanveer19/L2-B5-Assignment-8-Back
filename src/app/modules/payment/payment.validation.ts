import { z } from "zod";

export const paymentValidation = {
  createCheckoutSession: z.object({
    body: z.object({
      plan: z.enum(["MONTHLY", "YEARLY"]).refine((val) => val, {
        message: "Plan must be MONTHLY or YEARLY",
      }),
    }),
  }),

  verifySession: z.object({
    query: z.object({
      session_id: z.string().min(1, "Session ID is required"),
    }),
  }),
};
